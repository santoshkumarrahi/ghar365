import React from 'react';
import { X, Package, Clock, KeyRound, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CustomerOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const CustomerOrdersModal: React.FC<CustomerOrdersModalProps> = ({
  isOpen,
  onClose,
  onTrackOrder,
}) => {
  const { orders } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="bg-[#126B45] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#F2B84B]" />
            <h3 className="font-bold text-lg">My Orders & Live Tracking</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-emerald-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500 space-y-2">
              <Package className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="font-medium text-sm text-gray-700">No orders placed yet</p>
              <p className="text-xs text-gray-500">
                When you purchase fresh vegetables, milk, fashion, or essentials, your orders will appear here.
              </p>
            </div>
          ) : (
            orders.map((o) => (
              <div
                key={o.id}
                className="bg-gray-50 hover:bg-gray-100/70 p-4 rounded-2xl border border-gray-200 transition space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-gray-200/70 pb-2">
                  <div>
                    <span className="font-bold text-sm text-gray-900">{o.orderNumber}</span>
                    <span className="text-gray-500 ml-2">from {o.shopName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-[#126B45] font-bold px-2 py-0.5 rounded-full capitalize">
                      {o.orderStatus.replace(/_/g, ' ')}
                    </span>
                    <span className="font-bold text-sm text-[#126B45]">Rs. {o.totalAmount}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-gray-600">
                  <div>
                    {o.items.length} items • Weight: <strong>{o.totalWeightKg.toFixed(1)} kg</strong>
                    {o.isFreeDelivery && <span className="text-emerald-700 ml-1 font-bold">(Free Delivery)</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 font-mono font-bold bg-white px-2 py-0.5 rounded border border-gray-200">
                      <KeyRound className="w-3.5 h-3.5 text-amber-600" /> OTP: {o.deliveryOtp}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onTrackOrder(o.id);
                      }}
                      className="px-3 py-1 bg-[#126B45] hover:bg-[#0e5235] text-white font-bold rounded-lg transition flex items-center gap-1"
                    >
                      Track Order <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
