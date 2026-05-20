import React, { useState } from "react";
import { MenuItem } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { Link } from "wouter";

export function FoodCard({ item }: { item: MenuItem }) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    addToCart(item, quantity);
    toast({
      title: "Added to cart! 🛒",
      description: `${quantity}x ${item.name} added successfully.`,
    });
    setQuantity(1);
  };

  const handleBuyNow = () => {
    addToCart(item, quantity);
    setQuantity(1);
  };

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        {item.category && (
          <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
            {item.category}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-serif text-lg font-bold text-foreground leading-tight mb-1">{item.name}</h3>
        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{item.description}</p>
        )}

        {/* Price — shown like Daraz/Amazon, below image, not on it */}
        <div className="flex items-baseline gap-1 mb-4 mt-auto">
          <span className="text-2xl font-bold text-primary">Rs. {item.price}</span>
          <span className="text-xs text-muted-foreground">/item</span>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground">Quantity:</span>
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button
              className="px-3 py-1.5 hover:bg-muted transition-colors text-sm font-medium disabled:opacity-40"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus size={13} />
            </button>
            <span className="w-10 text-center text-sm font-bold border-x">{quantity}</span>
            <button
              className="px-3 py-1.5 hover:bg-muted transition-colors text-sm font-medium"
              onClick={() => setQuantity(q => q + 1)}
              aria-label="Increase quantity"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="h-10 rounded-xl border-primary/30 hover:bg-primary/5 hover:border-primary text-primary text-xs font-semibold"
          >
            <ShoppingCart size={14} className="mr-1.5" />
            Add to Cart
          </Button>
          <Link href="/checkout">
            <Button
              size="sm"
              onClick={handleBuyNow}
              className="h-10 rounded-xl w-full text-xs font-semibold shadow-sm"
            >
              <Zap size={14} className="mr-1.5" />
              Buy Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
