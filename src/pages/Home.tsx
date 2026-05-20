import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Star, Clock, Heart, Truck, Utensils } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { categories, menuItems, deals } from "@/data/menuData";
import { FoodCard } from "@/components/FoodCard";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600&q=80&auto=format&fit=crop" 
            alt="Town Pizza Hut Premium Food" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6 inline-block"
          >
            <span className="px-4 py-1.5 rounded-full bg-primary/90 text-white text-sm font-semibold tracking-wider uppercase backdrop-blur-sm shadow-xl">
              Family Restaurant in Swat
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 drop-shadow-lg"
          >
            Town Pizza-Hut
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-3xl text-accent font-serif italic mb-10 drop-shadow-md"
          >
            "The Name of Quality"
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/menu">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full shadow-[0_0_20px_rgba(128,0,32,0.4)]">
                Order Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/deals">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-white/10 text-white border-white/30 hover:bg-white hover:text-black backdrop-blur-sm">
                View Deals
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-card border-y py-12 relative z-20 -mt-8 mx-4 md:mx-auto md:max-w-6xl rounded-2xl shadow-xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Truck, title: "Fast Delivery", desc: "Hot & fresh to your door" },
              { icon: Utensils, title: "Fresh Ingredients", desc: "Quality you can taste" },
              { icon: Heart, title: "Family Restaurant", desc: "Cozy atmosphere" },
              { icon: Star, title: "Premium Taste", desc: "Swat's favorite choice" }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-card-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">Explore Our Menu</h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {categories.map((category, idx) => {
              const imageMap: Record<string, string> = {
                "Burgers": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=75&auto=format&fit=crop",
                "Fried Chicken": "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&q=75&auto=format&fit=crop",
                "Shawarma & Rolls": "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500&q=75&auto=format&fit=crop",
                "Pizza": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=75&auto=format&fit=crop"
              };
              
              return (
                <Link key={category} href={`/menu?category=${category}`}>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative h-48 md:h-64 rounded-2xl overflow-hidden cursor-pointer shadow-md"
                  >
                    <img src={imageMap[category]} alt={category} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <h3 className="text-white font-serif font-bold text-xl md:text-2xl">{category}</h3>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Deals */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-4">Special Combos</h2>
              <div className="w-24 h-1 bg-accent rounded-full"></div>
            </div>
            <Link href="/deals">
              <Button variant="outline" className="rounded-full">View All Deals</Button>
            </Link>
          </div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {deals.slice(0, 4).map((deal) => (
              <motion.div key={deal.id} variants={fadeInUp} className="bg-card rounded-2xl overflow-hidden shadow-sm border group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
                {/* Image — NO price on image */}
                <div className="h-48 relative overflow-hidden">
                  <img src={deal.image} alt={deal.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <span className="absolute top-3 left-3 bg-black/50 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                    {deal.title}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  {/* Price below image, Amazon/Daraz style */}
                  <div className="flex items-baseline gap-2 mb-3 pb-3 border-b">
                    <span className="text-2xl font-bold text-primary">Rs. {deal.price}</span>
                    <span className="text-xs text-green-600 font-semibold bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">20% OFF</span>
                  </div>
                  <ul className="space-y-1 mb-5 text-sm text-muted-foreground flex-1">
                    {deal.items.slice(0, 3).map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                    {deal.items.length > 3 && <li className="text-xs text-muted-foreground italic">+{deal.items.length - 3} more items</li>}
                  </ul>
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <Link href="/deals">
                      <Button variant="outline" size="sm" className="w-full h-10 rounded-xl border-primary/30 text-primary hover:bg-primary/5 text-xs font-semibold">
                        Add to Cart
                      </Button>
                    </Link>
                    <Link href="/deals">
                      <Button size="sm" className="w-full h-10 rounded-xl text-xs font-semibold">
                        Buy Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Banner */}
      <section className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(212,175,55,0.4) 0%, transparent 60%), radial-gradient(circle at 70% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)" }}></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Clock className="w-12 h-12 mx-auto mb-6 text-accent" />
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">We are open daily!</h2>
          <p className="text-xl md:text-2xl mb-8 font-light">10:00 AM - 11:45 PM</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/branches">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full h-14 px-8 text-lg">
                Find Nearest Branch
              </Button>
            </Link>
            <a href="https://wa.me/923189659090" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full h-14 px-8 text-lg border-none">
                <FaWhatsapp className="mr-2 h-5 w-5" /> Order on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}