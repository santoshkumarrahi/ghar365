import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Truck, Scale, AlertCircle, CreditCard, Banknote, Smartphone, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';

interface CheckoutModalProps {
  shopId: string | null;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ shopId, onClose, onOrderSuccess }) => {
  const {
    cart,
    shops,
    currentUser,
    selectedCity,
    selectedArea,
    getCartDeliveryFee,
    getCartWeight,
    settings,
    placeOrder,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [transactionRef, setTransactionRef] = useState('');
  const [evidenceNote, setEvidenceNote] = useState('');
  const [customerName, setCustomerName] = useState(currentUser.fullName);
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone);
  const [customerAddress, setCustomerAddress] = useState(currentUser.address);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!shopId) return null;

  const shop = shops.find((s) => s.id === shopId);
  if (!shop) return null;

  const shopItems = cart.filter((i) => i.shopId === shopId);
  const subtotal = shopItems.reduce((acc, i) => acc + i.totalPrice, 0);
  const deliveryCalc = getCartDeliveryFee(shopId);
  const deliveryFee = deliveryCalc.fee;
  const totalWeight = getCartWeight(shopId);
  const totalAmount = subtotal + deliveryFee;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (paymentMethod !== 'cod' && !transactionRef.trim()) {
      setErrorMsg('Please enter your Easypaisa / JazzCash Transaction ID (TID / Reference) for verification.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await placeOrder(shopId, paymentMethod, transactionRef, evidenceNote);
      if (res.success && res.orderId) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#126B45', '#F2B84B', '#ffffff'],
        });
        onOrderSuccess(res.orderId);
      } else {
        setErrorMsg(res.error || 'Failed to place order.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred during checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#126B45] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#F2B84B]" />
            <div>
              <h3 className="font-bold text-base sm:text-lg">Secure Checkout • {shop.shopName}</h3>
              <p className="text-xs text-emerald-100">Local Delivery to {selectedArea}, {selectedCity}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-emerald-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleCheckoutSubmit} className="p-6 overflow-y-auto space-y-5 text-sm">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Delivery Address Details */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <div className="font-bold text-xs uppercase tracking-wider text-gray-700 flex items-center justify-between">
              <span>1. Delivery Contact & Address</span>
              <span className="text-emerald-700 font-semibold">{selectedCity} Verified Area</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#126B45]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Pakistani Mobile (+92)</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#126B45]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Street Address / House No. ({selectedArea}, {selectedCity})
              </label>
              <input
                type="text"
                required
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#126B45]"
              />
            </div>
          </div>

          {/* Order Weight & Free Delivery Summary */}
          <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-[#126B45]" /> Order Weight & Delivery Rule
              </span>
              <span className="font-bold text-[#126B45]">
                {totalWeight.toFixed(1)} kg eligible weight
              </span>
            </div>

            <div className="text-gray-700">
              {deliveryCalc.isFree ? (
                <div className="text-emerald-800 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Free Delivery applied! (Total eligible weight strictly &gt; {settings.freeDeliveryThresholdKg} kg)
                </div>
              ) : (
                <div className="text-gray-600">
                  Standard local delivery charge: <strong>Rs. {deliveryFee}</strong>.
                  <span className="text-emerald-800 block mt-0.5">
                    (Free delivery unlocks when order weight exceeds {settings.freeDeliveryThresholdKg} kg.)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <label className="font-bold text-xs uppercase tracking-wider text-gray-700 block">
              2. Select Payment Method
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* COD */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  paymentMethod === 'cod'
                    ? 'border-[#126B45] bg-emerald-50/50 ring-2 ring-[#126B45]/20 font-semibold'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs text-gray-900 font-bold mb-1">
                  <Banknote className="w-4 h-4 text-emerald-700" /> Cash on Delivery
                </div>
                <span className="text-[11px] text-gray-500">Pay cash directly to rider on arrival</span>
              </button>

              {/* Easypaisa */}
              <button
                type="button"
                onClick={() => setPaymentMethod('easypaisa')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  paymentMethod === 'easypaisa'
                    ? 'border-[#126B45] bg-emerald-50/50 ring-2 ring-[#126B45]/20 font-semibold'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs text-gray-900 font-bold mb-1">
                  <Smartphone className="w-4 h-4 text-green-600" /> Easypaisa
                </div>
                <span className="text-[11px] text-gray-500">Instant digital wallet transfer</span>
              </button>

              {/* JazzCash */}
              <button
                type="button"
                onClick={() => setPaymentMethod('jazzcash')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  paymentMethod === 'jazzcash'
                    ? 'border-[#126B45] bg-emerald-50/50 ring-2 ring-[#126B45]/20 font-semibold'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs text-gray-900 font-bold mb-1">
                  <CreditCard className="w-4 h-4 text-red-600" /> JazzCash
                </div>
                <span className="text-[11px] text-gray-500">Mobile account or agent deposit</span>
              </button>
            </div>

            {/* Manual Digital Payment Instructions per PRD Section 15 */}
            {paymentMethod !== 'cod' && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="font-bold text-amber-900 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  Official {paymentMethod === 'easypaisa' ? 'Easypaisa' : 'JazzCash'} Account Details:
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-amber-100 space-y-1 font-mono text-xs">
                  <div>
                    Account Title:{' '}
                    <strong>
                      {paymentMethod === 'easypaisa'
                        ? settings.easypaisaAccountTitle
                        : settings.jazzcashAccountTitle}
                    </strong>
                  </div>
                  <div>
                    Account Number:{' '}
                    <strong className="text-emerald-800 text-sm">
                      {paymentMethod === 'easypaisa'
                        ? settings.easypaisaAccountNumber
                        : settings.jazzcashAccountNumber}
                    </strong>
                  </div>
                  <div>Amount to Transfer: <strong className="text-gray-900">Rs. {totalAmount.toLocaleString()}</strong></div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">
                    Enter Transaction Reference / TID (Required):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 8421093412 or TRX-99238"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#126B45]"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    * Per PRD Section 15, your transaction is verified by our Finance Officer before dispatch. We never ask for payment PINs or OTPs.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Items Total ({shopItems.length} products):</span>
              <span className="font-medium text-gray-900">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee ({totalWeight.toFixed(1)} kg):</span>
              <span className={`font-semibold ${deliveryCalc.isFree ? 'text-emerald-700' : 'text-gray-900'}`}>
                {deliveryCalc.isFree ? 'FREE (Over 10 kg)' : `Rs. ${deliveryFee}`}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-gray-900">
              <span>Total Payable Amount:</span>
              <span className="text-base text-[#126B45]">Rs. {totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-[#126B45] hover:bg-[#0e5235] text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {isSubmitting ? (
              'Placing Order & Validating Stock...'
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-[#F2B84B]" />
                Confirm & Place Order (Rs. {totalAmount.toLocaleString()})
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
