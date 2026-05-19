import React from "react";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80&auto=format&fit=crop" alt="Town Pizza Hut Interior" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6">Our Story</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-light">
            Bringing premium taste and quality to the heart of Swat since day one.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="font-serif text-4xl font-bold text-foreground">The Name of Quality</h2>
            <div className="w-20 h-1 bg-primary rounded-full"></div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Town Pizza-Hut started with a simple mission: to provide the families of Swat with a premium, hygienic, and incredibly delicious fast-food experience.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From our signature Zinger Burgers to our freshly baked Pizzas and crispy Broast, every item on our menu is crafted with care using only the freshest ingredients sourced daily.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Today, with multiple branches across Swat, we remain committed to our founding principle — quality without compromise.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-accent translate-x-4 translate-y-4 rounded-3xl"></div>
            <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop" alt="Our Chef" className="relative z-10 w-full h-auto rounded-3xl shadow-xl object-cover" />
          </motion.div>
        </div>

        <div className="bg-muted/50 rounded-3xl p-8 md:p-16 border">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Premium Ingredients", desc: "We never compromise on quality. Fresh meat, farm-fresh vegetables, and top-tier spices." },
              { title: "Family Environment", desc: "A clean, cozy, and welcoming atmosphere designed for families to enjoy their meals." },
              { title: "Consistent Taste", desc: "Our standardized recipes ensure your favorite burger tastes exactly the same, every single time." }
            ].map((item, i) => (
              <div key={i} className="bg-card p-8 rounded-2xl shadow-sm border text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}