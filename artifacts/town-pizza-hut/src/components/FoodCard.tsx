import React, { useState } from "react";
import { MenuItem } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, ShoppingCart } from "lucide-react";

export function FoodCard({ item }: { item: MenuItem }) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    addToCart(item, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity}x ${item.name} added to your cart.`,
    });
    setQuantity(1);
  };

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-sm border transition-all hover:shadow-md">
      <div className="h-48 overflow-hidden bg-muted">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-5 flex flex-col h-full">
        <h3 className="font-serif text-xl font-bold mb-1">{item.name}</h3>
        {item.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">Rs. {item.price}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-muted rounded-md overflow-hidden">
              <button 
                className="px-2 py-1 hover:bg-black/5 active:bg-black/10 transition-colors"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm font-medium">{quantity}</span>
              <button 
                className="px-2 py-1 hover:bg-black/5 active:bg-black/10 transition-colors"
                onClick={() => setQuantity(q => q + 1)}
              >
                <Plus size={14} />
              </button>
            </div>
            <Button size="sm" onClick={handleAdd} className="rounded-md shrink-0">
              <ShoppingCart size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}