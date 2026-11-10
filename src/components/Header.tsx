import React, { useState } from 'react';
import {
  ShoppingBag,
  MapPin,
  ChevronDown,
  Store,
  Bike,
  Shield,
  User,
  Sparkles,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface HeaderProps {
  onOpenLocation: () => void;
  onOpenCart: () => void;
  onOpenTests: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenOrders: () => void;
  onOpenAccount: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLocation,
  onOpenCart,
  onOpenTests,
  searchQuery,
  setSearchQuery,
  onOpenOrders,
  onOpenAccount,
}) => {
  const { activeRole, setActiveRole, selectedCity, selectedArea, cart, getCartWeight, orders, currentUser } = useApp();

  const cartWeight = getCartWeight();
  const activeOrdersCount = orders.filter((o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled').length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200/80 shadow-xs">
      {/* Top Brand Tagline Strip (Bilingual: Urdu + English) */}
      <div className="bg-[#126B45] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="font-urdu text-sm font-semibold text-[#F2B84B] tracking-wide">
              گھر کی ہر ضرورت، اب صرف ایک ایپ پر!
            </span>
            <span className="hidden md:inline text-white/50">•</span>
            <span className="hidden md:inline text-white/90 font-medium">Daily Needs. Delivered with Trust.</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-emerald-100">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              Verified Local Pakistani Shops
            </span>
            <button
              type="button"
              onClick={onOpenTests}
              className="bg-[#F2B84B] text-[#202C27] hover:bg-yellow-400 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1 transition shadow-xs"
            >
              <Sparkles className="w-3 h-3" /> PRD Test Suite (7/7)
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-4">
            <div className="cursor-pointer" onClick={() => setActiveRole('customer')}>
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-8 rounded-lg bg-[#126B45] text-[#F2B84B] flex items-center justify-center font-black text-xl shadow-xs">
                  G
                </div>
                <div>
                  <div className="flex items-baseline">
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-[#126B45]">Ghar</span>
                    <span className="text-xl sm:text-2xl font-black text-[#F2B84B]">365</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Selector Button */}
            <button
              type="button"
              onClick={onOpenLocation}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#F7F5EF] hover:bg-gray-100 border border-gray-200 rounded-xl text-xs transition text-left"
            >
              <MapPin className="w-4 h-4 text-[#126B45] shrink-0" />
              <div>
                <div className="text-[10px] text-gray-500 font-medium">Delivering in:</div>
                <div className="font-bold text-gray-900 flex items-center gap-1">
                  <span>{selectedArea}, {selectedCity}</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            </button>
          </div>

          {/* Search Bar (Customer View) */}
          {activeRole === 'customer' && (
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search fresh tomatoes, rice, milk, ajrak, medicines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#126B45] focus:bg-white transition"
                />
              </div>
            </div>
          )}

          {/* Right Actions: Role Selector & Cart */}
          <div className="flex items-center gap-2">
            {/* Viewport Role Switcher Tabs */}
            <div className="hidden lg:flex items-center bg-[#F7F5EF] p-1 rounded-xl border border-gray-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveRole('customer')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  activeRole === 'customer'
                    ? 'bg-[#126B45] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Customer
              </button>
              <button
                type="button"
                onClick={() => setActiveRole('seller')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  activeRole === 'seller'
                    ? 'bg-[#126B45] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Store className="w-3.5 h-3.5" /> Seller App
              </button>
              <button
                type="button"
                onClick={() => setActiveRole('rider')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  activeRole === 'rider'
                    ? 'bg-[#126B45] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Bike className="w-3.5 h-3.5" /> Rider App
              </button>
              <button
                type="button"
                onClick={() => setActiveRole('admin')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  activeRole === 'admin'
                    ? 'bg-[#126B45] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Shield className="w-3.5 h-3.5" /> Super Admin
              </button>
            </div>

            {/* Mobile Role Switcher Dropdown */}
            <div className="lg:hidden">
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value as UserRole)}
                className="px-2.5 py-1.5 bg-[#F7F5EF] border border-gray-200 rounded-lg text-xs font-bold text-[#126B45] focus:outline-none"
              >
                <option value="customer">Customer View</option>
                <option value="seller">Seller Portal</option>
                <option value="rider">Rider App</option>
                <option value="admin">Super Admin</option>
              </select>
            </div>

            {/* My Account Button */}
            <button
              type="button"
              onClick={onOpenAccount}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F5EF] hover:bg-emerald-50 border border-gray-200 hover:border-[#126B45]/40 rounded-xl text-xs font-bold text-gray-800 transition"
              title="Open My Account"
            >
              <div className="w-6 h-6 rounded-full bg-[#126B45] text-[#F2B84B] flex items-center justify-center font-bold text-[10px]">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="hidden sm:inline">My Account</span>
            </button>

            {/* Active Orders Quick Link */}
            {activeRole === 'customer' && (
              <button
                type="button"
                onClick={onOpenOrders}
                className="p-2 text-gray-700 hover:text-[#126B45] hover:bg-gray-100 rounded-xl transition relative"
                title="My Orders & Tracking"
              >
                <span className="text-xs font-bold hidden sm:inline">Orders</span>
                {activeOrdersCount > 0 && (
                  <span className="sm:ml-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {activeOrdersCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart Button */}
            {activeRole === 'customer' && (
              <button
                type="button"
                onClick={onOpenCart}
                className="flex items-center gap-2 bg-[#126B45] hover:bg-[#0e5235] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm active:scale-95"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-[#F2B84B]" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {cart.length}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">
                  {cartWeight > 0 ? `${cartWeight.toFixed(1)} kg` : 'Cart'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search & Location Sub-bar */}
        <div className="mt-2.5 flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={onOpenLocation}
            className="flex-1 flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F5EF] border border-gray-200 rounded-lg text-xs truncate"
          >
            <MapPin className="w-3.5 h-3.5 text-[#126B45] shrink-0" />
            <span className="truncate font-semibold text-gray-800">{selectedArea}, {selectedCity}</span>
            <ChevronDown className="w-3 h-3 text-gray-400 shrink-0 ml-auto" />
          </button>
        </div>

        {activeRole === 'customer' && (
          <div className="mt-2 block md:hidden">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tomatoes, milk, fashion, pharmacy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#126B45]"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
