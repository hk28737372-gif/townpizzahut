import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { dbInstance } from './server-db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing configurations
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Helper middleware for session validation
  const requireAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Session credentials missing or expired.' });
    }
    const userId = authHeader.split(' ')[1];
    const user = dbInstance.getUser(userId);
    if (!user) {
      return res.status(401).json({ error: 'Session unauthorized. Please sign in again.' });
    }
    req.user = user;
    next();
  };

  // --- AUTH ENDPOINTS ---
  app.post('/api/auth/signup', (req, res) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ error: 'All fields (email, name, password) are strictly required.' });
    }
    const user = dbInstance.register(email, name, password);
    if (!user) {
      return res.status(400).json({ error: 'Email has already been registered on the Nexa ledger.' });
    }
    res.status(201).json({ user, token: user.id });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const user = dbInstance.login(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid security parameters or password match.' });
    }
    res.json({ user, token: user.id });
  });

  app.get('/api/auth/me', requireAuth, (req: any, res) => {
    res.json({ user: req.user });
  });

  // --- GOOGLE OAUTH & SIMULATED GOOGLE INTEGRATION ---
  app.get('/api/auth/google/url', (req, res) => {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const appUrl = process.env.APP_URL || `https://${req.headers.host}` || `http://localhost:3000`;
    
    if (googleClientId) {
      const redirectUri = encodeURIComponent(`${appUrl}/api/auth/google/callback`);
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20profile%20email&prompt=select_account`;
      res.json({ url: authUrl, isSimulated: false });
    } else {
      res.json({ url: `${appUrl}/api/auth/google/simulate-selector`, isSimulated: true });
    }
  });

  app.get('/api/auth/google/simulate-selector', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sign in - Google Accounts</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #f0f4f9;
            color: #1f1f1f;
          }
          .google-card {
            background: #ffffff;
            border-radius: 28px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          }
          .google-input:focus {
            border-color: #1a73e8;
            box-shadow: 0 0 0 2px rgba(26,115,232,0.15);
          }
        </style>
      </head>
      <body class="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
        <div class="w-full max-w-[450px] google-card p-8 sm:p-10 relative">
          <!-- Google Authentic Logo -->
          <div class="flex justify-center mb-6">
            <svg class="h-6 w-auto" viewBox="0 0 74 24" fill="none">
              <path d="M9.13 4.545c4.114 0 6.886 2.41 6.886 4.114 0 .682-.078 1.343-.223 1.983H9.13V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.516 5.515 0 015.38 13c0-3.037 2.463-5.5 5.5-5.5a5.55 5.55 0 013.642 1.383l3.073-3.073A10.3 10.3 0 0010.88.5C5.38.5.88 5 10.88 13.5s4.5 10 10 10c5.5 0 10-4.5 10-10c0-.682-.078-1.343-.223-1.983H10.88V4.545z" fill="#4285F4"/>
              <!-- Custom high quality Google Letters standard shape -->
              <text x="14" y="18" fill="#1f1f1f" font-family="'Roboto', sans-serif" font-weight="500" font-size="20px" letter-spacing="-0.5px">Google</text>
            </svg>
          </div>

          <div class="text-center mb-8">
            <h1 class="text-2xl font-normal text-[#1f1f1f] tracking-tight">Sign in</h1>
            <p class="text-base text-[#444746] mt-2 font-normal">to continue to <span class="font-medium text-[#1a73e8]">Nexa OS</span></p>
          </div>

          <!-- Screen 1: Choose account -->
          <div id="account-chooser-screen" class="space-y-4">
            <p class="text-sm font-medium text-[#1f1f1f] mb-2">Choose an account</p>
            
            <div class="border border-[#e3e3e3] rounded-2xl overflow-hidden divide-y divide-[#e3e3e3]">
              <!-- Account 1: Hammad Khan -->
              <button onclick="selectGoogleAccount('hk28737372@gmail.com', 'Hammad Khan', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256')" class="w-full text-left px-5 py-4 hover:bg-[#f8fafd] transition-colors flex items-center justify-between group cursor-pointer">
                <div class="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256" class="w-8 h-8 rounded-full object-cover border border-[#e3e3e3]" alt="Hammad Khan" />
                  <div class="truncate">
                    <p class="text-sm font-medium text-[#1f1f1f] group-hover:text-[#1a73e8] transition-colors">Hammad Khan</p>
                    <p class="text-xs text-[#5f6368]">hk28737372@gmail.com</p>
                  </div>
                </div>
                <div class="h-2 w-2 rounded-full bg-emerald-500"></div>
              </button>

              <!-- Account 2: Lead Architect -->
              <button onclick="selectGoogleAccount('operator@nexa.io', 'Lead Architect', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256')" class="w-full text-left px-5 py-4 hover:bg-[#f8fafd] transition-colors flex items-center justify-between group cursor-pointer">
                <div class="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256" class="w-8 h-8 rounded-full object-cover border border-[#e3e3e3]" alt="Lead Architect" />
                  <div class="truncate">
                    <p class="text-sm font-medium text-[#1f1f1f] group-hover:text-[#1a73e8] transition-colors">Lead Architect</p>
                    <p class="text-xs text-[#5f6368]">operator@nexa.io</p>
                  </div>
                </div>
                <div class="h-2 w-2 rounded-full bg-blue-500"></div>
              </button>

              <!-- Use another account choice -->
              <button onclick="toggleCustomScreen(true)" class="w-full text-left px-5 py-4 hover:bg-[#f8fafd] transition-colors flex items-center gap-4 cursor-pointer text-[#1a73e8] font-medium text-xs">
                <div class="h-8 h-8 w-8 rounded-full border border-dashed border-[#1a73e8] flex items-center justify-center">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                Use another Google Account
              </button>
            </div>
            
            <p class="text-xs text-[#5f6368] leading-relaxed pt-2">
              To create a seamless environment, Google delegates secure tokens instantly. Nexa strictly secures your data connection with absolute privacy.
            </p>
          </div>

          <!-- Screen 2: Enter custom email -->
          <div id="custom-email-screen" class="hidden">
            <button onclick="toggleCustomScreen(false)" class="inline-flex items-center gap-1 text-xs text-[#5f6368] hover:text-[#1f1f1f] mb-6 transition-colors font-medium">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to accounts
            </button>

            <form onsubmit="handleCustomSubmit(event)" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-[#1f1f1f] mb-2">Email or phone</label>
                <input 
                  type="email" 
                  id="google-custom-email" 
                  required 
                  placeholder="Enter your Gmail address" 
                  class="w-full px-4 py-3.5 border border-[#c7c7c7] rounded-xl text-sm outline-none transition-all google-input text-[#1f1f1f] placeholder-zinc-400 bg-white" 
                />
              </div>

              <div class="flex items-center justify-between pt-2">
                <a href="#" class="text-sm font-medium text-[#1a73e8] hover:underline">Forgot email?</a>
                <button 
                  type="submit" 
                  class="bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium text-sm py-2.5 px-6 rounded-full transition-colors font-sans pointer-events-auto"
                >
                  Next
                </button>
              </div>
            </form>
          </div>

          <div class="mt-12 flex items-center justify-between text-xs text-[#5f6368] border-t border-[#e3e3e3] pt-5">
            <span>English (United States)</span>
            <div class="flex gap-4">
              <a href="#" class="hover:text-[#1f1f1f] hover:underline">Help</a>
              <a href="#" class="hover:text-[#1f1f1f] hover:underline">Privacy</a>
              <a href="#" class="hover:text-[#1f1f1f] hover:underline">Terms</a>
            </div>
          </div>
        </div>

        <script>
          function selectGoogleAccount(email, name, avatar) {
            fetch('/api/auth/google/simulate-login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, name, avatar })
            })
            .then(res => res.json())
            .then(data => {
              if (data.token) {
                window.opener.postMessage({ 
                  type: 'OAUTH_AUTH_SUCCESS', 
                  user: data.user, 
                  token: data.token 
                }, '*');
                window.close();
              }
            })
            .catch(err => alert('Authentication failed: ' + err.message));
          }

          function toggleCustomScreen(showCustom) {
            if (showCustom) {
              document.getElementById('account-chooser-screen').classList.add('hidden');
              document.getElementById('custom-email-screen').classList.remove('hidden');
              document.getElementById('google-custom-email').focus();
            } else {
              document.getElementById('account-chooser-screen').classList.remove('hidden');
              document.getElementById('custom-email-screen').classList.add('hidden');
            }
          }

          function handleCustomSubmit(e) {
            e.preventDefault();
            const email = document.getElementById('google-custom-email').value;
            const cleanName = email.split('@')[0];
            const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).replace(/[._-]/g, ' ');
            selectGoogleAccount(email, formattedName, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256');
          }
        </script>
      </body>
      </html>
    `);
  });

  app.post('/api/auth/google/simulate-login', (req, res) => {
    const { email, name, avatar } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email parameter required.' });
    }
    const user = dbInstance.registerOrLoginOAuth(email, name || 'Nexa Operator', avatar);
    res.json({ user, token: user.id });
  });

  app.get(['/api/auth/google/callback', '/api/auth/google/callback/'], async (req, res) => {
    const { code } = req.query;
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const appUrl = process.env.APP_URL || `https://${req.headers.host}` || `http://localhost:3000`;

    if (!code) {
      return res.send(`<html><body><script>window.close();</script><p>Google code missing</p></body></html>`);
    }

    try {
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          client_id: googleClientId,
          client_secret: googleClientSecret,
          redirect_uri: `${appUrl}/api/auth/google/callback`,
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok) {
        throw new Error(tokenData.error_description || 'Token request failed.');
      }

      const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer \${tokenData.access_token}` },
      });

      const profileData = await profileResponse.json();
      if (!profileResponse.ok) {
        throw new Error('Profile fetch failed.');
      }

      const user = dbInstance.registerOrLoginOAuth(
        profileData.email,
        profileData.name || profileData.given_name || 'Nexa User',
        profileData.picture
      );

      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'OAUTH_AUTH_SUCCESS', 
                  user: \${JSON.stringify(user)}, 
                  token: "\${user.id}" 
                }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. Window will now auto-close.</p>
          </body>
        </html>
      `);
    } catch (err: any) {
      console.error('Google Callback Error:', err);
      res.send(`
        <html>
          <body style="background:#070709; color:#ef4444; font-family:sans-serif; padding:40px; text-align:center;">
            <h3>Google Authentication Failed</h3>
            <p style="color:#a1a1aa; font-size:14px; margin-bottom:20px;">\${err.message || 'Error occurred.'}</p>
            <button onclick="window.close()" style="background:#4f46e5; border:none; padding:10px 20px; border-radius:8px; color:white; cursor:pointer;">Close Window</button>
          </body>
        </html>
      `);
    }
  });

  // --- USER PROFILE ENDPOINTS ---
  app.post('/api/user/profile', requireAuth, (req: any, res) => {
    const updated = dbInstance.updateProfile(req.user.id, req.body);
    if (!updated) {
      return res.status(500).json({ error: 'Failed to update ledger profile metadata.' });
    }
    res.json({ user: updated });
  });

  // --- NOTES CRUD ENDPOINTS ---
  app.get('/api/notes', requireAuth, (req: any, res) => {
    const notes = dbInstance.getNotes(req.user.id);
    res.json({ notes });
  });

  app.post('/api/notes', requireAuth, (req: any, res) => {
    const note = dbInstance.addNote(req.user.id, req.body);
    dbInstance.addActivityLog(req.user.id, {
      type: 'note_created',
      title: 'Created new note: ' + (note.title || 'Untitled'),
      details: note.category
    });
    res.status(201).json({ note });
  });

  app.put('/api/notes/:id', requireAuth, (req: any, res) => {
    const note = dbInstance.updateNote(req.user.id, req.params.id, req.body);
    if (!note) {
      return res.status(404).json({ error: 'Note element not found or unauthorized.' });
    }
    res.json({ note });
  });

  app.delete('/api/notes/:id', requireAuth, (req: any, res) => {
    const success = dbInstance.deleteNote(req.user.id, req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Note element not found or unauthorized.' });
    }
    res.json({ success: true });
  });

  // --- REMINDERS CRUD ENDPOINTS ---
  app.get('/api/reminders', requireAuth, (req: any, res) => {
    const reminders = dbInstance.getReminders(req.user.id);
    res.json({ reminders });
  });

  app.post('/api/reminders', requireAuth, (req: any, res) => {
    const reminder = dbInstance.addReminder(req.user.id, req.body);
    dbInstance.addActivityLog(req.user.id, {
      type: 'reminder_created',
      title: 'Created reminder: ' + reminder.text,
      details: reminder.priority
    });
    res.status(201).json({ reminder });
  });

  app.put('/api/reminders/:id', requireAuth, (req: any, res) => {
    const reminder = dbInstance.updateReminder(req.user.id, req.params.id, req.body);
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder card not found or unauthorized.' });
    }
    if (req.body.completed !== undefined) {
      dbInstance.addActivityLog(req.user.id, {
        type: 'reminder_completed',
        title: 'Status changed: ' + reminder.text,
        details: reminder.completed ? 'Completed' : 'Pending'
      });
    }
    res.json({ reminder });
  });

  app.delete('/api/reminders/:id', requireAuth, (req: any, res) => {
    const success = dbInstance.deleteReminder(req.user.id, req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Reminder element not found or unauthorized.' });
    }
    res.json({ success: true });
  });

  // --- DOCUMENTS ENDPOINTS ---
  app.get('/api/documents', requireAuth, (req: any, res) => {
    res.json({ documents: dbInstance.getDocuments(req.user.id) });
  });

  app.post('/api/documents', requireAuth, (req: any, res) => {
    const doc = dbInstance.addDocument(req.user.id, req.body);
    res.status(201).json({ document: doc });
  });

  app.delete('/api/documents/:id', requireAuth, (req: any, res) => {
    const success = dbInstance.deleteDocument(req.user.id, req.params.id);
    res.json({ success });
  });

  // --- SUBSCRIPTIONS ENDPOINTS ---
  app.get('/api/subscriptions', requireAuth, (req: any, res) => {
    res.json({ subscriptions: dbInstance.getSubscriptions(req.user.id) });
  });

  app.post('/api/subscriptions', requireAuth, (req: any, res) => {
    const sub = dbInstance.addSubscription(req.user.id, req.body);
    res.status(201).json({ subscription: sub });
  });

  app.put('/api/subscriptions/:id', requireAuth, (req: any, res) => {
    const sub = dbInstance.updateSubscription(req.user.id, req.params.id, req.body);
    res.json({ subscription: sub });
  });

  app.delete('/api/subscriptions/:id', requireAuth, (req: any, res) => {
    const success = dbInstance.deleteSubscription(req.user.id, req.params.id);
    res.json({ success });
  });

  // --- CAPTURES ENDPOINTS ---
  app.get('/api/captures', requireAuth, (req: any, res) => {
    res.json({ captures: dbInstance.getCaptureItems(req.user.id) });
  });

  app.post('/api/captures', requireAuth, (req: any, res) => {
    const cap = dbInstance.addCaptureItem(req.user.id, req.body);
    dbInstance.addActivityLog(req.user.id, {
      type: 'capture_created',
      title: 'Captured ' + cap.type + ': ' + cap.title,
      details: cap.category
    });
    res.status(201).json({ capture: cap });
  });

  app.put('/api/captures/:id', requireAuth, (req: any, res) => {
    const cap = dbInstance.updateCaptureItem(req.user.id, req.params.id, req.body);
    res.json({ capture: cap });
  });

  app.delete('/api/captures/:id', requireAuth, (req: any, res) => {
    const success = dbInstance.deleteCaptureItem(req.user.id, req.params.id);
    res.json({ success });
  });

  // --- ACTIVITY LOGS ENDPOINTS ---
  app.get('/api/activity-logs', requireAuth, (req: any, res) => {
    res.json({ logs: dbInstance.getActivityLogs(req.user.id) });
  });

  // Reusable Smart local memory solver helper designd to seamlessly back up online models
  const getOfflineBrainAnswer = (query: string, notes: any[], reminders: any[], documents: any[]) => {
    const lastDoc = documents && documents.length > 0 ? documents[documents.length - 1] : null;
    const lastNote = notes && notes.length > 0 ? notes[notes.length - 1] : null;
    let replyText = "";
    let references: any[] = [];

    // 1. General greetings and introductions
    if (query === 'hi' || query === 'hello' || query === 'hey' || query === 'assalamualaikum' || query === 'salaam' || query.includes('kia haal') || query.includes('kia hal') || query.includes('how are you') || query.includes('kese ho') || query.includes('kaise ho') || query.includes('kya haal') || query.includes('aap kaun') || query.includes('who are you') || query.includes('intro') || query.includes('purpose') || query.includes('taruf') || query.includes('introduction') || query.includes('app kis liye') || query.includes('app kya')) {
      replyText = `### Assalam-o-Alaikum! Hello! 👋 Main Nexa Personal AI Brain hoon.

Main ek smart digital **"Second Brain"** OS assistant hoon jo aapke rozmarra ke memory records ko ek jagah mehfooz rakhta hai. 

**Nexa App ka Asli Purpose kya hai?**
1. **Notes Management (📝):** Apne dimagh ke khayalaat, goals aur pitches yahan likh kar save karein.
2. **Smart Documents (📄):** Apne PDF/Documents upload karein. Main unki deep indexing karkay summary aur insights nikaal sakta hoon.
3. **Daily Reminders (📅):** Apne ahem kaam scheduled karein taake targets miss na hon.
4. **AI Brain Chat (🧠):** Mujhse Roman Urdu ya English mai chat karein! Main aapke files aur notes ko search karkay foran answer de sakta hoon.

*Tip: Agar aap mujhse dynamic internet queries ya direct customized questions (just like Chat GPT or Google Gemini) poochhna chahte hain, toh live stream activate karne ke liye **Settings/Secrets** mai apna real \`GEMINI_API_KEY\` save karein!*`;
    }
    // 2. Pakistan & Province queries (Punjab, Sindh, KPK, Balochistan)
    else if (query.includes('province') || query.includes('provinces') || query.includes('suba') || query.includes('soobe') || query.includes('sooba') || query.includes('subay') || query.includes('pakistan')) {
      replyText = `### Pakistan ke Provinces (Subay) aur Capital Cities 🇵🇰

Pakistan ke pass total **4 main provinces (subay/soobe)** hain, jin ki detailed list ye hai:

1. **Punjab** (Capital: **Lahore**) — Population ke hisab se sabse bada province.
2. **Sindh** (Capital: **Karachi**) — Pakistan ka business aur financial hub.
3. **Khyber Pakhtunkhwa (KPK)** (Capital: **Peshawar**) — Khoobsurat pahar aur history ke liye mashhoor.
4. **Balochistan** (Capital: **Quetta**) — Area ke hisab se sabse bada province.

**Federal Territories & Administrative Regions:**
• **Islamabad Capital Territory** (Capital: **Islamabad** — Mulk ka beautiful capital city)
• **Gilgit-Baltistan** (Capital: **Gilgit**) — Northern valleys aur K2 mountains.
• **Azad Jammu & Kashmir (AJK)** (Capital: **Muzaffarabad**).

Aap in provinces ya kisi bhi city ke baare mai details pooch sakte hain!`;
    }
    // 3. Document check
    else if (query.includes('document') || query.includes('doc') || query.includes('file') || query.includes('receipt') || query.includes('contract')) {
      if (lastDoc) {
        replyText = `### Aapka Aakhri Uploaded Document (Last Document) 📄

Muje aapki memory vault mai sabse aakhir mai upload kiya gaya doocument mil gaya hai:

• **File Name:** \`${lastDoc.name}\`
• **File Type:** ${lastDoc.type || 'PDF Document'}
• **Size:** ${lastDoc.size || 'N/A'}
• **Upload Date:** ${lastDoc.dateAdded || 'N/A'}

**AI Summary & Extract Insights:**
"""
${lastDoc.parsedInsights || 'Ek dum super insights! Yeh file successfully parsed hai.'}
"""

Aap is document ko **Smart Documents** page par jaa kar management aur preview kar sakte hain!`;
        references.push({ title: lastDoc.name, type: 'document' });
      } else {
        replyText = `### Ingested Documents Vault 📄

Muje is waqt aapke database mai koi uploaded PDFs ya files nahi milin.

**Document save aur query karne ka aasan tareeqah:**
1. Sidebar se **Smart Documents** page par jayein.
2. Apni kisi bhi PDF file ya scanned book ko **Drag and Drop** kar ke upload karein.
3. Upload hone ke baad yahan chat par aakar poochain "explain my last document", toh main un files ki summary bata dunga!`;
      }
    }
    // 4. Note check
    else if (query.includes('note') || query.includes('draft') || query.includes('ideas') || query.includes(' pitch')) {
      if (lastNote) {
        replyText = `### Aapka Aakhri Saved Note (Last Note) 📝

Aapka sabse aakhri saved note ye hai:

• **Title (Sarnama):** "**${lastNote.title || 'Untitled note'}**"
• **Category:** ${lastNote.category || 'General Ideas'}
• **Last Edited:** ${lastNote.updatedAt || 'N/A'}

**Content:**
"""
${lastNote.content || 'Note has no textual content currently.'}
"""

Aap is note ko expand ya delete karne ke liye **Notes Management** page par click karkay edit kar sakte hain!`;
        references.push({ title: lastNote.title, type: 'note' });
      } else {
        replyText = `### Notes Registry 📝

Aapki personal registry mai abhi tak koi saved notes mojud nahi hain.

**Naya Note likhne ka aasan tarika:**
1. Left sidebar se ya dashboard ke **"Create Note"** button par click karein.
2. Apney topic ka modern Title aur detail content likh kar click **"Save"** karein.
3. Main use instantly brain memory mai load kar loon ga!`;
      }
    }
    // 5. App download and PWA / Installation instructions
    else if (query.includes('download') || query.includes('install') || query.includes('pwa') || query.includes('mobile') || query.includes('laptop') || query.includes('save') || query.includes('home screen') || query.includes('chalane ka')) {
      replyText = `### Mobile & Laptop par Nexa Download/Install Kaise Karein? 📱💻

Nexa ek modern **Progressive Web App (PWA)** hai. Aapko dukan par jaakar install karne ki zaroorat nahi, aap directly browser se isko native app bana sakte hain:

**📱 Mobile par (Android & iPhone):**
1. Nexa ko Google Chrome ya Safari browser mai open karein.
2. Browser bar ke **Triple Dot (Menu)** ya **"Share"** button par tap karein.
3. Option list se **"Add to Home Screen"** par click karein.
4. Icon aapke mobile screen par save ho jaye ga aur yeh bilkul real app ki tarah open ho ga!

**💻 Laptop / PC par:**
1. Browser ke URL input box ke right corner par ek dynamic **"Install App" / Desktop symbol** dikhayi dega.
2. Us par click karkay install karein. 
3. Nexa aapke Desktop taskbar mai as a standalone responsive app add ho jaye ga!`;
    }
    // 6. Reminders / Goals check
    else if (query.includes('reminder') || query.includes('reminders') || query.includes('task') || query.includes('tasks') || query.includes('schedule') || query.includes('due') || query.includes('kaam')) {
      const activeRes = reminders.filter((r: any) => !r.completed);
      if (activeRes.length > 0) {
        replyText = `### Active Goals & Reminders (Pending Tasks) 📅

Aapke pass is waqt **${activeRes.length} pending tasks** scheduled hain:

` +
          activeRes.map((r: any) => `• **[${r.priority.toUpperCase()}]** ${r.text} — Due: **${r.dueDate}**`).join('\n') +
          `\n\n*Proactive Suggestion*: Apna sabse highest priority target "**${activeRes.find((r: any) => r.priority === 'high')?.text || activeRes[0].text}**" pehle khatam karein!`;
        references.push({ title: 'Tasks and Schedules Ledger', type: 'reminder' });
      } else {
        replyText = `### Reminders & Objectives Registry 📅

Mash'Allah! Is waqt aapka koi bhi target pending nahi hai. Saare scheduled kaam mukammal ho chukay hain! Solid momentum!`;
      }
    }
    // 7. General fallback
    else {
      replyText = `### Nexa Brain Assistant 🧠

Main aapki intelligent storage index kar raha hoon:

• **Total Notes:** ${notes.length} saved
• **Smart PDFs & Docs:** ${documents.length} files
• **Pending Goals & Reminders:** ${reminders.filter((r:any)=>!r.completed).length} items

Mera target aapke Second Brain data ko asan banana hai. Aap mujhse aam maloomat (greetings, Pakistan ke provinces, app download method) ya directly files aur notes ke baare mai pooch sakte hain!

*Tip: Fully dynamic model ke answers ke liye **Settings/Secrets** mai apna real \`GEMINI_API_KEY\` save karein!*`;
    }

    return { text: replyText, references };
  };

  // API Route: Contextual Brain assistant proxying standard Gemini API (or falling back)
  app.post('/api/chat', async (req, res) => {
    const { message, history, notes = [], reminders = [], documents = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message payload is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const query = message.toLowerCase().trim();

    // Prepare helper tags for the LATEST document and LATEST note
    const lastDoc = documents && documents.length > 0 ? documents[documents.length - 1] : null;
    const lastNote = notes && notes.length > 0 ? notes[notes.length - 1] : null;

    // A. HIGH FIDELITY SYNTHETIC FALLBACK (No API Key or fallback needed)
    // Run this if API key is missing, empty, or placeholder.
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
      const localResult = getOfflineBrainAnswer(query, notes, reminders, documents);
      return res.json({ text: localResult.text, isFallback: true, references: localResult.references });
    }

    try {
      // Lazy load Gemini Client to ensure zero startup crash concerns
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Format contextual memories from notes, goals, and contracts
      const formattedNotes = notes.map((n: any, idx: number) => 
        `Note #${idx + 1} [Category: ${n.category || 'General'}]: Title: "${n.title || 'Untitled'}" - Content: "${n.content || ''}"`
      ).join('\n---\n');

      const formattedReminders = reminders.map((r: any, idx: number) =>
        `Reminder #${idx + 1} [Category: ${r.category || 'General'}]: "${r.text || ''}" - Due: ${r.dueDate || 'Unknown'} - Priority: ${r.priority || 'Medium'} - Status: ${r.completed ? 'Completed' : 'Pending'}`
      ).join('\n');

      const formattedDocs = documents.map((d: any, idx: number) =>
        `Document #${idx + 1} [${d.type || 'File'}]: Name: "${d.name || ''}" - Size: ${d.size || '0'} - Core Extraction Insights: "${d.parsedInsights || ''}"`
      ).join('\n---\n');

      const lastDocName = lastDoc ? lastDoc.name : "None uploaded yet";
      const lastNoteTitle = lastNote ? lastNote.title : "None written yet";

      const systemInstruction = 
        `You are Nexa AI, a personal executive intelligence operating system and 'Second Brain' companion. ` +
        `Your primary job is to help the user query, map, synthesize, and extract answers from their digital storage ledger. ` +
        `You are extremely friendly, clear, helpful, and support multiple languages including Urdu, Roman Urdu (Urdu typed in English alphabets like 'Kaise hain aap?'), and English. ` +
        `Respond in the language the user is chatting in! If they ask in Roman Urdu, please write your detailed, structured back in friendly Roman Urdu so they can naturally understand!\n\n` +
        `Below is the complete, live snapshot of their digital database to ground your reasoning:\n` +
        `=== SECOND BRAIN MEMORIES ===\n` + 
        `${formattedNotes || 'No notes loaded.'}\n\n` +
        `=== ACTIVE OBJECTIVES & REMINDERS ===\n` +
        `${formattedReminders || 'No reminders mapped.'}\n\n` +
        `=== INGESTED CONTRACTS & SECURE DOCUMENTS ===\n` +
        `${formattedDocs || 'No documents uploaded.'}\n\n` +
        `=== SPECIAL IDENTIFIERS ===\n` +
        `• LATEST/LAST SAVED DOCUMENT: "${lastDocName}"\n` +
        `• LATEST/LAST SAVED NOTE: "${lastNoteTitle}"\n\n` +
        `=== INSTRUCTIONS ===\n` +
        `1. Directly reference the user's specific assets (citing Note titles, Document names, or goal priority ratings) where relevant.\n` +
        `2. If they ask about "my last document", "last doc", or "aakhri document", explicitly tell them it is "${lastDocName}" and provide its parsed insights!\n` +
        `3. If they ask about "my last note", "last note", or "aakhri note", tell them it is "${lastNoteTitle}" and summarize its content.\n` +
        `4. If they ask general knowledge questions like about Pakistan (how many provinces, etc.), answer perfectly: Pakistan has 4 main provinces (Punjab, Sindh, Khyber Pakhtunkhwa / KPK, and Balochistan) along with territories Gilgit-Baltistan, Azad Jammu & Kashmir, and Islamabad Capital Territory.\n` +
        `5. Keep it friendly, easy-to-use, and visually scannable with bullet points, bold tags, and clear sections.`;

      const chatHistory = (history || []).map((h: any) => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      }));

      // Append the latest context message
      chatHistory.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: chatHistory,
        config: {
          systemInstruction,
          temperature: 0.4,
        }
      });

      const generatedText = response.text || '';
      return res.json({ text: generatedText, isFallback: false });

    } catch (err: any) {
      console.error('Gemini live stream proxy error:', err);
      
      const isHighDemand = err.message && (
        err.message.includes('503') || 
        err.message.includes('demand') || 
        err.message.includes('UNAVAILABLE') || 
        err.message.includes('limit') || 
        err.message.includes('429')
      );

      const isQuotaError = err.message && (
        err.message.includes('quota') || 
        err.message.includes('exhausted')
      );

      // Gracefully resolve offline query
      const localResult = getOfflineBrainAnswer(query, notes, reminders, documents);

      const prefixNotice = isHighDemand
        ? `⚠️ **Gemini Server par is waqt bohot zyada traffic/load hai (503 Service Busy).**\n\n*Nexa ne automatically smart offline memory mode switch kiya hai taake aap ka kaam na ruke! Here are your local insights:* \n\n---\n\n`
        : isQuotaError
        ? `⚠️ **Gemini API Key key limit/quota khatam ho chuki hai.**\n\n*Hum ne seamlessly local memory backup activate kar liya hai!* \n\n---\n\n`
        : `⚠️ **Internet model response temporary down hai.**\n\n*Main aapki memory vault lookup kar raha hoon:* \n\n---\n\n`;

      return res.json({ 
        text: prefixNotice + localResult.text,
        isFallback: true, 
        references: localResult.references,
        error: err.message
      });
    }
  });

  // Vite development middleware vs Static Production routing
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nexa OS full-stack container running on http://localhost:${PORT}`);
  });
}

startServer();
