import React from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, Truck, AlertTriangle, Scale } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: (shopId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOpenCheckout }) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    shops,
    getCartDeliveryFee,
    getCartWeight,
    selectedCity,
    selectedArea,
    canDeliverToLocation,
    settings,
  } = useApp();

  if (!isOpen) return null;

  // Group items by shopId
  const shopIds = Array.from(new Set(cart.map((i) => i.shopId)));

  const grandSubtotal = cart.reduce((acc, i) => acc + i.totalPrice, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-[#126B45] text-white flex items-center justify-between shadow">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#F2B84B]" />
              <h3 className="font-bold text-lg">Your Shopping Cart</h3>
              <span className="text-xs bg-emerald-800 px-2 py-0.5 rounded-full font-mono">
                {cart.length} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-emerald-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3">
                <div className="w-16 h-16 bg-emerald-50 text-[#126B45] rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h4 className="font-bold text-gray-800">Your cart is empty</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Browse fresh groceries, farm produce, fashion, and medicines from verified shops in {selectedCity}.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 px-4 py-2 bg-[#126B45] text-white text-xs font-semibold rounded-lg hover:bg-[#0e5235] transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              shopIds.map((shopId) => {
                const shop = shops.find((s) => s.id === shopId);
                const shopItems = cart.filter((i) => i.shopId === shopId);
                const shopSubtotal = shopItems.reduce((acc, i) => acc + i.totalPrice, 0);
                const shopWeight = getCartWeight(shopId);
                const deliveryCalc = getCartDeliveryFee(shopId);
                const deliveryCheck = shop
                  ? canDeliverToLocation(shop, selectedCity, selectedArea)
                  : { canDeliver: true };

                return (
                  <div
                    key={shopId}
                    className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xs"
                  >
                    {/* Shop Header */}
                    <div className="bg-gray-50 p-3 border-b border-gray-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-gray-900 flex items-center gap-1.5">
                          <span>{shop?.shopName || 'Shop Order'}</span>
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {shop?.city} • {shopItems.length} items
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#126B45]">
                        Subtotal: Rs. {shopSubtotal.toLocaleString()}
                      </span>
                    </div>

                    {/* Delivery notice if shop cannot deliver to customer address */}
                    {!deliveryCheck.canDeliver && (
                      <div className="bg-amber-50 p-2.5 text-xs text-amber-800 border-b border-amber-200 flex items-start gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Cannot deliver:</strong> {deliveryCheck.reason}
                        </div>
                      </div>
                    )}

                    {/* Weight-Based Free Delivery Progress for this shop */}
                    <div className="bg-emerald-50/60 p-2.5 border-b border-emerald-100 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-emerald-900 flex items-center gap-1">
                          <Scale className="w-3.5 h-3.5 text-[#126B45]" /> Weight: {shopWeight.toFixed(1)} kg
                        </span>
                        <span className="font-bold text-[#126B45]">
                          {deliveryCalc.isFree ? 'Free Delivery Unlocked!' : `Delivery: Rs. ${deliveryCalc.fee}`}
                        </span>
                      </div>

                      {deliveryCalc.isFree ? (
                        <p className="text-[11px] text-emerald-700 font-semibold">
                          🎉 Free delivery applied (order weight &gt; {settings.freeDeliveryThresholdKg} kg)!
                        </p>
                      ) : (
                        <p className="text-[11px] text-gray-600">
                          Add <strong>{deliveryCalc.neededForFreeKg} kg</strong> more to unlock FREE delivery (Threshold: &gt; {settings.freeDeliveryThresholdKg} kg).
                        </p>
                      )}
                    </div>

                    {/* Shop Items List */}
                    <div className="divide-y divide-gray-100 p-2">
                      {shopItems.map((item) => (
                        <div key={`${item.productId}_${item.variantId || 'base'}`} className="py-2.5 px-1 flex gap-3 items-center">
                          <img
                            src={item.variant?.imageUrl || item.product.imageUrl}
                            alt={item.product.name}
                            className="w-14 h-14 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-xs text-gray-900 truncate">
                              {item.product.name}
                            </h5>
                            {item.variant && (
                              <p className="text-[11px] text-emerald-700 font-medium">
                                Option: {item.variant.name}
                              </p>
                            )}
                            <div className="text-xs text-gray-500 mt-0.5">
                              Rs. {item.unitPrice} / {item.product.unit}
                            </div>
                            <div className="flex items-center justify-between mt-1.5">
                              {/* Stepper */}
                              <div className="flex items-center border border-gray-200 rounded overflow-hidden text-xs bg-gray-50">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateCartQuantity(
                                      item.productId,
                                      +(item.quantity - (item.product.unit === 'kg' ? 0.5 : 1)).toFixed(1),
                                      item.variantId
                                    )
                                  }
                                  className="p-1 hover:bg-gray-200 text-gray-600"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-2 font-bold text-gray-800">
                                  {item.quantity} {item.product.unit}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateCartQuantity(
                                      item.productId,
                                      +(item.quantity + (item.product.unit === 'kg' ? 0.5 : 1)).toFixed(1),
                                      item.variantId
                                    )
                                  }
                                  className="p-1 hover:bg-gray-200 text-gray-600"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <span className="font-bold text-xs text-[#126B45]">
                                Rs. {item.totalPrice.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId, item.variantId)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Shop Order Footer / Checkout Button */}
                    <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-gray-500">Shop Total: </span>
                        <span className="font-bold text-[#126B45] text-sm">
                          Rs. {(shopSubtotal + deliveryCalc.fee).toLocaleString()}
                        </span>
                      </div>
                      <button
                        type="button"
                        disabled={!deliveryCheck.canDeliver}
                        onClick={() => {
                          onClose();
                          onOpenCheckout(shopId);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                          deliveryCheck.canDeliver
                            ? 'bg-[#126B45] hover:bg-[#0e5235] text-white shadow-xs'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Checkout Shop <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cart Merchandise Total:</span>
                <span className="font-bold text-gray-900">Rs. {grandSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Delivery address:</span>
                <span className="font-medium text-emerald-800">{selectedArea}, {selectedCity}</span>
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={clearCart}
                  className="px-3 py-2 border border-gray-300 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-100 transition"
                >
                  Clear Cart
                </button>
                {shopIds.length === 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCheckout(shopIds[0]);
                    }}
                    className="flex-1 py-2.5 px-4 bg-[#126B45] hover:bg-[#0e5235] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                  >
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
