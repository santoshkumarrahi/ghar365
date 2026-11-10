import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, Layers, ShieldCheck, Scale, Check } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart, selectedCity, selectedArea, shops, canDeliverToLocation } = useApp();
  const [quantity, setQuantity] = useState<number>(product.minQuantity || 1);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const shop = shops.find((s) => s.id === product.shopId);
  const deliveryStatus = shop
    ? canDeliverToLocation(shop, selectedCity, selectedArea)
    : { canDeliver: true };

  const isOutOfStock = product.availableStock <= 0;
  const isLowStock = product.availableStock > 0 && product.availableStock <= product.lowStockThreshold;

  const handleStepChange = (delta: number) => {
    const step = product.unit === 'litre' || product.unit === 'kg' ? 0.5 : 1;
    const nextVal = +(quantity + delta * step).toFixed(1);
    if (nextVal >= (product.minQuantity || 1) && nextVal <= product.availableStock) {
      setQuantity(nextVal);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.hasVariants) {
      onOpenDetails(product);
      return;
    }

    const res = addToCart(product, quantity);
    if (res.success) {
      setAddedNotice(`Added ${quantity} ${product.unit}!`);
      setTimeout(() => setAddedNotice(null), 2000);
    } else {
      alert(res.message);
    }
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden flex flex-col cursor-pointer group"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.isWeightEligible && (
            <span className="bg-[#126B45]/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <Scale className="w-3 h-3 text-[#F2B84B]" /> {product.weightKg} kg/unit
            </span>
          )}
          {product.complianceCategory === 'pharmacy' && (
            <span className="bg-blue-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <ShieldCheck className="w-3 h-3" /> DRAP Licensed
            </span>
          )}
        </div>

        {/* Stock alerts */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-2">
            <span className="bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow uppercase tracking-wide">
              Out of Stock
            </span>
          </div>
        ) : isLowStock ? (
          <span className="absolute bottom-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
            Only {product.availableStock} {product.unit} left!
          </span>
        ) : null}

        {product.hasVariants && (
          <span className="absolute top-2 right-2 bg-gray-900/80 text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#F2B84B]" /> {product.variants?.length} Options
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Shop information with Shop Logo (PRD Section 6) */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              {shop?.logoUrl && (
                <img
                  src={shop.logoUrl}
                  alt={shop.shopName}
                  className="w-4 h-4 rounded-full object-cover shrink-0 border border-gray-200"
                />
              )}
              <span className="truncate max-w-[130px] font-semibold text-emerald-800">{product.shopName}</span>
            </div>
            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono shrink-0">
              {product.category}
            </span>
          </div>

          {/* Product Name */}
          <h4 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-1 group-hover:text-[#126B45] transition">
            {product.name}
          </h4>
          {product.nameUrdu && (
            <p className="font-urdu text-xs text-emerald-700 font-semibold line-clamp-1 mt-0.5">
              {product.nameUrdu}
            </p>
          )}

          {/* Delivery & Stock Information (PRD Section 6) */}
          <div className="text-[10px] text-gray-500 mt-1 flex items-center justify-between">
            <span>
              Stock: <strong className={product.availableStock > 0 ? 'text-gray-800' : 'text-red-600'}>{product.availableStock} {product.unit}</strong>
            </span>
            <span>
              Delivery: <strong className="text-[#126B45]">Rs. {shop?.deliveryFee ?? 120}</strong>
            </span>
          </div>

          {/* Delivery notice */}
          {!deliveryStatus.canDeliver && (
            <p className="text-[11px] text-amber-700 bg-amber-50 rounded p-1 mt-1.5 line-clamp-1">
              ⚠️ Local delivery: Not available in {selectedCity}
            </p>
          )}
        </div>

        {/* Pricing & Order Actions */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-base sm:text-lg font-bold text-[#126B45]">
                Rs. {product.discountPrice || product.price}
              </span>
              <span className="text-xs text-gray-500 ml-1">/ {product.unit}</span>
            </div>
            {product.discountPrice && (
              <span className="text-xs text-gray-400 line-through">
                Rs. {product.price}
              </span>
            )}
          </div>

          {/* Quantity selector or Add Button */}
          {product.hasVariants ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(product);
              }}
              className="w-full py-2 px-3 bg-gray-100 hover:bg-[#126B45] hover:text-white text-gray-800 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" /> Select Color / Size
            </button>
          ) : (
            <div className="flex items-center gap-2">
              {/* Stepper */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center border border-gray-200 rounded-lg overflow-hidden shrink-0 bg-gray-50"
              >
                <button
                  type="button"
                  onClick={() => handleStepChange(-1)}
                  disabled={quantity <= (product.minQuantity || 1) || isOutOfStock}
                  className="p-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-2 text-xs font-semibold text-gray-800 min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleStepChange(1)}
                  disabled={quantity >= product.availableStock || isOutOfStock}
                  className="p-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Add Button */}
              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={isOutOfStock}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition shadow-xs ${
                  addedNotice
                    ? 'bg-emerald-600 text-white'
                    : isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#126B45] hover:bg-[#0e5235] text-white active:scale-95'
                }`}
              >
                {addedNotice ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Added!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add (Rs. {(quantity * (product.discountPrice || product.price)).toLocaleString()})</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
