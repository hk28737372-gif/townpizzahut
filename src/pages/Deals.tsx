import React from "react";
import { useMenu } from "@/context/MenuContext";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Deals() {
  const { deals } = useMenu();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddDeal = (deal: any) => {
    addToCart(deal, 1, true);
    toast({
      title: "Deal added to cart! 🛒",
      description: `${deal.title} added to your cart.`,
    });
  };

  const handleBuyNow = (deal: any) => {
    addToCart(deal, 1, true);
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
              transition={{ delay: idx * 0.07 }}
              className="bg-card rounded-2xl overflow-hidden shadow-md border flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image — NO price on image */}
              <div className="h-52 relative overflow-hidden bg-muted">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-black/50 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                  {deal.title}
                </span>
              </div>

              {/* Info — price shown BELOW image, Amazon/Daraz style */}
              <div className="p-5 flex flex-col flex-1">

                {/* Price — prominent, below image */}
                <div className="flex items-baseline gap-2 mb-4 pb-4 border-b">
                  <span className="text-3xl font-bold text-primary">Rs. {deal.price}</span>
                  <span className="text-xs text-muted-foreground line-through text-gray-400">
                    Rs. {Math.round(deal.price * 1.25)}
                  </span>
                  <span className="ml-auto text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                    20% OFF
                  </span>
                </div>

                {/* Includes */}
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Includes</h4>
                <ul className="space-y-2 mb-6 flex-1">
                  {deal.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-primary font-bold text-[10px]">✓</span>
                      </div>
                      <span className="text-foreground/80 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <Button
                    variant="outline"
                    className="h-11 rounded-xl border-primary/30 hover:bg-primary/5 hover:border-primary text-primary text-sm font-semibold"
                    onClick={() => handleAddDeal(deal)}
                  >
                    <ShoppingCart className="mr-1.5 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Link href="/checkout">
                    <Button
                      className="h-11 rounded-xl w-full text-sm font-semibold shadow-md"
                      onClick={() => handleBuyNow(deal)}
                    >
                      <Zap className="mr-1.5 h-4 w-4" />
                      Buy Now
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
