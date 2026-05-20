import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Clock, MessageCircle, Mail, MapPin, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { branches } from "@/data/menuData";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      toast({ title: "All fields required", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setFormData({ name: "", phone: "", message: "" });
      toast({ title: "Message sent!", description: "We will get back to you shortly. Thank you." });
    }, 1000);
  };

  const supervisors = [
    { name: "Syed Abdul Hadi", phone: "0348-5922580", role: "Complaint & Suggestion" },
    { name: "Syed Ihsan Ul Hadi", phone: "0341-9097057", role: "Complaint & Suggestion" }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-sidebar text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(212,175,55,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(128,0,32,0.6) 0%, transparent 50%)" }} />
        <div className="relative z-10">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent border border-accent/30 text-sm font-semibold tracking-wider uppercase mb-6"
          >
            Get in Touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl font-bold mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg max-w-xl mx-auto"
          >
            Questions, complaints, or suggestions? We're always here to help.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Info Column */}
          <div className="lg:col-span-1 space-y-6">

            {/* Operating Hours */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-card border rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold">Operating Hours</h3>
              </div>
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                <p className="text-muted-foreground text-sm mb-1 uppercase tracking-wider">Open Daily</p>
                <p className="font-bold text-2xl text-primary">10:00 AM</p>
                <p className="text-muted-foreground text-sm my-1">to</p>
                <p className="font-bold text-2xl text-primary">11:45 PM</p>
              </div>
              <p className="text-sm text-muted-foreground mt-3 italic">Dine-in, Takeaway &amp; Delivery available</p>
            </motion.div>

            {/* Supervisor Contacts */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-card border rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold">Direct Contacts</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">For complaints and suggestions, contact our supervisors directly:</p>
              <div className="space-y-4">
                {supervisors.map((s, i) => (
                  <div key={i} className="border rounded-xl p-4 bg-background/50">
                    <p className="font-semibold text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground mb-3">{s.role}</p>
                    <div className="flex gap-2">
                      <a href={`tel:${s.phone.replace(/-/g, "")}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full rounded-lg text-xs h-8">
                          <Phone className="mr-1 h-3 w-3" /> {s.phone}
                        </Button>
                      </a>
                      <a href={`https://wa.me/92${s.phone.replace(/^0/, "").replace(/-/g, "")}`} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white h-8 px-3">
                          <FaWhatsapp className="h-3 w-3" />
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Branch Quick Contact */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-card border rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold">Branch Numbers</h3>
              </div>
              <div className="space-y-3">
                {branches.map(branch => (
                  <div key={branch.id} className="border-b last:border-b-0 pb-3 last:pb-0">
                    <p className="text-sm font-semibold text-foreground mb-1">{branch.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {branch.phones.map((phone, i) => (
                        <a key={i} href={`tel:${phone.replace(/-/g, "")}`} className="text-xs text-primary hover:underline font-medium">
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Contact Form Column */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-card border rounded-2xl p-8 shadow-sm h-full flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold">Send Us a Message</h2>
                  <p className="text-muted-foreground text-sm">We'll respond as soon as possible</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Your Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={handleChange}
                      className="h-12 rounded-xl"
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone / WhatsApp</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="03XX-XXXXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                      className="h-12 rounded-xl"
                      data-testid="input-contact-phone"
                    />
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Write your complaint, suggestion, or inquiry here..."
                    value={formData.message}
                    onChange={handleChange}
                    className="rounded-xl min-h-[200px] resize-none"
                    data-testid="input-contact-message"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="h-14 rounded-xl text-base font-semibold shadow-md"
                  disabled={submitting}
                  data-testid="button-contact-submit"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-5 h-5" /> Send Message
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t">
                <p className="text-center text-muted-foreground text-sm mb-4">Or reach us directly on WhatsApp</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {branches.map(branch => (
                    <a
                      key={branch.id}
                      href={`https://wa.me/${branch.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button
                        className="w-full h-12 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl"
                        data-testid={`button-whatsapp-${branch.id}`}
                      >
                        <FaWhatsapp className="mr-2 h-5 w-5" />
                        {branch.name.split(" — ")[0]}
                      </Button>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
