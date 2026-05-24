import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useMenu } from "@/context/MenuContext";
import { FoodCard } from "@/components/FoodCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Menu() {
  const { items: menuItems, categories } = useMenu();
  const [searchParams] = useLocation();
  const initialCategory = new URLSearchParams(window.location.search).get("category") || "All";
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-sidebar text-white py-16 px-4 text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
        <p className="text-sidebar-foreground/80 max-w-2xl mx-auto text-lg">Explore our wide selection of premium fast food prepared with fresh ingredients and love.</p>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-card p-4 rounded-2xl shadow-md border mb-8 max-w-xl mx-auto flex items-center gap-4">
          <Search className="text-muted-foreground w-5 h-5 ml-2 shrink-0" />
          <Input 
            type="text" 
            placeholder="Search for your favorite food..." 
            className="border-none shadow-none focus-visible:ring-0 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory} className="mb-10 w-full">
          <div className="overflow-x-auto pb-4 hide-scrollbar">
            <TabsList className="w-full h-14 bg-muted/50 p-1 flex justify-start sm:justify-center min-w-max">
              <TabsTrigger value="All" className="h-12 px-6 rounded-xl text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                All Items
              </TabsTrigger>
              {categories.map(cat => (
                <TabsTrigger key={cat.id} value={cat.name} className="h-12 px-6 rounded-xl text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No items found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredItems.map(item => (
              <FoodCard key={item.id} item={item} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}