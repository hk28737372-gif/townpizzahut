import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const galleryCategories = ["All", "Burgers", "Fried Chicken", "Shawarma", "Pizza", "Restaurant"];

const images = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=75&auto=format&fit=crop",
    category: "Restaurant",
    alt: "Premium restaurant warm interior"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=75&auto=format&fit=crop",
    category: "Burgers",
    alt: "Zinger Burger"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800&q=75&auto=format&fit=crop",
    category: "Fried Chicken",
    alt: "Broast Platter"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=75&auto=format&fit=crop",
    category: "Pizza",
    alt: "Town Special Pizza"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&q=75&auto=format&fit=crop",
    category: "Shawarma",
    alt: "Chicken Shawarma"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=75&auto=format&fit=crop",
    category: "Restaurant",
    alt: "Chef preparing food"
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&q=75&auto=format&fit=crop",
    category: "Burgers",
    alt: "Tower Burger"
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&q=75&auto=format&fit=crop",
    category: "Pizza",
    alt: "Family size pizza with cheese pull"
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&q=75&auto=format&fit=crop",
    category: "Fried Chicken",
    alt: "Hot Wings"
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=75&auto=format&fit=crop",
    category: "Fried Chicken",
    alt: "Party feast platter"
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=75&auto=format&fit=crop",
    category: "Restaurant",
    alt: "Restaurant interior atmosphere"
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&q=75&auto=format&fit=crop",
    category: "Burgers",
    alt: "American Burger"
  },
  {
    id: 13,
    src: "https://images.unsplash.com/photo-1511358522-a658b1283523?w=800&q=75&auto=format&fit=crop",
    category: "Shawarma",
    alt: "Cheese Shawarma wrap"
  },
  {
    id: 14,
    src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=75&auto=format&fit=crop",
    category: "Pizza",
    alt: "Pepperoni pizza slice"
  },
  {
    id: 15,
    src: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&q=75&auto=format&fit=crop",
    category: "Burgers",
    alt: "Double Decker Burger"
  },
  {
    id: 16,
    src: "https://images.unsplash.com/photo-1619881589316-3a89c2c07e0e?w=800&q=75&auto=format&fit=crop",
    category: "Fried Chicken",
    alt: "Chicken Nuggets"
  }
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredImages = activeCategory === "All"
    ? images
    : images.filter(img => img.category === activeCategory);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="py-16 px-4 text-center relative overflow-hidden bg-muted/30 border-b">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, rgba(128,0,32,0.6) 0%, transparent 60%)" }} />
        <div className="relative z-10">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-semibold tracking-wider uppercase mb-6"
          >
            Visual Feast
          </motion.span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Photo Gallery</h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Take a look at our delicious food and cozy family environment. Every dish is prepared with care and pride.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="All" onValueChange={setActiveCategory} className="mb-10">
          <div className="flex justify-center overflow-x-auto pb-4">
            <TabsList className="h-12 bg-muted p-1 flex-nowrap">
              {galleryCategories.map(cat => (
                <TabsTrigger key={cat} value={cat} className="h-10 px-5 rounded-lg text-sm font-medium whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5"
        >
          {filteredImages.map((img, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: (idx % 6) * 0.06 }}
              key={img.id}
              className="break-inside-avoid relative rounded-2xl overflow-hidden group cursor-pointer border shadow-sm hover:shadow-xl transition-shadow"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                <span className="text-white font-medium text-sm px-4 py-2 border border-white/30 rounded-full backdrop-blur-sm bg-black/20">
                  {img.alt}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
