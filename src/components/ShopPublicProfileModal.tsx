import React from 'react';
import {
  X,
  Store,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Tag,
  Megaphone,
  ShoppingBag,
  Share2,
  Scale,
} from 'lucide-react';
import { Shop, Product } from '../types';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';

interface ShopPublicProfileModalProps {
  shop: Shop | null;
  onClose: () => void;
  onOpenProductDetails: (product: Product) => void;
}

export const ShopPublicProfileModal: React.FC<ShopPublicProfileModalProps> = ({
  shop,
  onClose,
  onOpenProductDetails,
}) => {
  const { products } = useApp();

  if (!shop) return null;

  const shopProducts = products.filter((p) => p.shopId === shop.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cover Image & Header */}
        <div className="relative h-48 sm:h-64 w-full bg-emerald-900 overflow-hidden shrink-0">
          <img
            src={shop.coverImageUrl || shop.imageUrl}
            alt={shop.shopName}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Shop info overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="flex items-center gap-3">
              <img
                src={shop.logoUrl || shop.imageUrl}
                alt={shop.shopName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-white p-1 border-2 border-white shadow-lg shrink-0"
              />
              <div className="text-white">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black drop-shadow">{shop.shopName}</h2>
                  <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified Shop
                  </span>
                </div>
                <p className="text-xs text-emerald-100 flex items-center gap-2 mt-0.5">
                  <span>Proprietor: {shop.ownerName}</span>
                  <span>•</span>
                  <span>{shop.category}</span>
                </p>
                <div className="flex items-center gap-2 text-xs text-yellow-300 font-semibold mt-1">
                  <span>★ {shop.rating} ({shop.totalOrders} deliveries)</span>
                  <span>•</span>
                  <span>{shop.isOpen ? '🟢 Open Now' : '🔴 Closed'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Contact & Hours Quick Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7F5EF] p-3.5 rounded-xl border border-gray-200">
            <div>
              <span className="text-gray-500 font-medium block">Phone / Call:</span>
              <span className="font-bold text-gray-900">{shop.phone}</span>
            </div>
            {shop.whatsappNumber && (
              <div>
                <span className="text-gray-500 font-medium block">WhatsApp:</span>
                <span className="font-bold text-green-700">{shop.whatsappNumber}</span>
              </div>
            )}
            <div>
              <span className="text-gray-500 font-medium block">Operating Hours:</span>
              <span className="font-bold text-gray-900">{shop.openingHours || '08:00 AM'} - {shop.closingHours || '10:00 PM'}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium block">Delivery Fee:</span>
              <span className="font-bold text-[#126B45]">Rs. {shop.deliveryFee} (Free &gt;10 kg)</span>
            </div>
          </div>

          {/* Location & Delivery Coverage */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
              <MapPin className="w-4 h-4 text-[#126B45]" /> Shop Address & Delivery Zones
            </div>
            <p className="text-gray-700">{shop.address}, {shop.area}, {shop.city}, {shop.province}</p>
            <div className="pt-1 flex flex-wrap gap-1 text-[11px] text-gray-600">
              <span className="font-semibold text-emerald-900">Delivering inside {shop.city} to:</span>
              {shop.deliveryAreas?.map((area, idx) => (
                <span key={idx} className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-100">
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Promotional Banner & Offers (PRD Section 7) */}
          {(shop.promotionalBannerUrl || shop.specialOffers || shop.discountAnnouncements) && (
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-[#126B45]" /> Special Offers & Promotions
              </h4>

              {shop.promotionalBannerUrl && (
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={shop.promotionalBannerUrl}
                    alt="Promotions"
                    className="w-full h-36 sm:h-44 object-cover"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {shop.specialOffers && (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                    <span className="font-bold text-amber-900 block mb-0.5">🎁 Special Offer:</span>
                    <p className="text-amber-800">{shop.specialOffers}</p>
                  </div>
                )}
                {shop.discountAnnouncements && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                    <span className="font-bold text-emerald-900 block mb-0.5">🏷️ Discount Announcement:</span>
                    <p className="text-emerald-800">{shop.discountAnnouncements}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* About Our Shop (PRD Section 7) */}
          <div className="space-y-2 bg-[#F7F5EF] p-4 rounded-xl border border-gray-200">
            <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <Store className="w-4 h-4 text-[#126B45]" /> About Our Shop
            </h4>
            <p className="text-gray-700 leading-relaxed">
              {shop.aboutDescription || shop.description || 'Welcome to our verified shop on Ghar365.'}
            </p>
            {shop.shopIntroduction && (
              <p className="text-xs text-emerald-800 italic mt-1 font-medium">
                &ldquo;{shop.shopIntroduction}&rdquo;
              </p>
            )}
          </div>

          {/* Shop Products Grid (PRD Section 6) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#126B45]" /> Available Products from {shop.shopName} ({shopProducts.length})
              </h4>
              <span className="text-gray-500 text-xs">Direct neighborhood pricing</span>
            </div>

            {shopProducts.length === 0 ? (
              <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl">
                No active products currently listed by this shopkeeper.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {shopProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onOpenDetails={onOpenProductDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#126B45] text-white font-bold rounded-xl hover:bg-[#0e5235] transition text-xs"
          >
            Close Shop Profile
          </button>
        </div>
      </div>
    </div>
  );
};
