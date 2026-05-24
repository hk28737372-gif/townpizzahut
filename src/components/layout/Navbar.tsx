import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SettingsProvider, useSettings } from "@/context/SettingsContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/deals", label: "Deals" },
  { href: "/gallery", label: "Gallery" },
  { href: "/branches", label: "Branches" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [location] = useLocation();
  const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart } = useCart();
  const { logo } = useSettings();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <img src={logo} alt="Town Pizza Hut Logo" className="h-14 w-auto" />
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <div className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer hover:bg-primary/10 hover:text-primary ${location === link.href ? "text-primary bg-primary/10" : "text-foreground"}`}>
                {link.label}
              </div>
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative h-10 w-10 rounded-full">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
              <SheetHeader>
                <SheetTitle className="font-serif text-2xl">Your Order</SheetTitle>
              </SheetHeader>
              
              <ScrollArea className="flex-1 -mx-6 px-6 py-4">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
                    <p>Your cart is empty.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((cartItem) => (
                      <div key={`${cartItem.isDeal ? 'deal' : 'item'}-${cartItem.item.id}`} className="flex gap-4 border-b pb-4">
                        <div className="h-16 w-16 bg-muted rounded-md overflow-hidden shrink-0">
                          <img src={cartItem.item.image} alt={'name' in cartItem.item ? cartItem.item.name : cartItem.item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-sm line-clamp-2 pr-2">{'name' in cartItem.item ? cartItem.item.name : cartItem.item.title}</h4>
                            <span className="font-bold text-sm shrink-0">Rs. {cartItem.item.price * cartItem.quantity}</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center bg-muted rounded-md overflow-hidden">
                              <button className="px-2 py-1 hover:bg-black/10 transition-colors" onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1, cartItem.isDeal)}>
                                <Minus size={12} />
                              </button>
                              <span className="w-6 text-center text-xs font-medium">{cartItem.quantity}</span>
                              <button className="px-2 py-1 hover:bg-black/10 transition-colors" onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1, cartItem.isDeal)}>
                                <Plus size={12} />
                              </button>
                            </div>
                            <button onClick={() => removeFromCart(cartItem.item.id, cartItem.isDeal)} className="text-destructive hover:text-destructive/80 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {cartItems.length > 0 && (
                <div className="pt-6 border-t mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-bold text-xl text-primary">Rs. {cartTotal}</span>
                  </div>
                  <Link href="/checkout">
                    <Button className="w-full rounded-full h-12 text-lg font-medium shadow-md">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              )}
            </SheetContent>
          </Sheet>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] flex flex-col">
                <div className="py-4">
                  <img src={logo} alt="Town Pizza Hut Logo" className="h-12 w-auto mb-8" />
                  <div className="flex flex-col space-y-2">
                    {links.map((link) => (
                      <Link key={link.href} href={link.href}>
                        <div 
                          className={`px-4 py-3 rounded-md text-lg font-medium transition-colors cursor-pointer ${location === link.href ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                          onClick={() => setIsOpen(false)}
                        >
                          {link.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}