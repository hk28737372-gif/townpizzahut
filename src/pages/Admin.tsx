import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, LayoutDashboard, Package, Tag, Store, Trash2, Pencil, Plus, X, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { menuItems as initialItems, deals as initialDeals, branches, categories } from "@/data/menuData";
import type { MenuItem, Deal } from "@/data/menuData";

const ADMIN_PASSWORD = "townpizza2024";

const sampleOrders = [
  { id: "#001", customer: "Ahmed Khan", branch: "Branch 1", total: 1200, status: "Delivered", time: "11:30 AM" },
  { id: "#002", customer: "Fatima Bibi", branch: "Branch 3", total: 2760, status: "Preparing", time: "11:45 AM" },
  { id: "#003", customer: "Usman Ali", branch: "Branch 5", total: 5500, status: "Pending", time: "12:00 PM" },
  { id: "#004", customer: "Zainab Shah", branch: "Branch 1", total: 1600, status: "Dispatched", time: "12:10 PM" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Preparing: "bg-blue-100 text-blue-800 border-blue-200",
  Dispatched: "bg-purple-100 text-purple-800 border-purple-200",
  Delivered: "bg-green-100 text-green-800 border-green-200",
};

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", category: "Burgers", price: "", image: "" });

  const [editItemOpen, setEditItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ id: number, name: string, category: string, price: string, image: string } | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<any>>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter((prev: any) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Incorrect password. Please try again.");
    }
  };

  const handleDeleteItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) return;
    const item: MenuItem = {
      id: Date.now(),
      name: newItem.name,
      category: newItem.category,
      price: Number(newItem.price),
      image: newItem.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=75",
      description: ""
    };
    setItems(prev => [...prev, item]);
    setNewItem({ name: "", category: "Burgers", price: "", image: "" });
    setAddItemOpen(false);
  };

  const handleSaveEdit = () => {
    if (!editingItem || !editingItem.name || !editingItem.price) return;
    setItems(prev => prev.map(item => item.id === editingItem.id ? { ...item, name: editingItem.name, category: editingItem.category, price: Number(editingItem.price), image: editingItem.image || item.image } : item));
    setEditItemOpen(false);
    setEditingItem(null);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem({ id: item.id, name: item.name, category: item.category, price: item.price.toString(), image: item.image });
    setEditItemOpen(true);
  };

  const handleDeleteDeal = (id: number) => {
    setDeals(prev => prev.filter(d => d.id !== id));
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-card border rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-sidebar px-8 py-10 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-accent" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-white mb-2">Admin Panel</h1>
              <p className="text-white/70 text-sm">Town Pizza-Hut Management Dashboard</p>
            </div>
            <form onSubmit={handleLogin} className="px-8 py-8 space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Admin Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setLoginError(""); }}
                    className={`h-12 rounded-xl pr-12 ${loginError ? "border-destructive" : ""}`}
                    data-testid="input-admin-password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(s => !s)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {loginError && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-destructive">
                    {loginError}
                  </motion.p>
                )}
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold" data-testid="button-admin-login">
                Login to Dashboard
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "deals", label: "Deals", icon: Tag },
    { id: "orders", label: "Orders", icon: Store },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-sidebar text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="font-serif text-xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white/60 text-sm">Town Pizza-Hut Management</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setAuthenticated(false); setPassword(""); }}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="mr-1 w-4 h-4" /> Logout
            </Button>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-t-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-background text-foreground"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Products", value: items.length, color: "text-primary", bg: "bg-primary/10" },
                { label: "Total Deals", value: deals.length, color: "text-accent-foreground", bg: "bg-secondary/20" },
                { label: "Branches", value: branches.length, color: "text-blue-700", bg: "bg-blue-100" },
                { label: "Today Orders", value: sampleOrders.length, color: "text-green-700", bg: "bg-green-100" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border rounded-2xl p-5 shadow-sm"
                >
                  <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <span className={`font-bold text-lg ${stat.color}`}>{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="font-bold text-lg">Recent Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-6 py-3 font-medium text-muted-foreground">Order ID</th>
                      <th className="text-left px-6 py-3 font-medium text-muted-foreground">Customer</th>
                      <th className="text-left px-6 py-3 font-medium text-muted-foreground">Branch</th>
                      <th className="text-left px-6 py-3 font-medium text-muted-foreground">Total</th>
                      <th className="text-left px-6 py-3 font-medium text-muted-foreground">Time</th>
                      <th className="text-left px-6 py-3 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {sampleOrders.map(order => (
                      <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-primary">{order.id}</td>
                        <td className="px-6 py-4">{order.customer}</td>
                        <td className="px-6 py-4 text-muted-foreground">{order.branch}</td>
                        <td className="px-6 py-4 font-semibold">Rs. {order.total}</td>
                        <td className="px-6 py-4 text-muted-foreground">{order.time}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* PRODUCTS */}
        {activeTab === "products" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold">Menu Products</h2>
              <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-xl h-10">
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="font-serif text-xl">Add New Product</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Product Name</Label>
                      <Input placeholder="e.g. Spicy Chicken Burger" value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Category</Label>
                      <Select value={newItem.category} onValueChange={v => setNewItem(p => ({ ...p, category: v }))}>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Price (Rs.)</Label>
                      <Input type="number" placeholder="350" value={newItem.price} onChange={e => setNewItem(p => ({ ...p, price: e.target.value }))} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Image URL</Label>
                      <Input placeholder="https://..." value={newItem.image} onChange={e => setNewItem(p => ({ ...p, image: e.target.value }))} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Or Upload Image (Gallery)</Label>
                      <Input type="file" accept="image/*" onChange={e => handleImageUpload(e, setNewItem)} className="h-11 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    </div>
                    <Button className="w-full h-11 rounded-xl" onClick={handleAddItem}>Add Product</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Dialog open={editItemOpen} onOpenChange={setEditItemOpen}>
              <DialogContent className="rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="font-serif text-xl">Edit Product</DialogTitle>
                </DialogHeader>
                {editingItem && (
                  <div className="space-y-4 mt-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Product Name</Label>
                      <Input placeholder="e.g. Spicy Chicken Burger" value={editingItem.name} onChange={e => setEditingItem(p => p ? { ...p, name: e.target.value } : null)} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Category</Label>
                      <Select value={editingItem.category} onValueChange={v => setEditingItem(p => p ? { ...p, category: v } : null)}>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Price (Rs.)</Label>
                      <Input type="number" placeholder="350" value={editingItem.price} onChange={e => setEditingItem(p => p ? { ...p, price: e.target.value } : null)} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Image URL</Label>
                      <Input placeholder="https://..." value={editingItem.image} onChange={e => setEditingItem(p => p ? { ...p, image: e.target.value } : null)} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Or Upload Image (Gallery)</Label>
                      <Input type="file" accept="image/*" onChange={e => handleImageUpload(e, setEditingItem)} className="h-11 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    </div>
                    <Button className="w-full h-11 rounded-xl" onClick={handleSaveEdit}>Save Changes</Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-5 py-3 font-medium text-muted-foreground">Product</th>
                      <th className="text-left px-5 py-3 font-medium text-muted-foreground">Category</th>
                      <th className="text-left px-5 py-3 font-medium text-muted-foreground">Price</th>
                      <th className="text-right px-5 py-3 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {items.map(item => (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant="secondary" className="rounded-full">{item.category}</Badge>
                        </td>
                        <td className="px-5 py-3 font-semibold text-primary">Rs. {item.price}</td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground" onClick={() => openEditModal(item)}>
                              <Pencil size={14} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive" onClick={() => handleDeleteItem(item.id)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* DEALS */}
        {activeTab === "deals" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold">Deals Management</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {deals.map(deal => (
                <div key={deal.id} className="bg-card border rounded-2xl overflow-hidden shadow-sm">
                  <div className="h-36 relative overflow-hidden bg-muted">
                    <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute top-3 left-3 bg-accent text-accent-foreground font-bold px-3 py-1 rounded-lg text-sm shadow">
                      Rs. {deal.price}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold">{deal.title}</h3>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive/80" onClick={() => handleDeleteDeal(deal.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      {deal.items.map((item, i) => <li key={i}>• {item}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-serif text-2xl font-bold mb-6">Orders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleOrders.map(order => (
                <div key={order.id} className="bg-card border rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{order.customer}</h3>
                      <p className="text-sm text-muted-foreground">{order.branch} · {order.time}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-muted-foreground text-sm">Order {order.id}</span>
                    <span className="font-bold text-primary">Rs. {order.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
