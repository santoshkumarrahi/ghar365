import React, { useState } from 'react';
import {
  Shield,
  Store,
  CreditCard,
  Settings,
  Scale,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  FileText,
  AlertTriangle,
  Building,
  Flame,
  Pill,
  Droplet,
  Save,
  Check,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  Image as ImageIcon,
  Power,
  Mail,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppSettings, Shop } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    shops,
    orders,
    paymentVerifications,
    processPaymentVerification,
    updateShopApproval,
    settings,
    updateSettings,
    saveShop,
    deleteShop,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'sellers' | 'payments' | 'rules_config' | 'compliance' | 'orders'
  >('overview');

  // Local state for system settings editing
  const [thresholdInput, setThresholdInput] = useState<number>(settings.freeDeliveryThresholdKg);
  const [deliveryFeeInput, setDeliveryFeeInput] = useState<number>(settings.defaultDeliveryFee);
  const [intercityInput, setIntercityInput] = useState<boolean>(settings.intercityEnabled);
  const [easypaisaTitle, setEasypaisaTitle] = useState(settings.easypaisaAccountTitle);
  const [easypaisaNumber, setEasypaisaNumber] = useState(settings.easypaisaAccountNumber);
  const [jazzcashTitle, setJazzcashTitle] = useState(settings.jazzcashAccountTitle);
  const [jazzcashNumber, setJazzcashNumber] = useState(settings.jazzcashAccountNumber);
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  // Rejection note modal state
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Seller management filters & modals
  const [sellerSearch, setSellerSearch] = useState('');
  const [sellerCategoryFilter, setSellerCategoryFilter] = useState('all');
  const [sellerStatusFilter, setSellerStatusFilter] = useState<'all' | 'verified' | 'pending' | 'suspended'>('all');
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [deletingShop, setDeletingShop] = useState<Shop | null>(null);
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  // Metrics
  const grossMerchandiseValue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const pendingPayments = paymentVerifications.filter((p) => p.status === 'pending');
  const verifiedSellersCount = shops.filter((s) => s.verificationStatus === 'verified').length;
  const pendingSellersCount = shops.filter((s) => s.verificationStatus === 'pending' || s.verificationStatus === 'under_review').length;

  const handleSaveSystemSettings = async () => {
    const updated: AppSettings = {
      ...settings,
      freeDeliveryThresholdKg: Number(thresholdInput),
      defaultDeliveryFee: Number(deliveryFeeInput),
      intercityEnabled: intercityInput,
      easypaisaAccountTitle: easypaisaTitle,
      easypaisaAccountNumber: easypaisaNumber,
      jazzcashAccountTitle: jazzcashTitle,
      jazzcashAccountNumber: jazzcashNumber,
      updatedAt: new Date().toISOString(),
    };
    await updateSettings(updated);
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 2000);
  };

  const handleApprovePayment = async (verificationId: string) => {
    await processPaymentVerification(verificationId, true);
  };

  const handleRejectPayment = async () => {
    if (!rejectingId) return;
    await processPaymentVerification(rejectingId, false, rejectionReason || 'Invalid transaction reference');
    setRejectingId(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6 pb-12 text-xs">
      {/* Admin Panel Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#126B45] text-[#F2B84B] flex items-center justify-center font-bold shadow-xs">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Ghar365 Super Administration</h2>
              <span className="bg-[#F2B84B] text-[#202C27] font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
                Root Access
              </span>
            </div>
            <p className="text-gray-500 mt-1">
              National Pakistani Multi-Vendor Governance • Central Rule Engine & Financial Clearance
            </p>
          </div>
        </div>

        {/* Global Key Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-center min-w-28">
            <div className="text-[10px] text-emerald-800 uppercase font-semibold">Total GMV</div>
            <div className="text-sm font-black text-[#126B45]">Rs. {grossMerchandiseValue.toLocaleString()}</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-center min-w-28">
            <div className="text-[10px] text-amber-800 uppercase font-semibold">Pending Payments</div>
            <div className="text-sm font-black text-amber-700">{pendingPayments.length}</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-center min-w-28">
            <div className="text-[10px] text-gray-600 uppercase font-semibold">Active Sellers</div>
            <div className="text-sm font-black text-gray-900">{verifiedSellersCount}</div>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-[#126B45] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Operations Overview
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 relative ${
            activeTab === 'payments'
              ? 'bg-[#126B45] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <CreditCard className="w-4 h-4" /> Payment Verification
          {pendingPayments.length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {pendingPayments.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sellers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'sellers'
              ? 'bg-[#126B45] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Store className="w-4 h-4" /> Sellers & Shops ({shops.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rules_config')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'rules_config'
              ? 'bg-[#126B45] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Scale className="w-4 h-4" /> Delivery & Weight Rules
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('compliance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'compliance'
              ? 'bg-[#126B45] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Building className="w-4 h-4" /> Specialized Compliance (LPG / Pharmacy / Water)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-[#126B45] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <FileText className="w-4 h-4" /> All Platform Orders ({orders.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
              <div className="text-gray-500 font-semibold">Total Orders Processed</div>
              <div className="text-2xl font-black text-gray-900">{orders.length}</div>
              <div className="text-[11px] text-emerald-700 font-medium">Live multi-vendor volume</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
              <div className="text-gray-500 font-semibold">Registered Sellers</div>
              <div className="text-2xl font-black text-[#126B45]">{shops.length}</div>
              <div className="text-[11px] text-gray-500">Mithi & Karachi hubs active</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
              <div className="text-gray-500 font-semibold">Free Delivery Rule</div>
              <div className="text-2xl font-black text-[#126B45]">&gt; {settings.freeDeliveryThresholdKg} kg</div>
              <div className="text-[11px] text-emerald-800 font-medium">Strict boundary enforced</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
              <div className="text-gray-500 font-semibold">Intercity Delivery</div>
              <div className={`text-xl font-black ${settings.intercityEnabled ? 'text-emerald-700' : 'text-amber-700'}`}>
                {settings.intercityEnabled ? 'Active (All Pakistan)' : 'Disabled (Local Hubs Only)'}
              </div>
              <div className="text-[11px] text-gray-500">PRD Section 11 Compliance</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FINANCE & PAYMENT VERIFICATION (PRD Section 15) */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                Finance Officer Manual Payment Verification Queue (Section 15)
              </h3>
              <p className="text-gray-500">
                Audit Easypaisa & JazzCash transfer references against recipient records before approving order release.
              </p>
            </div>
          </div>

          {paymentVerifications.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 text-gray-500">
              No digital payment transfers currently in queue. Orders placed via Easypaisa / JazzCash will appear here.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Order #</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Transaction Reference (TID)</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paymentVerifications.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-900">{p.orderNumber}</td>
                      <td className="p-3">
                        <div className="font-medium text-gray-900">{p.customerName}</div>
                        <div className="text-[10px] text-gray-500">{p.customerPhone}</div>
                      </td>
                      <td className="p-3 uppercase font-bold text-gray-800">{p.paymentMethod}</td>
                      <td className="p-3 font-mono font-bold text-blue-700 bg-blue-50/50 rounded p-1">
                        {p.transactionReference}
                      </td>
                      <td className="p-3 font-bold text-[#126B45]">Rs. {p.amount.toLocaleString()}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            p.status === 'approved'
                              ? 'bg-emerald-100 text-[#126B45]'
                              : p.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-800 animate-pulse'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {p.status === 'pending' ? (
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleApprovePayment(p.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold transition flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => setRejectingId(p.id)}
                              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold transition flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-400">
                            Verified by {p.verifiedBy || 'Finance Officer'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Rejection Modal */}
          {rejectingId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
                <h4 className="font-bold text-sm text-gray-900">Reject Payment Verification</h4>
                <p className="text-gray-600 text-xs">
                  State the rejection reason (e.g. invalid TID, amount mismatch, duplicate reference):
                </p>
                <input
                  type="text"
                  placeholder="Enter reason..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRejectingId(null)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectPayment}
                    className="px-4 py-1.5 bg-red-600 text-white font-bold rounded-lg"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SELLERS & SHOPS MANAGEMENT (PRD Section 8) */}
      {activeTab === 'sellers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                <Store className="w-5 h-5 text-[#126B45]" />
                Registered Shops & Seller Management (PRD Section 8)
              </h3>
              <p className="text-gray-500 text-[11px]">
                Approve, reject, edit profiles, update images, manage operational areas, or remove unauthorized shops.
              </p>
            </div>
            {adminNotice && (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-200 animate-in fade-in">
                {adminNotice}
              </span>
            )}
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap gap-3 items-center justify-between">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={sellerSearch}
                onChange={(e) => setSellerSearch(e.target.value)}
                placeholder="Search by shop name, owner, city, phone..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#126B45]"
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Filter className="w-3.5 h-3.5" />
                <span className="font-semibold">Category:</span>
              </div>
              <select
                value={sellerCategoryFilter}
                onChange={(e) => setSellerCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-gray-200 rounded-xl text-xs bg-gray-50 font-medium"
              >
                <option value="all">All Categories</option>
                {Array.from(new Set(shops.map((s) => s.category).filter(Boolean))).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={sellerStatusFilter}
                onChange={(e) => setSellerStatusFilter(e.target.value as any)}
                className="px-2.5 py-1.5 border border-gray-200 rounded-xl text-xs bg-gray-50 font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="verified">Verified Only</option>
                <option value="pending">Pending Approval</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Shops Grid */}
          {(() => {
            const filteredShops = shops.filter((s) => {
              const matchesSearch =
                !sellerSearch ||
                s.shopName.toLowerCase().includes(sellerSearch.toLowerCase()) ||
                s.ownerName.toLowerCase().includes(sellerSearch.toLowerCase()) ||
                s.city.toLowerCase().includes(sellerSearch.toLowerCase()) ||
                s.phone.toLowerCase().includes(sellerSearch.toLowerCase()) ||
                (s.category && s.category.toLowerCase().includes(sellerSearch.toLowerCase()));

              const matchesCategory =
                sellerCategoryFilter === 'all' || s.category === sellerCategoryFilter;

              const matchesStatus =
                sellerStatusFilter === 'all' ||
                (sellerStatusFilter === 'verified' && s.verificationStatus === 'verified') ||
                (sellerStatusFilter === 'pending' &&
                  (s.verificationStatus === 'pending' || s.verificationStatus === 'under_review')) ||
                (sellerStatusFilter === 'suspended' &&
                  (s.verificationStatus === 'suspended' || s.verificationStatus === 'rejected'));

              return matchesSearch && matchesCategory && matchesStatus;
            });

            if (filteredShops.length === 0) {
              return (
                <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 text-gray-500">
                  No shops match the current search or filter criteria.
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredShops.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Top Header with Logos and Verification Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={s.logoUrl || s.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80'}
                            alt={s.shopName}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-xs bg-emerald-50 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-bold text-sm text-gray-900">{s.shopName}</h4>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  s.isOpen
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {s.isOpen ? 'Open Now' : 'Closed'}
                              </span>
                            </div>
                            <p className="text-gray-500 text-[11px]">
                              Proprietor: <span className="font-semibold text-gray-800">{s.ownerName}</span>
                            </p>
                            <span className="inline-block mt-0.5 text-[10px] font-medium bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.2 rounded-md">
                              {s.category || 'General Store'}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                            s.verificationStatus === 'verified'
                              ? 'bg-emerald-100 text-[#126B45]'
                              : s.verificationStatus === 'pending' || s.verificationStatus === 'under_review'
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {s.verificationStatus}
                        </span>
                      </div>

                      {/* Cover image strip preview if available */}
                      {s.coverImageUrl && (
                        <div className="h-16 w-full rounded-xl overflow-hidden border border-gray-200">
                          <img
                            src={s.coverImageUrl}
                            alt={`${s.shopName} cover`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Contact & Location Details */}
                      <div className="bg-gray-50 p-2.5 rounded-xl space-y-1.5 text-gray-700 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>
                            <strong>Address:</strong> {s.address || s.area}, {s.area}, {s.city}, {s.province}
                          </span>
                        </div>
                        {s.locationCoordinates && (
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono">
                            <Compass className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>GPS: {s.locationCoordinates}</span>
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <strong>Phone:</strong> {s.phone}
                          </span>
                          {s.whatsappNumber && (
                            <span className="flex items-center gap-1">
                              <strong>WA:</strong> {s.whatsappNumber}
                            </span>
                          )}
                          {s.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-blue-600" />
                              {s.email}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>
                            <strong>Hours:</strong> {s.openingHours || '08:00 AM'} - {s.closingHours || '10:00 PM'} • Delivery: {s.deliveryAvailability !== false ? 'Available' : 'Pickup Only'}
                          </span>
                        </div>
                        <div>
                          <strong>Service Range:</strong> {s.deliveryAreas?.join(', ') || 'Hub Area Wide'} (Fee: Rs. {s.deliveryFee || 50})
                        </div>
                        {s.aboutDescription && (
                          <p className="text-[10px] text-gray-500 italic line-clamp-1 border-t border-gray-200/60 pt-1">
                            "{s.aboutDescription}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Admin Action Buttons */}
                    <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => setEditingShop(s)}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-bold text-[11px] transition flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" /> Edit Shop
                        </button>

                        {/* Open/Close Quick Toggle */}
                        <button
                          type="button"
                          onClick={async () => {
                            const updated = { ...s, isOpen: !s.isOpen };
                            await saveShop(updated);
                            setAdminNotice(`${s.shopName} marked as ${updated.isOpen ? 'OPEN' : 'CLOSED'}`);
                            setTimeout(() => setAdminNotice(null), 3000);
                          }}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition flex items-center gap-1 ${
                            s.isOpen
                              ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          }`}
                        >
                          <Power className="w-3 h-3" /> {s.isOpen ? 'Set Closed' : 'Set Open'}
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Approval / Suspension Controls */}
                        {s.verificationStatus !== 'verified' ? (
                          <button
                            type="button"
                            onClick={() => updateShopApproval(s.id, 'verified')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Approve
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => updateShopApproval(s.id, 'suspended')}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] transition flex items-center gap-1"
                          >
                            Suspend
                          </button>
                        )}

                        {/* Remove / Delete Unauthorized Shop */}
                        <button
                          type="button"
                          onClick={() => setDeletingShop(s)}
                          className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-bold text-[11px] transition flex items-center gap-1"
                          title="Remove Unauthorized Shop"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* ADMIN EDIT SHOP MODAL (PRD Section 8) */}
          {editingShop && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl border border-gray-100">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div>
                    <h4 className="font-bold text-base text-gray-900 flex items-center gap-2">
                      <Edit className="w-5 h-5 text-[#126B45]" />
                      Edit Shop Information (Admin Control)
                    </h4>
                    <p className="text-gray-500 text-xs">
                      Update shop profile, contact info, images, categories, or location parameters.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingShop(null)}
                    className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-gray-800 block mb-1">Shop Name *</label>
                    <input
                      type="text"
                      value={editingShop.shopName}
                      onChange={(e) => setEditingShop({ ...editingShop, shopName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-800 block mb-1">Shop Category *</label>
                    <input
                      type="text"
                      value={editingShop.category || ''}
                      onChange={(e) => setEditingShop({ ...editingShop, category: e.target.value })}
                      placeholder="e.g. Grocery, Fresh Produce, Pharmacy"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-medium text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-800 block mb-1">Owner / Proprietor Name *</label>
                    <input
                      type="text"
                      value={editingShop.ownerName}
                      onChange={(e) => setEditingShop({ ...editingShop, ownerName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-800 block mb-1">Owner CNIC</label>
                    <input
                      type="text"
                      value={editingShop.cnic || ''}
                      onChange={(e) => setEditingShop({ ...editingShop, cnic: e.target.value })}
                      placeholder="44301-XXXXXXX-X"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-800 block mb-1">Phone Number *</label>
                    <input
                      type="text"
                      value={editingShop.phone}
                      onChange={(e) => setEditingShop({ ...editingShop, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-800 block mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={editingShop.whatsappNumber || ''}
                      onChange={(e) => setEditingShop({ ...editingShop, whatsappNumber: e.target.value })}
                      placeholder="+92 3XX XXXXXXX"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-800 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={editingShop.email || ''}
                      onChange={(e) => setEditingShop({ ...editingShop, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-800 block mb-1">City *</label>
                    <input
                      type="text"
                      value={editingShop.city}
                      onChange={(e) => setEditingShop({ ...editingShop, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-medium text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-800 block mb-1">Area / Town *</label>
                    <input
                      type="text"
                      value={editingShop.area}
                      onChange={(e) => setEditingShop({ ...editingShop, area: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-800 block mb-1">GPS / Location Coordinates</label>
                    <input
                      type="text"
                      value={editingShop.locationCoordinates || ''}
                      onChange={(e) => setEditingShop({ ...editingShop, locationCoordinates: e.target.value })}
                      placeholder="e.g. 24.7431° N, 69.8000° E"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-gray-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-gray-800 block mb-1">Complete Physical Address</label>
                    <input
                      type="text"
                      value={editingShop.address || ''}
                      onChange={(e) => setEditingShop({ ...editingShop, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-800 block mb-1">Opening Hours</label>
                    <input
                      type="text"
                      value={editingShop.openingHours || '08:00 AM'}
                      onChange={(e) => setEditingShop({ ...editingShop, openingHours: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-800 block mb-1">Closing Hours</label>
                    <input
                      type="text"
                      value={editingShop.closingHours || '10:00 PM'}
                      onChange={(e) => setEditingShop({ ...editingShop, closingHours: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-800 block mb-1">Verification Status</label>
                    <select
                      value={editingShop.verificationStatus}
                      onChange={(e) =>
                        setEditingShop({
                          ...editingShop,
                          verificationStatus: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold"
                    >
                      <option value="verified">Verified (Approved)</option>
                      <option value="pending">Pending</option>
                      <option value="under_review">Under Review</option>
                      <option value="suspended">Suspended</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-800 block mb-1">Delivery Availability</label>
                    <select
                      value={editingShop.deliveryAvailability !== false ? 'yes' : 'no'}
                      onChange={(e) =>
                        setEditingShop({
                          ...editingShop,
                          deliveryAvailability: e.target.value === 'yes',
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold"
                    >
                      <option value="yes">Delivery Available</option>
                      <option value="no">Pickup Only (Delivery Unavailable)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-gray-800 block mb-1">Shop Logo Image URL</label>
                    <input
                      type="text"
                      value={editingShop.logoUrl || editingShop.imageUrl || ''}
                      onChange={(e) =>
                        setEditingShop({
                          ...editingShop,
                          logoUrl: e.target.value,
                          imageUrl: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-gray-800 block mb-1">Shop Cover Image URL</label>
                    <input
                      type="text"
                      value={editingShop.coverImageUrl || ''}
                      onChange={(e) =>
                        setEditingShop({
                          ...editingShop,
                          coverImageUrl: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-gray-800 block mb-1">About Shop Description</label>
                    <textarea
                      rows={2}
                      value={editingShop.aboutDescription || editingShop.description || ''}
                      onChange={(e) =>
                        setEditingShop({
                          ...editingShop,
                          aboutDescription: e.target.value,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setEditingShop(null)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await saveShop(editingShop);
                      setEditingShop(null);
                      setAdminNotice(`Successfully updated shop "${editingShop.shopName}"!`);
                      setTimeout(() => setAdminNotice(null), 3000);
                    }}
                    className="px-5 py-2 bg-[#126B45] hover:bg-[#0e5235] text-white rounded-xl font-bold flex items-center gap-1.5 shadow"
                  >
                    <Save className="w-4 h-4" /> Save Shop Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DELETE / REMOVE SHOP MODAL (PRD Section 8) */}
          {deletingShop && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-red-100">
                <div className="flex items-center gap-3 text-red-600">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-gray-900">Remove Unauthorized Shop</h4>
                    <p className="text-gray-500 text-xs">Permanent deletion from database</p>
                  </div>
                </div>

                <p className="text-xs text-gray-700">
                  Are you sure you want to remove <strong>{deletingShop.shopName}</strong> (Owner: {deletingShop.ownerName})? This will permanently delete the shop profile from Firestore and remove it from customer discovery.
                </p>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setDeletingShop(null)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const shopNameToDelete = deletingShop.shopName;
                      await deleteShop(deletingShop.id);
                      setDeletingShop(null);
                      setAdminNotice(`Shop "${shopNameToDelete}" has been permanently removed.`);
                      setTimeout(() => setAdminNotice(null), 4000);
                    }}
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CENTRAL RULES & FREE DELIVERY ENGINE (PRD Section 12 & 21) */}
      {activeTab === 'rules_config' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                Central Platform Rule Engine (Sections 11, 12, 21)
              </h3>
              <p className="text-gray-500">
                Configure delivery rules, weight threshold (&gt;10 kg rule), intercity barriers, and bank accounts.
              </p>
            </div>
            {savedSettingsNotice && (
              <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-lg">
                Settings Saved!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-2">
              <label className="font-bold text-emerald-950 block">
                Free Delivery Weight Threshold (Kg)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                value={thresholdInput}
                onChange={(e) => setThresholdInput(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold bg-white focus:ring-2 focus:ring-[#126B45]"
              />
              <p className="text-[11px] text-gray-600">
                <strong>Current Rule:</strong> Free delivery applies ONLY when order weight is strictly &gt; {thresholdInput} kg. Exactly {thresholdInput} kg is paid delivery.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
              <label className="font-bold text-gray-900 block">
                Default Standard Local Delivery Fee (Rs.)
              </label>
              <input
                type="number"
                min="0"
                value={deliveryFeeInput}
                onChange={(e) => setDeliveryFeeInput(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold bg-white focus:ring-2 focus:ring-[#126B45]"
              />
              <p className="text-[11px] text-gray-600">
                Applied when order weight is &le; {thresholdInput} kg unless overridden by shopkeeper.
              </p>
            </div>
          </div>

          {/* Intercity Delivery Switch (PRD Section 11) */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-gray-900 text-sm">
                Intercity Delivery Activation (Section 11)
              </div>
              <p className="text-gray-600 max-w-xl">
                Initial PRD mandate requires intercity delivery to be <strong>DISABLED</strong> so customers can only order from shops in their own city (e.g. Mithi customers ordering from Mithi shops).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIntercityInput(!intercityInput)}
              className={`px-4 py-2 rounded-xl font-bold transition ${
                intercityInput
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-300 text-gray-700'
              }`}
            >
              {intercityInput ? 'Intercity ENABLED' : 'Intercity DISABLED (Default)'}
            </button>
          </div>

          {/* Digital Payment Recipient Accounts */}
          <div className="space-y-3 pt-3 border-t border-gray-200">
            <h4 className="font-bold text-gray-900">Official Pakistani Payment Collection Accounts</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-2">
                <span className="font-bold text-green-700">Easypaisa Wallet Details:</span>
                <div>
                  <label className="text-[11px] text-gray-500 block">Account Title</label>
                  <input
                    type="text"
                    value={easypaisaTitle}
                    onChange={(e) => setEasypaisaTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 block">Account Number</label>
                  <input
                    type="text"
                    value={easypaisaNumber}
                    onChange={(e) => setEasypaisaNumber(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white font-mono"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-2">
                <span className="font-bold text-red-700">JazzCash Wallet Details:</span>
                <div>
                  <label className="text-[11px] text-gray-500 block">Account Title</label>
                  <input
                    type="text"
                    value={jazzcashTitle}
                    onChange={(e) => setJazzcashTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 block">Account Number</label>
                  <input
                    type="text"
                    value={jazzcashNumber}
                    onChange={(e) => setJazzcashNumber(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSaveSystemSettings}
              className="px-6 py-2.5 bg-[#126B45] hover:bg-[#0e5235] text-white font-bold rounded-xl transition shadow flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save System Rules
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: SPECIALIZED SERVICE COMPLIANCE (PRD Section 23) */}
      {activeTab === 'compliance' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
              Specialized Service Compliance Center (Section 23)
            </h3>
            <p className="text-gray-500">
              Statutory verification for LPG cylinder safety, licensed pharmacy DRAP authorizations, and clean drinking water suppliers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* LPG Compliance */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                <Flame className="w-5 h-5" /> Authorized LPG Compliance
              </div>
              <p className="text-gray-600">
                Verify OGRA authorization. Strictly forbid unauthorized decanting. All cylinders must pass pressure test certifications.
              </p>
              <div className="bg-gray-50 p-2.5 rounded-lg text-[11px] text-emerald-800 font-semibold">
                ✓ Decanting checks active • Cylinder valve audit enforced
              </div>
            </div>

            {/* Pharmacy Compliance */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                <Pill className="w-5 h-5" /> Licensed Pharmacy (DRAP)
              </div>
              <p className="text-gray-600">
                Mithi Medicare & Licensed Pharmacy verified under license DRAP-LIC-SD-THAR-4491. Schedule G drugs require prescription upload.
              </p>
              <div className="bg-gray-50 p-2.5 rounded-lg text-[11px] text-emerald-800 font-semibold">
                ✓ Licensed Pharmacist on record • Prescription check active
              </div>
            </div>

            {/* Water Quality */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-teal-600 font-bold text-sm">
                <Droplet className="w-5 h-5" /> Certified Drinking Water
              </div>
              <p className="text-gray-600">
                Water suppliers must provide monthly TDS/microbial lab test reports (PCRWR certified standards).
              </p>
              <div className="bg-gray-50 p-2.5 rounded-lg text-[11px] text-emerald-800 font-semibold">
                ✓ PCRWR Water Quality standards active
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ALL ORDERS OVERVIEW */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">Platform Wide Orders</h3>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Shop</th>
                    <th className="p-3">Customer & City</th>
                    <th className="p-3">Weight</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="p-3 font-mono font-bold text-gray-900">{o.orderNumber}</td>
                      <td className="p-3 font-medium text-emerald-800">{o.shopName}</td>
                      <td className="p-3">
                        <div className="font-semibold text-gray-900">{o.customerName}</div>
                        <div className="text-[10px] text-gray-500">{o.customerArea}, {o.customerCity}</div>
                      </td>
                      <td className="p-3">
                        <span className={`font-semibold ${o.isFreeDelivery ? 'text-emerald-700' : 'text-gray-700'}`}>
                          {o.totalWeightKg.toFixed(1)} kg {o.isFreeDelivery && '(Free Deliv)'}
                        </span>
                      </td>
                      <td className="p-3 uppercase font-medium text-gray-700">
                        {o.paymentMethod} ({o.paymentStatus})
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-800">
                          {o.orderStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-[#126B45]">Rs. {o.totalAmount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
