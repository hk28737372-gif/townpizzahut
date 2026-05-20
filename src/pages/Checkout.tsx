import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Trash2, Plus, Minus, Phone, MapPin, ChevronRight, MessageCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";

const DELIVERY_CHARGE = 100;

const branchWhatsApp: Record<string, string> = {
  "Branch 1": "03189659090",
  "Branch 3": "03199629090",
  "Branch 5": "03409659090"
};

interface FormData {
  name: string;
  phone: string;
  branch: string;
  address: string;
  notes: string;
}

export default function Checkout() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    branch: "",
    address: "",
    notes: ""
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const orderTotal = cartTotal + DELIVERY_CHARGE;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBranchChange = (value: string) => {
    setForm(prev => ({ ...prev, branch: value }));
    if (errors.branch) setErrors(prev => ({ ...prev, branch: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.branch) newErrors.branch = "Please select a branch";
    if (!form.address.trim()) newErrors.address = "Delivery address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildWhatsAppMessage = (): string => {
    const itemLines = cartItems.map(ci => {
      const name = "name" in ci.item ? ci.item.name : (ci.item as any).title;
      return `• ${name} x${ci.quantity} — Rs. ${ci.item.price * ci.quantity}`;
    }).join("\n");

    return `*Town Pizza-Hut Order*\n\n` +
      `*Customer Name:* ${form.name}\n` +
      `*Phone Number:* ${form.phone}\n` +
      `*Selected Branch:* ${form.branch}\n` +
      `*Delivery Address:* ${form.address}\n\n` +
      `*Ordered Items:*\n${itemLines}\n\n` +
      `*Subtotal:* Rs. ${cartTotal}\n` +
      `*Delivery Charges:* Rs. ${DELIVERY_CHARGE}\n` +
      `*Total Bill:* Rs. ${orderTotal}\n` +
      (form.notes ? `\n*Additional Notes:* ${form.notes}` : "");
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      toast({ title: "Cart is empty", description: "Add items to your cart before ordering.", variant: "destructive" });
      return;
    }
    if (!validate()) return;

    const number = branchWhatsApp[form.branch];
    if (!number) {
      toast({ title: "Invalid branch", description: "Please select a valid branch.", variant: "destructive" });
      return;
    }

    const message = buildWhatsAppMessage();
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    clearCart();
    toast({ title: "Order sent via WhatsApp!", description: "Your order has been forwarded. We will confirm shortly." });
    setTimeout(() => setLocation("/"), 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="font-serif text-3xl font-bold mb-3">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8 text-lg">Add some delicious items to get started.</p>
          <Link href="/menu">
            <Button size="lg" className="rounded-full h-14 px-8 text-base">
              Browse Menu <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-sidebar text-white py-16 px-4 text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">Checkout</h1>
        <p className="text-white/80 text-lg">Review your order and place it via WhatsApp</p>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Cart Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b bg-muted/30 flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Order Summary
                </h2>
                <span className="text-sm text-muted-foreground">{cartItems.length} item(s)</span>
              </div>

              <div className="divide-y">
                {cartItems.map((ci) => {
                  const name = "name" in ci.item ? ci.item.name : (ci.item as any).title;
                  return (
                    <div
                      key={`${ci.isDeal ? "deal" : "item"}-${ci.item.id}`}
                      className="flex gap-4 p-5 items-center"
                      data-testid={`cart-item-${ci.item.id}`}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                        <img src={ci.item.image} alt={name} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-2">{name}</h4>
                        <p className="text-primary font-bold mt-1">Rs. {ci.item.price} each</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center bg-muted rounded-lg overflow-hidden">
                          <button
                            className="px-2 py-1.5 hover:bg-black/10 transition-colors"
                            onClick={() => updateQuantity(ci.item.id, ci.quantity - 1, ci.isDeal)}
                            data-testid={`button-decrease-${ci.item.id}`}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{ci.quantity}</span>
                          <button
                            className="px-2 py-1.5 hover:bg-black/10 transition-colors"
                            onClick={() => updateQuantity(ci.item.id, ci.quantity + 1, ci.isDeal)}
                            data-testid={`button-increase-${ci.item.id}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-bold text-base w-20 text-right">Rs. {ci.item.price * ci.quantity}</span>
                        <button
                          onClick={() => removeFromCart(ci.item.id, ci.isDeal)}
                          className="text-destructive hover:text-destructive/80 transition-colors ml-2"
                          data-testid={`button-remove-${ci.item.id}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="px-6 py-5 border-t bg-muted/20 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">Rs. {cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Delivery Charges</span>
                  <span className="font-medium text-foreground">Rs. {DELIVERY_CHARGE}</span>
                </div>
                <div className="flex justify-between pt-3 border-t mt-2">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-primary">Rs. {orderTotal}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-card border rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Delivery Details
              </h2>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm font-medium">Customer Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    className={`h-11 rounded-xl ${errors.name ? "border-destructive" : ""}`}
                    data-testid="input-checkout-name"
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm font-medium">Mobile / WhatsApp Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="03XX-XXXXXXX"
                      value={form.phone}
                      onChange={handleChange}
                      className={`h-11 rounded-xl pl-10 ${errors.phone ? "border-destructive" : ""}`}
                      data-testid="input-checkout-phone"
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Select Branch *</Label>
                  <Select value={form.branch} onValueChange={handleBranchChange}>
                    <SelectTrigger className={`h-11 rounded-xl ${errors.branch ? "border-destructive" : ""}`} data-testid="select-checkout-branch">
                      <SelectValue placeholder="Choose your nearest branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Branch 1">Branch 1 — Township, Kabal Road</SelectItem>
                      <SelectItem value="Branch 3">Branch 3 — Sersanai Chowk</SelectItem>
                      <SelectItem value="Branch 5">Branch 5 — Khwaza Khela (New)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.branch && <p className="text-xs text-destructive">{errors.branch}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-sm font-medium">Delivery Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="House/street/area details"
                      value={form.address}
                      onChange={handleChange}
                      className={`rounded-xl pl-10 min-h-[80px] resize-none ${errors.address ? "border-destructive" : ""}`}
                      data-testid="input-checkout-address"
                    />
                  </div>
                  {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="notes" className="text-sm font-medium">Additional Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Special requests, extra sauce, etc."
                    value={form.notes}
                    onChange={handleChange}
                    className="rounded-xl min-h-[70px] resize-none"
                    data-testid="input-checkout-notes"
                  />
                </div>

                <Button
                  size="lg"
                  className="w-full h-14 rounded-xl text-base font-semibold shadow-lg bg-[#25D366] hover:bg-[#20bd5a] text-white mt-4"
                  onClick={handlePlaceOrder}
                  data-testid="button-place-order"
                >
                  <FaWhatsapp className="mr-2 h-5 w-5" />
                  Place Order via WhatsApp
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Your order details will open in WhatsApp. Confirm to send.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
