import React, { useState } from 'react';
import {
  Sparkles,
  Store,
  Tag,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Scale,
  ShoppingBag,
  Filter,
  Flame,
  Droplet,
  Pill,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, Shop } from '../types';
import { ProductCard } from './ProductCard';
import { FreeDeliveryBanner } from './FreeDeliveryBanner';

import { CategoryCardGrid, MARKETPLACE_CATEGORIES } from './CategoryCardGrid';

interface CustomerViewProps {
  onOpenProductDetails: (product: Product) => void;
  onOpenShopProfile?: (shop: Shop) => void;
  searchQuery: string;
}

export const CustomerView: React.FC<CustomerViewProps> = ({
  onOpenProductDetails,
  onOpenShopProfile,
  searchQuery,
}) => {
  const { products, shops, selectedCity, selectedArea, canDeliverToLocation } = useApp();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedShopFilter, setSelectedShopFilter] = useState<string | null>(null);
  const [onlyWeightEligible, setOnlyWeightEligible] = useState(false);

  // Current category keywords
  const activeMarketCategory = MARKETPLACE_CATEGORIES.find((c) => c.id === selectedCategoryId);

  // Filter shops by current city and category/search
  const cityShops = shops.filter((s) => {
    // 1. City check
    const inCity = s.city.toLowerCase() === selectedCity.toLowerCase();
    if (!inCity) return false;

    // 2. Search check (search by shop name, owner, area, or category)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchShopName = s.shopName.toLowerCase().includes(q);
      const matchOwner = s.ownerName.toLowerCase().includes(q);
      const matchArea = s.area.toLowerCase().includes(q);
      const matchCat = s.category.toLowerCase().includes(q);
      const hasMatchingProduct = products.some(
        (p) => p.shopId === s.id && (p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      );
      if (!matchShopName && !matchOwner && !matchArea && !matchCat && !hasMatchingProduct) {
        return false;
      }
    }

    // 3. Category card filter
    if (activeMarketCategory) {
      const shopText = `${s.category} ${s.shopName} ${s.description || ''}`.toLowerCase();
      const shopMatches = activeMarketCategory.keywords.some((k) => shopText.includes(k));
      const hasProductInCat = products.some(
        (p) =>
          p.shopId === s.id &&
          activeMarketCategory.keywords.some((k) =>
            `${p.category} ${p.subcategory || ''} ${p.name}`.toLowerCase().includes(k)
          )
      );
      if (!shopMatches && !hasProductInCat) {
        return false;
      }
    }

    return true;
  });

  // Filter products
  const filteredProducts = products.filter((p) => {
    // 1. Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchUrdu = p.nameUrdu?.includes(q);
      const matchShop = p.shopName.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      if (!matchName && !matchUrdu && !matchShop && !matchCat) return false;
    }

    // 2. Category card filter
    if (activeMarketCategory) {
      const prodText = `${p.category} ${p.subcategory || ''} ${p.name} ${p.description}`.toLowerCase();
      const matchesCat = activeMarketCategory.keywords.some((k) => prodText.includes(k));
      if (!matchesCat) return false;
    }

    // 3. Shop filter
    if (selectedShopFilter && p.shopId !== selectedShopFilter) {
      return false;
    }

    // 4. Weight eligible filter
    if (onlyWeightEligible && !p.isWeightEligible) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Official Hero Banner Graphic with Pakistani Family */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-emerald-800 bg-[#126B45]">
        <img
          src="/assets/aistudio/ghar365_main_hero_banner_3a4f6c8c.png"
          alt="Ghar365 - Ghar Ki Har Zaroorat, Ab Sirf Ek App Par!"
          className="w-full h-auto object-cover max-h-[340px] block"
        />
        {/* Subtle bottom gradient overlay with live city badge - responsive for mobile & desktop */}
        <div className="sm:absolute sm:bottom-3 sm:left-4 sm:right-4 flex flex-col min-[480px]:flex-row items-center justify-between gap-1.5 sm:gap-2 px-3 py-2 sm:p-0 bg-[#0c4e32] sm:bg-transparent border-t border-emerald-700/60 sm:border-0">
          <span className="bg-black/60 backdrop-blur-md text-white text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full border border-white/20 font-semibold flex items-center gap-1.5 max-w-full justify-center sm:justify-start text-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#F2B84B] shrink-0" />
            <span className="truncate">Delivering to verified addresses in {selectedCity}</span>
          </span>
          <span className="bg-[#F2B84B] text-[#202C27] text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider shadow shrink-0 whitespace-nowrap">
            Free Delivery &gt;10 kg
          </span>
        </div>
      </div>

      {/* Trust Features Strip */}
      <div className="rounded-2xl overflow-hidden border border-gray-200/80 shadow-xs bg-white p-2">
        <img
          src="/assets/aistudio/trust_features_icon_strip_34fa6a84.png"
          alt="Easy Shopping, Secure Payment, 24/7 Support, Made in Pakistan"
          className="w-full h-auto object-contain max-h-24 mx-auto"
        />
      </div>

      {/* Weight-Based Free Delivery Banner */}
      <FreeDeliveryBanner />

      {/* Responsive 12-Category Cards Showcase (PRD Section 2) */}
      <CategoryCardGrid
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {/* Verified Neighborhood Shops Section (PRD Section 3) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-1.5">
              <Store className="w-4 h-4 text-[#126B45]" />
              Verified Local Shops in {selectedCity} ({cityShops.length})
            </h3>
            <p className="text-xs text-gray-500">
              Click any shop to enter its dedicated storefront and see its live products & pricing
            </p>
          </div>
          {selectedShopFilter && (
            <button
              type="button"
              onClick={() => setSelectedShopFilter(null)}
              className="text-xs text-red-600 hover:underline font-semibold"
            >
              Clear Shop Filter ✕
            </button>
          )}
        </div>

        {cityShops.length === 0 ? (
          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 text-xs text-amber-800 space-y-2 text-center">
            <Store className="w-8 h-8 text-amber-600 mx-auto" />
            <p className="font-bold">No registered shops match your criteria in {selectedCity}.</p>
            <p className="text-gray-600">
              {selectedCategoryId
                ? `No shops currently found in "${activeMarketCategory?.name}". Try clearing the category filter or changing your location.`
                : 'Try switching your location to Mithi to explore our verified flagship stores.'}
            </p>
            {selectedCategoryId && (
              <button
                type="button"
                onClick={() => setSelectedCategoryId(null)}
                className="px-3 py-1 bg-[#126B45] text-white rounded-lg font-bold text-xs"
              >
                Clear Category Filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cityShops.map((shop) => {
              const deliveryCheck = canDeliverToLocation(shop, selectedCity, selectedArea);
              const isSelected = selectedShopFilter === shop.id;

              return (
                <div
                  key={shop.id}
                  onClick={() => {
                    // Open dedicated storefront directly on card click (PRD Section 3)
                    if (onOpenShopProfile) {
                      onOpenShopProfile(shop);
                    } else {
                      setSelectedShopFilter(isSelected ? null : shop.id);
                    }
                  }}
                  className="group p-4 rounded-2xl border border-gray-200 hover:border-[#126B45] bg-white hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Subtle top cover preview */}
                  {shop.coverImageUrl && (
                    <div className="h-20 -mx-4 -mt-4 mb-3 overflow-hidden bg-emerald-900 relative">
                      <img
                        src={shop.coverImageUrl}
                        alt={`${shop.shopName} cover`}
                        className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                        ★ {shop.rating}
                      </span>
                    </div>
                  )}

                  <div>
                    {!shop.coverImageUrl && (
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-[#126B45] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 text-[10px]">
                          {shop.category}
                        </span>
                        <span className="text-amber-600 font-bold">★ {shop.rating}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2.5">
                      <img
                        src={shop.logoUrl || shop.imageUrl}
                        alt={shop.shopName}
                        className="w-12 h-12 rounded-xl object-cover bg-gray-50 border border-gray-200 shadow-xs shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-[#126B45] transition-colors">
                          {shop.shopName}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">Proprietor: {shop.ownerName}</p>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-600 mt-2 space-y-0.5">
                      <div>📍 {shop.area}, {shop.city}</div>
                      <div>🚚 Delivery Fee: Rs. {shop.deliveryFee}</div>
                      <div>⏱️ Hours: {shop.openingHours || '8:00 AM'} - {shop.closingHours || '10:00 PM'}</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      {deliveryCheck.canDeliver ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Delivers to {selectedArea}
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium">
                          ⚠️ Limited delivery
                        </span>
                      )}
                      <span className="text-emerald-800 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                        {shop.isOpen ? 'Open Now' : 'Closed'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenShopProfile) onOpenShopProfile(shop);
                      }}
                      className="w-full py-2 px-3 bg-[#126B45] hover:bg-[#0e5235] text-white font-bold text-xs rounded-xl transition text-center shadow-xs flex items-center justify-center gap-1"
                    >
                      <span>Open Shop Storefront</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Catalog Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
              Available Products ({filteredProducts.length})
            </h3>
            <p className="text-xs text-gray-500">
              Order small quantities such as 1 kg tomatoes or full household grocery
            </p>
          </div>

          {/* Weight Filter Toggle */}
          <button
            type="button"
            onClick={() => setOnlyWeightEligible(!onlyWeightEligible)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 self-start sm:self-auto ${
              onlyWeightEligible
                ? 'bg-[#126B45] text-white border-[#126B45]'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-[#F2B84B]" />
            <span>Show Only &gt;10 kg Eligible Products</span>
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-3">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto" />
            <h4 className="font-bold text-gray-800">No products match your search or filter</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Try choosing another category, clearing your search query, or switching shops.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={onOpenProductDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dual Promotional Campaign Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xs hover:shadow-md transition">
          <img
            src="/assets/aistudio/shop_smart_shop_local_9330ee28.png"
            alt="Shop Smart Shop Local - Support Pakistani Shops"
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xs hover:shadow-md transition">
          <img
            src="/assets/aistudio/fast_reliable_delivery_e42af94e.png"
            alt="Fast & Reliable Delivery Right to Your Doorstep"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* Mobile App Download Promotion Banner */}
      <div className="rounded-3xl overflow-hidden border border-emerald-800 shadow-md">
        <img
          src="/assets/aistudio/download_app_promo_8cb06ac2.png"
          alt="Download Ghar365 App - Available on Google Play & App Store"
          className="w-full h-auto object-cover max-h-56"
        />
      </div>
    </div>
  );
};
