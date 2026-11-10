import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { CustomerView } from './components/CustomerView';
import { SellerDashboard } from './components/SellerDashboard';
import { RiderDashboard } from './components/RiderDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { LocationModal } from './components/LocationModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { CustomerOrdersModal } from './components/CustomerOrdersModal';
import { AcceptanceTestModal } from './components/AcceptanceTestModal';
import { MyAccountModal } from './components/MyAccountModal';
import { ShopPublicProfileModal } from './components/ShopPublicProfileModal';
import { Product, Shop } from './types';
import { ShieldCheck, Heart, Phone, Sparkles } from 'lucide-react';

function MainApp() {
  const { activeRole } = useApp();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [previewShop, setPreviewShop] = useState<Shop | null>(null);

  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [checkoutShopId, setCheckoutShopId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenCheckout = (shopId: string) => {
    setIsCartOpen(false);
    setCheckoutShopId(shopId);
  };

  const handleOrderSuccess = (orderId: string) => {
    setCheckoutShopId(null);
    setTrackingOrderId(orderId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5EF] text-[#202C27]">
      {/* Header with Bilingual Brand & Role Switcher */}
      <Header
        onOpenLocation={() => setIsLocationModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTests={() => setIsTestModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenOrders={() => setIsOrdersModalOpen(true)}
        onOpenAccount={() => setIsAccountModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeRole === 'customer' && (
          <CustomerView
            onOpenProductDetails={(product) => setSelectedProductDetails(product)}
            onOpenShopProfile={(shop) => setPreviewShop(shop)}
            searchQuery={searchQuery}
          />
        )}

        {activeRole === 'seller' && (
          <SellerDashboard
            onOpenShopPreview={(shop) => setPreviewShop(shop)}
            onOpenAccount={() => setIsAccountModalOpen(true)}
          />
        )}

        {activeRole === 'rider' && <RiderDashboard />}

        {activeRole === 'admin' && <AdminDashboard />}
      </main>

      {/* Modals & Drawers */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenCheckout={handleOpenCheckout}
      />

      <CheckoutModal
        shopId={checkoutShopId}
        onClose={() => setCheckoutShopId(null)}
        onOrderSuccess={handleOrderSuccess}
      />

      <ProductDetailModal
        product={selectedProductDetails}
        onClose={() => setSelectedProductDetails(null)}
      />

      <OrderTrackingModal
        orderId={trackingOrderId}
        onClose={() => setTrackingOrderId(null)}
      />

      <CustomerOrdersModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        onTrackOrder={(orderId) => setTrackingOrderId(orderId)}
      />

      <AcceptanceTestModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />

      {/* Seller Shop Profile & Account Management Modal (PRD Section 4 & 5) */}
      <MyAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onOpenShopPreview={(shop) => setPreviewShop(shop)}
      />

      {/* Public Shop Profile & About/Offers View (PRD Section 6 & 7) */}
      <ShopPublicProfileModal
        shop={previewShop}
        onClose={() => setPreviewShop(null)}
        onOpenProductDetails={(product) => setSelectedProductDetails(product)}
      />

      {/* Pakistani Market Footer */}
      <footer className="bg-[#202C27] text-white py-10 border-t border-emerald-950 mt-auto">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-800 pb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#126B45] text-[#F2B84B] flex items-center justify-center font-black text-lg">
                G
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Ghar<span className="text-[#F2B84B]">365</span>
              </span>
              <span className="text-xs text-gray-400 ml-2">Daily Needs. Delivered with Trust.</span>
            </div>

            <p className="font-urdu text-base text-[#F2B84B] font-semibold text-center md:text-right">
              گھر کی ہر ضرورت، اب صرف ایک ایپ پر!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-gray-400">
            <div>
              <h5 className="font-bold text-white mb-2 uppercase tracking-wider text-[11px]">
                Platform Rules & Guarantees
              </h5>
              <ul className="space-y-1">
                <li>• Free Delivery applies when order weight strictly &gt; 10 kg</li>
                <li>• Independent seller pricing & fresh local stock</li>
                <li>• Verified local shops in Mithi, Tharparkar & beyond</li>
                <li>• Cash on Delivery (COD) & Verified Digital Wallets</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white mb-2 uppercase tracking-wider text-[11px]">
                Support & Contact
              </h5>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-gray-300">
                  <Phone className="w-3.5 h-3.5 text-[#F2B84B]" /> Helpline: +92 345 1234567
                </div>
                <div>Operational Hours: 8:00 AM - 10:00 PM Daily</div>
                <div>Headquarters: Shahi Bazaar, Mithi, Tharparkar, Sindh</div>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-white mb-2 uppercase tracking-wider text-[11px]">
                Acceptance Testing
              </h5>
              <p className="text-gray-400 mb-2">
                Run our automated test harness to verify all 7 Section 27 acceptance criteria anytime:
              </p>
              <button
                type="button"
                onClick={() => setIsTestModalOpen(true)}
                className="px-3 py-1.5 bg-[#126B45] hover:bg-[#0e5235] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F2B84B]" /> Open Section 27 Test Harness
              </button>
            </div>
          </div>

          <div className="text-center text-[11px] text-gray-500 pt-4 border-t border-gray-800">
            © 2026 Ghar365 Pakistan. All Rights Reserved. Built for Pakistani hyper-local retail commerce.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
