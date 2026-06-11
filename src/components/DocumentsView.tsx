import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Search, Star, Archive, Upload, Plus, ChevronRight, Tags, 
  Sparkles, Check, Trash2, ShieldCheck, Download, AlertCircle, FileCode
} from 'lucide-react';
import { Document } from '../types';

interface DocumentsViewProps {
  documents: Document[];
  onAddDocument: (doc: Document) => void;
  onDeleteDocument: (id: string) => void;
}

export default function DocumentsView({ 
  documents, 
  onAddDocument, 
  onDeleteDocument 
}: DocumentsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(documents[0] || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'starred' | 'archived'>('all');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiOutput, setAiOutput] = useState<{
    summary?: string;
    points?: string[];
    actions?: string[];
  } | null>(null);

  // Filter documents based on query and filter setting
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.parsedInsights.toLowerCase().includes(searchQuery.toLowerCase());
    
    // We didn't save explicitlyStarred in standard type but can support in-memory star/archive using name or id pattern
    // or simulate it
    return matchesSearch;
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateFileUpload(e.dataTransfer.files[0].name, e.dataTransfer.files[0].size);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateFileUpload(e.target.files[0].name, e.target.files[0].size);
    }
  };

  const simulateFileUpload = (name: string, rawSize: number) => {
    setIsUploading(true);
    setUploadProgress(10);
    
    const sizeStr = rawSize > 1024 * 1024 
      ? `${(rawSize / (1024 * 1024)).toFixed(1)} MB` 
      : `${(rawSize / 1024).toFixed(0)} KB`;

    const timer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            const fileExt = name.split('.').pop()?.toUpperCase() || 'PDF';
            const newDoc: Document = {
              id: `doc-${Date.now()}`,
              name,
              type: `${fileExt} Document`,
              dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              size: sizeStr,
              parsedInsights: `Synthesizing knowledge components for ${name}.\nKey topics: Automated Parsing Engine detected semantic records.\nVerification State: Verified successfully locally. Secure Sandbox active.`,
              isVerified: true
            };
            onAddDocument(newDoc);
            setSelectedDoc(newDoc);
            setIsUploading(false);
            setUploadProgress(0);
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const generateAiInsights = (doc: Document) => {
    setAiAnalyzing(true);
    setAiOutput(null);

    // Mock highly tailored neural summaries
    setTimeout(() => {
      let summary = `This document "${doc.name}" represents a high-priority digital asset. Nexa Semantic Engine parsed the node correctly.`;
      let points = [
        "Identified 3 core parameters including corporate structure & regulatory alignments.",
        "Contains high-level strategic alignment guidelines for next fiscal period.",
        "Verified system compatibility and encryption compliance standards in real-time."
      ];
      let actions = [
        "File corresponding tax status reports next Monday.",
        "Verify signature keys against the corporate database.",
        "Set calendar reminders for renewal schedules."
      ];

      if (doc.id === 'doc-1') {
        summary = "Comprehensive organizational record outlining legal structure, share limits, and system compliance standards for the registered entity.";
        points = [
          "Incorporated as LifeAdmin Systems LLC.",
          "Capitalized with 10,000,000 common stock assets authorized.",
          "Corporate agency services designated to CorpTrust Advisors LLC.",
          "State compliance validations checked active."
        ];
        actions = [
          "Transfer seed-related IP documentation into the central vaults.",
          "Issue initial shares to the core founding partners."
        ];
      } else if (doc.id === 'doc-2') {
        summary = "Commercial invoice statement tracking platform API compute costs, reflecting active operations activity.";
        points = [
          "Billing vendor identified as Stripe Payment Services Inc.",
          "Total outstanding balance: $1,420.00 USD for core compute cycles.",
          "Transaction status verified successfully processed."
        ];
        actions = [
          "Categorize expense under R&D Infrastructure tax write-offs.",
          "Match against the internal quarterly forecast ledger."
        ];
      }

      setAiOutput({ summary, points, actions });
      setAiAnalyzing(false);
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-indigo-400" />
            Smart Documents
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Secure vault for corporate and personal files. Instant semantic keyword processing and key item extractor.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
            className="hidden" 
          />
          <button
            type="button"
            id="docs-btn-upload"
            onClick={triggerFileInput}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition duration-200 cursor-pointer shadow-lg shadow-indigo-500/10"
          >
            <Upload className="h-4 w-4" />
            Upload PDF / DOCX
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Section: Document List & Drag Indicator (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Universal Search and Filter Card */}
          <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                id="docs-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search processed vaults..."
                className="w-full bg-[#09090c] border border-zinc-900 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50 transition-all font-medium placeholder-zinc-500"
              />
            </div>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-205 flex flex-col items-center justify-center gap-2 ${
              dragActive 
                ? 'border-indigo-500/50 bg-indigo-600/5 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                : 'border-zinc-850 hover:border-zinc-700 bg-zinc-950/20 hover:bg-zinc-950/40 text-zinc-400'
            }`}
          >
            <Upload className="h-6 w-6 text-zinc-500 mb-1" />
            <span className="text-xs font-semibold text-zinc-350">Drag & drop files here, or <span className="text-indigo-400">browse</span></span>
            <span className="text-[10px] text-zinc-500 font-mono">PDF, DOCX, TXT up to 50MB</span>
          </div>

          {/* Uploading State Visual Block */}
          {isUploading && (
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-zinc-300 animate-pulse">Hashing raw document nodes...</span>
                <span className="font-mono text-indigo-400">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                <div style={{ width: `${uploadProgress}%` }} className="bg-indigo-500 h-full transition-all duration-300" />
              </div>
            </div>
          )}

          {/* Active Vault Records */}
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {filteredDocs.length === 0 ? (
              <div className="bg-zinc-950/30 border border-zinc-900/50 rounded-2xl p-8 text-center">
                <AlertCircle className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
                <span className="block text-xs font-semibold text-zinc-400">No documents found</span>
                <span className="block text-[10px] text-zinc-500 font-light mt-1">Refine your Spotlight query terms</span>
              </div>
            ) : (
              filteredDocs.map((doc) => {
                const isSelected = selectedDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoc(doc);
                      setAiOutput(null);
                    }}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all duration-200 flex items-center justify-between group ${
                      isSelected 
                        ? 'bg-zinc-950 border-indigo-500/30 shadow-[0_4px_20px_rgba(99,102,241,0.02)]' 
                        : 'bg-[#09090c]/40 border-zinc-900/80 hover:bg-zinc-950/60 hover:border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-indigo-600/15 text-indigo-450' : 'bg-zinc-900 text-zinc-400 group-hover:text-indigo-400 transition-colors'
                      }`}>
                        {doc.name.endsWith('.docx') ? <FileText className="h-5 w-5" /> : doc.name.endsWith('.txt') ? <FileCode className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-zinc-200 truncate group-hover:text-white transition-colors">{doc.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono text-zinc-500">{doc.type}</span>
                          <span className="text-zinc-750 font-mono text-[9px]">•</span>
                          <span className="text-[10px] font-mono text-zinc-500">{doc.size}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      id={`delete-doc-${doc.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDocument(doc.id);
                        if (selectedDoc?.id === doc.id) {
                          setSelectedDoc(null);
                          setAiOutput(null);
                        }
                      }}
                      className="p-1.5 opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Section: Document Metadata View & Nexa AI Insights (7 Columns) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedDoc ? (
              <motion.div
                key={selectedDoc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-6 space-y-6"
              >
                {/* Micro Header with quick status details */}
                <div className="flex justify-between items-start gap-4 pb-4 border-b border-zinc-900">
                  <div className="min-w-0">
                    <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Verified File Node</span>
                    <h2 className="text-base sm:text-lg font-bold text-zinc-100 truncate mt-0.5">{selectedDoc.name}</h2>
                    <span className="text-[10px] font-mono text-indigo-400 mt-1 block">Uploaded on {selectedDoc.dateAdded}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => alert("Simulation: Downloading file to local directories")}
                      className="p-2 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-450 hover:text-white rounded-xl border border-zinc-850 cursor-pointer"
                      title="Download original file"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Sub Metadata Tags */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-[#09090c] border border-zinc-900 p-3 rounded-xl">
                    <span className="block text-[9px] font-mono text-zinc-500 uppercase">File Volume</span>
                    <span className="text-xs font-bold text-zinc-200 mt-1 block">{selectedDoc.size}</span>
                  </div>
                  <div className="bg-[#09090c] border border-zinc-900 p-3 rounded-xl">
                    <span className="block text-[9px] font-mono text-zinc-500 uppercase">Format</span>
                    <span className="text-xs font-bold text-zinc-200 mt-1 block font-mono">{selectedDoc.type}</span>
                  </div>
                  <div className="bg-[#09090c] border border-zinc-900 p-3 rounded-xl">
                    <span className="block text-[9px] font-mono text-zinc-500 uppercase">Origin State</span>
                    <span className="text-xs font-bold text-emerald-400 mt-1 block font-mono">Encrypted</span>
                  </div>
                  <div className="bg-[#09090c] border border-zinc-900 p-3 rounded-xl">
                    <span className="block text-[9px] font-mono text-zinc-500 uppercase">Integrity</span>
                    <span className="text-xs font-bold text-indigo-400 mt-1 block font-mono">100% Secure</span>
                  </div>
                </div>

                {/* Local Raw Parsed Overview */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-mono text-zinc-550 uppercase">Extracted Metadata Records</span>
                  <div className="bg-zinc-900/30 border border-zinc-850/50 p-4 rounded-xl text-xs text-zinc-300 leading-relaxed font-light whitespace-pre-line font-mono">
                    {selectedDoc.parsedInsights}
                  </div>
                </div>

                {/* Nexa AI Prompt Section */}
                <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                      </div>
                      <span className="text-xs font-bold text-zinc-100">Nexa Neural Assistant</span>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => generateAiInsights(selectedDoc)}
                      disabled={aiAnalyzing}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[10px] px-3 py-1.5 rounded-lg transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {aiAnalyzing ? 'Analyzing Node...' : 'Extract Summary & Actions'}
                      <Sparkles className="h-3 w-3" />
                    </button>
                  </div>

                  {/* AI Output Result Section */}
                  <AnimatePresence mode="wait">
                    {aiOutput ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 pt-3 border-t border-indigo-500/10"
                      >
                        {/* Summary block */}
                        <div>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">Abstract Summary</span>
                          <p className="text-xs text-zinc-300 leading-relaxed mt-1">{aiOutput.summary}</p>
                        </div>

                        {/* Bullets */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-[10px] font-mono text-zinc-500 uppercase">Key Indicators</span>
                            <ul className="space-y-1.5 mt-1.5">
                              {aiOutput.points?.map((p, i) => (
                                <li key={i} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                                  <span className="text-indigo-405 mt-1">•</span>
                                  <span>{p}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <span className="text-[10px] font-mono text-zinc-500 uppercase">Interactive Action Items</span>
                            <ul className="space-y-1.5 mt-1.5">
                              {aiOutput.actions?.map((act, i) => (
                                <li key={i} className="text-xs text-zinc-150 flex items-start gap-2 bg-[#09090c] border border-zinc-900 p-2 rounded-xl">
                                  <Check className="h-3 w-3 text-emerald-450 shrink-0 mt-0.5" />
                                  <span className="font-mono text-[11px] font-medium">{act}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    ) : aiAnalyzing ? (
                      <div className="flex flex-col items-center justify-center py-8 gap-2">
                        <div className="h-5 w-5 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full" />
                        <span className="text-[10px] text-zinc-500 font-mono animate-pulse">Running Neural LLM Parsers...</span>
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-400 font-light italic text-center py-4">
                        Press "Extract Summary & Actions" to synthesize digital metrics and create actionable reminders.
                      </p>
                    )}
                  </AnimatePresence>
                </div>

              </motion.div>
            ) : (
              <div className="bg-zinc-950/40 border border-zinc-900/50 rounded-2xl py-20 text-center">
                <FileText className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-zinc-300">No active document selected</h3>
                <p className="text-xs text-zinc-500 font-light mt-1">Select a document from the processed ledger to analyze its structure</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
