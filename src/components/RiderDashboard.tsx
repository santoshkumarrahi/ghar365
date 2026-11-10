import React, { useState } from 'react';
import {
  Bike,
  CheckCircle2,
  MapPin,
  Phone,
  KeyRound,
  DollarSign,
  Package,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

export const RiderDashboard: React.FC = () => {
  const { riders, orders, updateOrderStatus, selectedCity } = useApp();

  // Find active rider (Farhan in Mithi)
  const rider = riders[0];
  const [isOnline, setIsOnline] = useState(rider?.isOnline ?? true);
  const [otpInput, setOtpInput] = useState<{ [orderId: string]: string }>({});
  const [otpError, setOtpError] = useState<{ [orderId: string]: string }>({});

  // Orders available for delivery in rider's operational city
  const cityOrders = orders.filter(
    (o) => o.customerCity.toLowerCase() === (rider?.operationalCity || 'Mithi').toLowerCase()
  );

  const activeDeliveries = cityOrders.filter(
    (o) =>
      o.orderStatus === 'ready_for_pickup' ||
      o.orderStatus === 'rider_assigned' ||
      o.orderStatus === 'picked_up' ||
      o.orderStatus === 'out_for_delivery'
  );

  const completedDeliveries = cityOrders.filter((o) => o.orderStatus === 'delivered');

  const totalCodCollected = completedDeliveries
    .filter((o) => o.paymentMethod === 'cod')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const handlePickupFromShop = async (orderId: string) => {
    await updateOrderStatus(orderId, 'picked_up', 'Rider collected package from shopkeeper');
  };

  const handleStartDelivery = async (orderId: string) => {
    await updateOrderStatus(orderId, 'out_for_delivery', 'Rider out for delivery to customer address');
  };

  const handleConfirmDeliveryWithOtp = async (order: Order) => {
    const input = otpInput[order.id] || '';
    if (input.trim() !== order.deliveryOtp) {
      setOtpError({
        ...otpError,
        [order.id]: `Invalid OTP. The customer's 6-digit handover code is required. (Hint for demo: ${order.deliveryOtp})`,
      });
      return;
    }

    setOtpError({ ...otpError, [order.id]: '' });
    await updateOrderStatus(order.id, 'delivered', 'Package delivered and OTP verified successfully');
    alert(`Order ${order.orderNumber} successfully marked DELIVERED! OTP verified.`);
  };

  return (
    <div className="space-y-6 pb-12 text-xs">
      {/* Rider Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#126B45] text-white flex items-center justify-center font-bold shadow-xs">
            <Bike className="w-8 h-8 text-[#F2B84B]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">{rider?.fullName || 'Farhan Ali'}</h2>
              <span className="bg-emerald-100 text-[#126B45] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Approved Delivery Partner
              </span>
            </div>
            <p className="text-gray-500 mt-1">
              Vehicle: {rider?.vehicleType} ({rider?.vehiclePlate}) • Operational Zone: <strong>{rider?.operationalCity}</strong>
            </p>
          </div>
        </div>

        {/* Online Toggle & Earnings */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
            <span className="font-semibold text-gray-700">Status:</span>
            <button
              type="button"
              onClick={() => setIsOnline(!isOnline)}
              className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                isOnline
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-300 text-gray-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-gray-500'}`} />
              {isOnline ? 'Online (Accepting)' : 'Offline'}
            </button>
          </div>

          <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 text-center">
            <div className="text-emerald-800 font-medium">COD in Hand</div>
            <div className="text-sm font-bold text-[#126B45]">Rs. {totalCodCollected.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Active Delivery Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
            <Package className="w-4 h-4 text-[#126B45]" />
            Active Delivery Assignments ({activeDeliveries.length})
          </h3>
          <span className="text-gray-500">Service Area: {rider?.operationalCity}</span>
        </div>

        {activeDeliveries.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 text-gray-500">
            No active deliveries right now. New neighborhood orders will appear as soon as shops finish packing.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeDeliveries.map((order) => {
              const error = otpError[order.id];

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <div>
                        <span className="font-bold text-sm text-gray-900">{order.orderNumber}</span>
                        <div className="text-gray-500">
                          Weight: <strong>{order.totalWeightKg.toFixed(1)} kg</strong>
                        </div>
                      </div>
                      <span className="bg-emerald-100 text-[#126B45] font-bold px-2 py-0.5 rounded-full capitalize">
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Step 1: Pickup from Shop */}
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
                      <div className="font-bold text-gray-800 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" /> Pickup Location (Shop):
                      </div>
                      <div className="font-semibold text-[#126B45]">{order.shopName}</div>
                      <div className="text-gray-500">Local Shop in {order.shopCity}</div>
                    </div>

                    {/* Step 2: Dropoff to Customer */}
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
                      <div className="font-bold text-gray-800 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Delivery Destination (Customer):
                      </div>
                      <div className="font-semibold text-gray-900">{order.customerName} ({order.customerPhone})</div>
                      <div className="text-gray-600">{order.customerAddress}, {order.customerArea}, {order.customerCity}</div>
                    </div>

                    {/* Payment Info */}
                    <div className="flex justify-between items-center bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                      <span className="text-amber-900 font-semibold">Payment to Collect:</span>
                      <span className="font-bold text-sm text-gray-900">
                        {order.paymentMethod === 'cod' ? (
                          <span className="text-red-700">Rs. {order.totalAmount} (COD Cash)</span>
                        ) : (
                          <span className="text-emerald-700">Rs. 0 (Paid Online via {order.paymentMethod.toUpperCase()})</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Rider Action Buttons */}
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    {order.orderStatus === 'ready_for_pickup' && (
                      <button
                        type="button"
                        onClick={() => handlePickupFromShop(order.id)}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                      >
                        Confirm Pickup from Shop <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                    {order.orderStatus === 'picked_up' && (
                      <button
                        type="button"
                        onClick={() => handleStartDelivery(order.id)}
                        className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                      >
                        Start Delivery Route <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                    {order.orderStatus === 'out_for_delivery' && (
                      <div className="space-y-2 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
                        <div className="font-bold text-emerald-950 flex items-center gap-1">
                          <KeyRound className="w-4 h-4 text-[#126B45]" />
                          Customer OTP Verification
                        </div>
                        <p className="text-[11px] text-gray-600">
                          Ask customer for their 6-digit delivery OTP shown in their Ghar365 app:
                        </p>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="Enter 6-digit OTP"
                            value={otpInput[order.id] || ''}
                            onChange={(e) => setOtpInput({ ...otpInput, [order.id]: e.target.value })}
                            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg font-mono text-center font-bold tracking-widest text-sm bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleConfirmDeliveryWithOtp(order)}
                            className="px-4 py-1.5 bg-[#126B45] hover:bg-[#0e5235] text-white font-bold rounded-lg transition"
                          >
                            Verify & Handover
                          </button>
                        </div>

                        {error && <p className="text-[11px] text-red-600 font-semibold">{error}</p>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Deliveries History */}
      <div className="space-y-3 pt-4">
        <h3 className="font-bold text-gray-900 text-sm sm:text-base">
          Completed Deliveries ({completedDeliveries.length})
        </h3>
        {completedDeliveries.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs divide-y divide-gray-100">
            {completedDeliveries.map((o) => (
              <div key={o.id} className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900">{o.orderNumber} • Delivered</div>
                  <div className="text-gray-500">
                    To: {o.customerName} ({o.customerArea}) • Handled OTP {o.deliveryOtp}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#126B45]">Rs. {o.totalAmount}</span>
                  <div className="text-[10px] text-gray-500">{o.paymentMethod.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
