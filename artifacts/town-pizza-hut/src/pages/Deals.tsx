import React from "react";
import { deals } from "@/data/menuData";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export default function Deals() {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddDeal = (deal: any) => {
    addToCart(deal, 1, true);
    toast({
      title: "Deal added to cart",
      description: `${deal.title} added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary text-primary-foreground py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-bold tracking-wider uppercase mb-6 shadow-sm">
            Save Big With Combos
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">Special Deals</h1>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto text-lg">Perfect for sharing with family and friends.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deals.map((deal, idx) => (
            <motion.div 
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card rounded-2xl overflow-hidden shadow-md border flex flex-col hover:shadow-xl transition-shadow"
            >
              <div className="h-56 relative overflow-hidden bg-muted">
                <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur text-foreground font-bold px-4 py-2 rounded-xl shadow-lg border">
                  {deal.title}
                </div>
                <div className="absolute bottom-0 right-0 bg-accent text-accent-foreground font-bold text-xl px-6 py-3 rounded-tl-2xl shadow-[-4px_-4px_10px_rgba(0,0,0,0.1)]">
                  Rs. {deal.price}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-lg mb-4 text-muted-foreground uppercase tracking-wider text-sm border-b pb-2">Includes</h3>
                <ul className="space-y-3 mb-8 flex-1">
                  {deal.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-primary font-bold text-xs">{item.match(/^\d+/)?.[0] || '1'}</span>
                      </div>
                      <span className="font-medium text-foreground/80 leading-snug">{item.replace(/^\d+\s/, '')}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full rounded-xl h-12 text-md mt-auto shadow-md"
                  onClick={() => handleAddDeal(deal)}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add Deal to Cart
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}