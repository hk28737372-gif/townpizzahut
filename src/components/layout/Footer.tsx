import React from "react";
import { Link } from "wouter";
import { MapPin, Phone, Clock } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { branches } from "@/data/menuData";
import { useSettings } from "@/context/SettingsContext";

export function Footer() {
  const { logo } = useSettings();
  return (
    <footer className="bg-sidebar text-sidebar-foreground pt-16 pb-8 border-t border-sidebar-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          <div className="space-y-6">
            <img src={logo} alt="Town Pizza Hut" className="h-16 bg-white/10 p-2 rounded-lg" />
            <p className="text-sidebar-foreground/80 leading-relaxed font-serif italic text-lg">
              "The Name of Quality"
            </p>
            <p className="text-sidebar-foreground/70 text-sm">
              Swat's favorite family restaurant serving premium burgers, broast, and authentic pizzas since establishment.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold mb-6 text-accent">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Our Menu", href: "/menu" },
                { label: "Special Deals", href: "/deals" },
                { label: "Photo Gallery", href: "/gallery" },
                { label: "Contact Us", href: "/contact" },
                { label: "Admin Panel", href: "/admin" }
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sidebar-foreground/80 hover:text-accent transition-colors cursor-pointer inline-flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-accent"></span>
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold mb-6 text-accent">Operating Hours</h4>
            <div className="flex items-start gap-3 text-sidebar-foreground/80">
              <Clock className="w-5 h-5 mt-1 text-accent shrink-0" />
              <div>
                <p className="font-medium text-white mb-1">Open Daily</p>
                <p>10:00 AM - 11:45 PM</p>
                <p className="text-sm mt-2 text-sidebar-foreground/60 italic">Dine-in, Takeaway & Free Delivery</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold mb-6 text-accent">Our Branches</h4>
            <div className="space-y-4">
              {branches.slice(0, 2).map(branch => (
                <div key={branch.id} className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-1 text-accent shrink-0" />
                  <div>
                    <p className="font-medium text-white text-sm">{branch.name}</p>
                    <p className="text-sidebar-foreground/80 text-xs mt-1 leading-snug">{branch.address}</p>
                  </div>
                </div>
              ))}
              <Link href="/branches">
                <span className="text-accent text-sm hover:underline cursor-pointer block mt-2 font-medium">View all branches &rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-sidebar-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sidebar-foreground/60 text-sm">
            &copy; {new Date().getFullYear()} Town Pizza-Hut. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/923189659090" target="_blank" rel="noopener noreferrer" className="bg-sidebar-accent hover:bg-accent text-white p-2 rounded-full transition-colors">
              <FaWhatsapp size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}