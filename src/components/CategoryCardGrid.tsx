import React from 'react';
import {
  Apple,
  Carrot,
  Salad,
  Pill,
  HeartPulse,
  Shirt,
  ShoppingBag,
  Sparkles,
  Footprints,
  Smartphone,
  Home,
  Store,
  Check,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface MarketplaceCategory {
  id: string;
  name: string;
  nameUrdu: string;
  imageUrl: string;
  fallbackIcon: React.ElementType;
  gradient: string;
  accentColor: string;
  keywords: string[];
}

export const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = [
  {
    id: 'fruits',
    name: 'Fruits',
    nameUrdu: 'تازہ پھل',
    imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: Apple,
    gradient: 'from-amber-600/80 to-red-600/80',
    accentColor: 'text-amber-500',
    keywords: ['fruits', 'fruit', 'mango', 'apple', 'banana', 'orange', 'grapes', 'پھل'],
  },
  {
    id: 'vegetables',
    name: 'Vegetables',
    nameUrdu: 'تازہ سبزیاں',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: Carrot,
    gradient: 'from-emerald-700/80 to-green-600/80',
    accentColor: 'text-emerald-500',
    keywords: ['vegetables', 'vegetable', 'tomato', 'potato', 'onion', 'chili', 'سبزی', 'ٹماٹر', 'آلو', 'پیاز'],
  },
  {
    id: 'fruits_vegetables',
    name: 'Fruits & Vegetables',
    nameUrdu: 'پھل اور سبزیاں',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: Salad,
    gradient: 'from-green-700/80 to-lime-600/80',
    accentColor: 'text-lime-500',
    keywords: ['fruits & vegetables', 'fresh food', 'produce', 'farm fresh', 'سبزیاں'],
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    nameUrdu: 'مستند فارمیسی',
    imageUrl: 'https://images.unsplash.com/photo-1586015554060-8db665966b68?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: Pill,
    gradient: 'from-blue-700/80 to-teal-600/80',
    accentColor: 'text-blue-500',
    keywords: ['pharmacy', 'licensed pharmacy', 'drap', 'medicine', 'panadol', 'disprin', 'دوا', 'فارمیسی'],
  },
  {
    id: 'medical_store',
    name: 'Medical Store',
    nameUrdu: 'میڈیکل سٹور',
    imageUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: HeartPulse,
    gradient: 'from-cyan-700/80 to-blue-600/80',
    accentColor: 'text-cyan-500',
    keywords: ['medical store', 'medical', 'first aid', 'healthcare', 'ors', 'bandage', 'طبی سامان'],
  },
  {
    id: 'clothes_fashion',
    name: 'Clothes & Fashion',
    nameUrdu: 'کپڑے اور فیشن',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: Shirt,
    gradient: 'from-purple-700/80 to-pink-600/80',
    accentColor: 'text-pink-500',
    keywords: ['clothes & fashion', 'clothes', 'fashion', "women's fashion", 'kurti', 'lawn', 'suit', 'shirt', 'فیشن'],
  },
  {
    id: 'grocery_store',
    name: 'Grocery Store',
    nameUrdu: 'کریانہ سٹور',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: ShoppingBag,
    gradient: 'from-amber-700/80 to-yellow-600/80',
    accentColor: 'text-[#F2B84B]',
    keywords: ['grocery store', 'grocery', 'grocery and fresh food', 'rice', 'milk', 'eggs', 'flour', 'oil', 'چاول', 'دودھ'],
  },
  {
    id: 'cosmetics',
    name: 'Cosmetics',
    nameUrdu: 'کاسمیٹکس و بیوٹی',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: Sparkles,
    gradient: 'from-rose-700/80 to-pink-500/80',
    accentColor: 'text-rose-400',
    keywords: ['cosmetics', 'beauty', 'skincare', 'lotion', 'cream', 'rose water', 'attar', 'کاسمیٹکس'],
  },
  {
    id: 'shoes_bags',
    name: 'Shoes & Bags',
    nameUrdu: 'جوتے اور بیگز',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: Footprints,
    gradient: 'from-stone-700/80 to-amber-800/80',
    accentColor: 'text-amber-400',
    keywords: ['shoes & bags', 'shoes', 'bags', 'handbag', 'bag', 'leather', 'chappal', 'sandals', 'ہینڈ بیگ'],
  },
  {
    id: 'electronics',
    name: 'Electronics',
    nameUrdu: 'الیکٹرانکس',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: Smartphone,
    gradient: 'from-indigo-700/80 to-cyan-600/80',
    accentColor: 'text-indigo-400',
    keywords: ['electronics', 'charger', 'light', 'led', 'cable', 'solar', 'battery', 'الیکٹرانکس'],
  },
  {
    id: 'home_essentials',
    name: 'Home Essentials',
    nameUrdu: 'گھریلو ضروریات',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: Home,
    gradient: 'from-teal-700/80 to-emerald-600/80',
    accentColor: 'text-teal-400',
    keywords: ['home essentials', 'water', 'lpg', 'cylinder', 'gas', 'cleaning', 'گھریلو سامان'],
  },
  {
    id: 'other_shops',
    name: 'Other Shops',
    nameUrdu: 'دیگر تصدیق شدہ دکانیں',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: Store,
    gradient: 'from-gray-700/80 to-slate-800/80',
    accentColor: 'text-gray-300',
    keywords: ['other shops', 'handicrafts', 'specialty', 'services', 'other', 'عام دکان'],
  },
];

interface CategoryCardGridProps {
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export const CategoryCardGrid: React.FC<CategoryCardGridProps> = ({
  selectedCategoryId,
  onSelectCategory,
}) => {
  const { shops, products } = useApp();

  const getCategoryCount = (cat: MarketplaceCategory) => {
    // Match either products or shops
    const matchProducts = products.filter((p) => {
      const text = `${p.category} ${p.subcategory || ''} ${p.name}`.toLowerCase();
      return cat.keywords.some((k) => text.includes(k));
    }).length;

    const matchShops = shops.filter((s) => {
      const text = `${s.category} ${s.shopName}`.toLowerCase();
      return cat.keywords.some((k) => text.includes(k));
    }).length;

    return { products: matchProducts, shops: matchShops };
  };

  const activeCategory = MARKETPLACE_CATEGORIES.find((c) => c.id === selectedCategoryId);

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
              Shop by Category (مارکیٹ کیٹگریز)
            </h3>
            <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full hidden sm:inline-block">
              12 Categories
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Browse verified local vendors by sector across Pakistan
          </p>
        </div>

        {selectedCategoryId && (
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className="text-xs text-[#126B45] hover:text-[#0e5235] font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition"
          >
            <X className="w-3.5 h-3.5" /> Clear Filter
          </button>
        )}
      </div>

      {/* Active Filter Callout Strip */}
      {activeCategory && (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#126B45]" />
            <span>
              Showing shops & products in <strong>{activeCategory.name}</strong> ({activeCategory.nameUrdu})
            </span>
          </div>
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className="text-[11px] text-emerald-800 hover:underline font-bold"
          >
            Show All
          </button>
        </div>
      )}

      {/* Responsive 12-Category Grid:
          Mobile: 3 columns (compact touch targets)
          Tablet: 4 columns
          Desktop: 6 columns
      */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
        {MARKETPLACE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const Icon = cat.fallbackIcon;
          const counts = getCategoryCount(cat);

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              className={`group relative rounded-2xl overflow-hidden border transition-all text-left flex flex-col justify-between aspect-[4/3] sm:aspect-[1/1] p-2.5 sm:p-3 ${
                isSelected
                  ? 'ring-2 ring-[#126B45] border-[#126B45] shadow-md scale-[1.02]'
                  : 'border-gray-200 hover:border-emerald-300 hover:shadow-md bg-white'
              }`}
            >
              {/* Background Image with Fallback Scrim */}
              <div className="absolute inset-0 bg-gray-900 overflow-hidden">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 opacity-75"
                  onError={(e) => {
                    // Fallback to gradient if image fails
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} opacity-90`} />
              </div>

              {/* Card Top: Icon & Selected Checkmark */}
              <div className="relative z-10 flex items-start justify-between w-full">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-xs">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-[#F2B84B] text-[#202C27] flex items-center justify-center font-black shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>

              {/* Card Bottom: Titles & Info */}
              <div className="relative z-10 text-white mt-auto">
                <div className="font-bold text-[11px] sm:text-xs leading-tight line-clamp-1 group-hover:text-[#F2B84B] transition-colors">
                  {cat.name}
                </div>
                <div className="text-[9px] sm:text-[10px] text-white/80 font-urdu leading-tight truncate">
                  {cat.nameUrdu}
                </div>
                <div className="text-[9px] text-white/70 font-medium hidden sm:block mt-0.5">
                  {counts.shops > 0 ? `${counts.shops} shop${counts.shops > 1 ? 's' : ''}` : 'Verified'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
