import React from "react";
import { MapPin, Phone, Map, Navigation } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { branches } from "@/data/menuData";
import { motion } from "framer-motion";

export default function Branches() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-sidebar text-white py-16 px-4 text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Our Locations</h1>
        <p className="text-sidebar-foreground/80 max-w-2xl mx-auto text-lg">
          Visit any of our branches across Swat for a premium dining experience.
        </p>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {branches.map((branch, idx) => (
            <motion.div 
              key={branch.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="bg-card rounded-2xl border shadow-lg overflow-hidden flex flex-col"
            >
              <div className="h-64 w-full bg-muted relative">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(branch.mapQuery)}&output=embed`}
                  allowFullScreen
                ></iframe>
                <div className="absolute top-4 left-4 bg-background/95 backdrop-blur text-foreground px-4 py-2 rounded-lg font-bold shadow-md flex items-center gap-2 border">
                  <MapPin className="text-primary w-4 h-4" /> 
                  {branch.name}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex gap-4 mb-6 pb-6 border-b">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wider mb-1">Address</h3>
                    <p className="font-medium text-foreground leading-relaxed">{branch.address}</p>
                  </div>
                </div>

                <div className="flex gap-4 mb-8">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wider mb-2">Contact Numbers</h3>
                    <div className="flex flex-col gap-1">
                      {branch.phones.map((phone, i) => (
                        <a key={i} href={`tel:${phone.replace(/-/g, '')}`} className="font-medium text-foreground hover:text-primary transition-colors inline-block">
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-1 gap-3">
                  <a href={`tel:${branch.phones[0].replace(/-/g, '')}`} className="w-full">
                    <Button variant="outline" className="w-full h-12 rounded-xl text-md border-primary/20 hover:bg-primary hover:text-primary-foreground">
                      <Phone className="mr-2 h-4 w-4" /> Call Now
                    </Button>
                  </a>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <a href={`https://wa.me/${branch.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white">
                        <FaWhatsapp className="mr-2 h-5 w-5" /> WhatsApp
                      </Button>
                    </a>
                    
                    <a href={`https://maps.google.com/maps?daddr=${encodeURIComponent(branch.address)}`} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button variant="secondary" className="w-full h-12 rounded-xl">
                        <Navigation className="mr-2 h-4 w-4" /> Directions
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}