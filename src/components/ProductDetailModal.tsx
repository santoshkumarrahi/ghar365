import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Scale, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useApp } from '../context/AppContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, selectedCity, selectedArea, shops, canDeliverToLocation } = useApp();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(() => {
    if (product?.hasVariants && product.variants && product.variants.length > 0) {
      // Pick first in-stock variant by default
      return product.variants.find((v) => v.stock > 0) || product.variants[0];
    }
    return undefined;
  });

  const [quantity, setQuantity] = useState<number>(product?.minQuantity || 1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) return null;

  const shop = shops.find((s) => s.id === product.shopId);
  const deliveryCheck = shop
    ? canDeliverToLocation(shop, selectedCity, selectedArea)
    : { canDeliver: true };

  const currentPrice = selectedVariant ? selectedVariant.price : (product.discountPrice || product.price);
  const currentStock = selectedVariant ? selectedVariant.stock : product.availableStock;
  const isOutOfStock = currentStock <= 0;
  
  // Multi-image list
  const allImages = Array.from(
    new Set(
      [
        selectedVariant?.imageUrl,
        ...(product.images || []),
        product.imageUrl,
      ].filter(Boolean) as string[]
    )
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const currentImage = allImages[activeImageIndex] || selectedVariant?.imageUrl || product.imageUrl;

  const handleStep = (delta: number) => {
    const step = product.unit === 'litre' || product.unit === 'kg' ? 0.5 : 1;
    const nextVal = +(quantity + delta * step).toFixed(1);
    if (nextVal >= (product.minQuantity || 1) && nextVal <= currentStock) {
      setQuantity(nextVal);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      alert('Selected item or variant is currently out of stock.');
      return;
    }
    const res = addToCart(product, quantity, selectedVariant);
    if (res.success) {
      setAddedNotice(true);
      setTimeout(() => {
        setAddedNotice(false);
        onClose();
      }, 1200);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#126B45]">
              {product.category}
            </span>
            <span className="text-xs text-gray-500 font-mono">SKU: {selectedVariant?.sku || product.sku}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100 relative">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.isWeightEligible && (
                  <span className="absolute top-2 left-2 bg-[#126B45] text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <Scale className="w-3.5 h-3.5 text-[#F2B84B]" /> {product.weightKg} kg / {product.unit}
                  </span>
                )}
                {isOutOfStock && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Multi-image Thumbnail Strip */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                        activeImageIndex === idx
                          ? 'border-[#126B45] ring-2 ring-[#126B45]/30'
                          : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Shop Badge */}
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 text-xs">
                <div className="font-semibold text-emerald-900">Sold & Delivered By:</div>
                <div className="text-[#126B45] font-bold text-sm mt-0.5">{product.shopName}</div>
                <div className="text-gray-600 mt-1">
                  Location: {shop?.area}, {shop?.city} • Delivery Fee: Rs. {shop?.deliveryFee || 150}
                </div>
              </div>
            </div>

            {/* Product Details & Selection */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
                {product.nameUrdu && (
                  <p className="font-urdu text-base text-[#126B45] font-bold mt-1">{product.nameUrdu}</p>
                )}

                {/* Price */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#126B45]">
                    Rs. {currentPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600">per {product.unit}</span>
                  {product.discountPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      Rs. {product.price}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Colors and Sizes Badges */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-gray-500 font-semibold">Available Colors:</span>
                    {product.colors.map((c, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full border border-gray-200 font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-gray-500 font-semibold">Available Sizes:</span>
                    {product.sizes.map((s, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full border border-gray-200 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Variants Selection (e.g., Test 5 Color Variants) */}
                {product.hasVariants && product.variants && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                        Choose Variant / Color:
                      </label>
                      <span className="text-xs text-gray-500">
                        Selected: <strong className="text-gray-900">{selectedVariant?.name}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.variants.map((v) => {
                        const isSelected = selectedVariant?.id === v.id;
                        const isZeroStock = v.stock <= 0;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            disabled={isZeroStock}
                            onClick={() => {
                              setSelectedVariant(v);
                              setQuantity(1);
                            }}
                            className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between text-xs ${
                              isZeroStock
                                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                                : isSelected
                                ? 'bg-emerald-50 border-[#126B45] text-emerald-900 ring-2 ring-[#126B45]/20 font-semibold'
                                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <div>
                              <div className="font-bold flex items-center gap-1.5">
                                {v.color && (
                                  <span
                                    className="w-3 h-3 rounded-full border border-black/10 inline-block"
                                    style={{
                                      backgroundColor:
                                        v.color.toLowerCase() === 'red'
                                          ? '#dc2626'
                                          : v.color.toLowerCase() === 'black'
                                          ? '#111827'
                                          : v.color.toLowerCase() === 'pink'
                                          ? '#ec4899'
                                          : '#4b5563',
                                    }}
                                  />
                                )}
                                {v.name}
                              </div>
                              <div className="text-[11px] text-gray-500 mt-0.5">Rs. {v.price}</div>
                            </div>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                isZeroStock
                                  ? 'bg-red-100 text-red-700'
                                  : v.stock <= 3
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-[#126B45]'
                              }`}
                            >
                              {isZeroStock ? 'Sold Out' : `${v.stock} in stock`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Delivery warning */}
                {!deliveryCheck.canDeliver && (
                  <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Delivery Zone Notice:</strong> {deliveryCheck.reason}
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity & Add to Cart Section */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <button
                      type="button"
                      onClick={() => handleStep(-1)}
                      disabled={quantity <= (product.minQuantity || 1) || isOutOfStock}
                      className="p-2 text-gray-600 hover:bg-gray-200 disabled:opacity-40"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-bold text-gray-800 min-w-12 text-center">
                      {quantity} {product.unit}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleStep(1)}
                      disabled={quantity >= currentStock || isOutOfStock}
                      className="p-2 text-gray-600 hover:bg-gray-200 disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtotal calculation */}
                <div className="flex justify-between items-baseline text-sm bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="text-gray-600">
                    Item Total ({quantity} {product.unit} × Rs. {currentPrice}):
                  </span>
                  <span className="text-lg font-bold text-[#126B45]">
                    Rs. {(quantity * currentPrice).toLocaleString()}
                  </span>
                </div>

                {product.isWeightEligible && (
                  <div className="text-xs text-gray-500 flex items-center justify-between">
                    <span>Eligible Weight Contribution:</span>
                    <span className="font-semibold text-emerald-800">
                      +{(quantity * (product.weightKg || 1)).toFixed(1)} kg
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-md ${
                    addedNotice
                      ? 'bg-emerald-600 text-white'
                      : isOutOfStock
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#126B45] hover:bg-[#0e5235] text-white'
                  }`}
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart!
                    </>
                  ) : isOutOfStock ? (
                    'Out of Stock'
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart • Rs. {(quantity * currentPrice).toLocaleString()}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
