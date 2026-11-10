import React from 'react';
import {
  X,
  CheckCircle,
  Clock,
  Truck,
  Package,
  Store,
  KeyRound,
  ShieldCheck,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';

interface OrderTrackingModalProps {
  orderId: string | null;
  onClose: () => void;
}

const ORDER_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'placed', label: 'Order Placed', desc: 'Order received by marketplace' },
  { status: 'payment_verification_pending', label: 'Payment Verification', desc: 'Reviewing transfer reference' },
  { status: 'seller_confirmed', label: 'Seller Confirmed', desc: 'Shopkeeper accepted the order' },
  { status: 'preparing', label: 'Preparing Items', desc: 'Weighing & packaging items' },
  { status: 'ready_for_pickup', label: 'Ready for Pickup', desc: 'Package ready at local shop' },
  { status: 'rider_assigned', label: 'Rider Assigned', desc: 'Local delivery partner dispatched' },
  { status: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider on the way to your address' },
  { status: 'delivered', label: 'Delivered', desc: 'Handoff complete with OTP' },
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ orderId, onClose }) => {
  const { orders, updateOrderStatus, activeRole } = useApp();

  if (!orderId) return null;

  const order = orders.find((o) => o.id === orderId);
  if (!order) return null;

  const currentStepIndex = ORDER_STEPS.findIndex((s) => s.status === order.orderStatus);

  const handleAdvanceStep = async () => {
    const nextIdx = currentStepIndex + 1;
    if (nextIdx < ORDER_STEPS.length) {
      await updateOrderStatus(order.id, ORDER_STEPS[nextIdx].status, 'Status updated via tracking simulation');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#126B45] text-white p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#F2B84B] text-[#202C27] px-2 py-0.5 rounded">
                Live Tracking
              </span>
              <h3 className="font-bold text-lg">{order.orderNumber}</h3>
            </div>
            <p className="text-xs text-emerald-100 mt-0.5">
              Shop: {order.shopName} • Delivery to {order.customerArea}, {order.customerCity}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-emerald-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* OTP Handoff Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F2B84B] text-[#202C27] flex items-center justify-center font-black text-lg shadow-xs">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-amber-900 font-bold uppercase tracking-wider">
                  Secure Delivery OTP Code
                </div>
                <div className="text-xs text-gray-600">
                  Share this 6-digit code with the rider only when receiving your package
                </div>
              </div>
            </div>
            <span className="text-xl sm:text-2xl font-black font-mono tracking-widest text-emerald-900 bg-white px-3 py-1 rounded-lg border border-amber-200 shadow-xs">
              {order.deliveryOtp}
            </span>
          </div>

          {/* Timeline Milestones */}
          <div>
            <div className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-4">
              Order Fulfillment Lifecycle
            </div>

            <div className="space-y-4">
              {ORDER_STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.status} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          isCompleted
                            ? 'bg-[#126B45] text-white shadow-xs'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                      </div>
                      {idx < ORDER_STEPS.length - 1 && (
                        <div
                          className={`w-0.5 h-6 mt-1 ${
                            idx < currentStepIndex ? 'bg-[#126B45]' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>

                    <div className="flex-1 pb-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-semibold text-xs sm:text-sm ${
                            isCurrent
                              ? 'text-[#126B45] font-bold'
                              : isCompleted
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-emerald-100 text-[#126B45] font-bold px-2 py-0.5 rounded-full animate-pulse">
                            In Progress
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Itemized Order Details */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <div className="font-bold text-xs uppercase tracking-wider text-gray-700 flex justify-between">
              <span>Ordered Items</span>
              <span className="text-gray-500 font-normal">Weight: {order.totalWeightKg.toFixed(1)} kg</span>
            </div>

            <div className="divide-y divide-gray-200 text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900">{item.productName}</span>
                    {item.variantName && (
                      <span className="text-emerald-700 ml-1 font-semibold">({item.variantName})</span>
                    )}
                    <span className="text-gray-500 ml-2">
                      × {item.quantity} {item.unit}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900">Rs. {item.totalPrice.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-200 space-y-1 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>Rs. {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee:</span>
                <span className={order.isFreeDelivery ? 'text-[#126B45] font-bold' : ''}>
                  {order.isFreeDelivery ? 'FREE (>10 kg Rule)' : `Rs. ${order.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-200 text-sm">
                <span>Total Paid / Payable:</span>
                <span className="text-[#126B45]">Rs. {order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Quick status advance button for demonstration/testing */}
          {currentStepIndex < ORDER_STEPS.length - 1 && (
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
              <span className="text-emerald-900">
                Current Status: <strong>{ORDER_STEPS[currentStepIndex].label}</strong>
              </span>
              <button
                type="button"
                onClick={handleAdvanceStep}
                className="px-3 py-1.5 bg-[#126B45] hover:bg-[#0e5235] text-white font-semibold rounded-lg flex items-center gap-1 transition"
              >
                Advance Next Step <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
