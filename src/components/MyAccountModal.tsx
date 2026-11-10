import React, { useState } from 'react';
import {
  X,
  User,
  Store,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Camera,
  Image as ImageIcon,
  Edit3,
  Layers,
  Sparkles,
  ShoppingBag,
  Power,
  Tag,
  Megaphone,
  Check,
  Save,
  Compass,
  PlusCircle,
  Eye,
  Crop,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Shop, UserRole } from '../types';
import { PAKISTAN_LOCATIONS } from '../data/pakistanLocations';
import { ImageAdjusterModal } from './ImageAdjusterModal';

interface MyAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenShopPreview?: (shop: Shop) => void;
}

export const MyAccountModal: React.FC<MyAccountModalProps> = ({ isOpen, onClose, onOpenShopPreview }) => {
  const {
    currentUser,
    setCurrentUser,
    activeRole,
    setActiveRole,
    shops,
    saveShop,
    products,
    selectedCity,
    selectedArea,
  } = useApp();

  // Find shop owned by current user (by ownerId or shopId)
  const myShop = shops.find(
    (s) => s.ownerId === currentUser.id || (currentUser.shopId && s.id === currentUser.shopId)
  );

  const [activeAccountTab, setActiveAccountTab] = useState<
    'profile' | 'create_shop' | 'manage_shop' | 'promotions' | 'my_products'
  >(() => (myShop ? 'manage_shop' : 'profile'));

  // Edit User Profile state
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [phone, setPhone] = useState(currentUser.phone);
  const [whatsappNumber, setWhatsappNumber] = useState(currentUser.whatsappNumber || currentUser.phone);
  const [email, setEmail] = useState(currentUser.email);
  const [address, setAddress] = useState(currentUser.address);
  const [cnic, setCnic] = useState(currentUser.cnic || '');
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // Shop Form State (17 PRD Fields)
  const [shopName, setShopName] = useState(myShop?.shopName || '');
  const [shopOwnerName, setShopOwnerName] = useState(myShop?.ownerName || currentUser.fullName);
  const [shopLogo, setShopLogo] = useState(myShop?.logoUrl || '/assets/aistudio/ghar365_brand_logo_panel_8e0bd9ca.png');
  const [shopCoverImage, setShopCoverImage] = useState(
    myShop?.coverImageUrl || '/assets/aistudio/shop_smart_shop_local_9330ee28.png'
  );
  const [shopPhone, setShopPhone] = useState(myShop?.phone || currentUser.phone);
  const [shopWhatsapp, setShopWhatsapp] = useState(myShop?.whatsappNumber || currentUser.whatsappNumber || currentUser.phone);
  const [shopEmail, setShopEmail] = useState(myShop?.email || currentUser.email);
  const [shopCategory, setShopCategory] = useState(myShop?.category || 'Grocery and Fresh Food');
  const [shopDescription, setShopDescription] = useState(
    myShop?.description || 'Quality daily essentials, fresh produce, and trusted local supplies delivered fast.'
  );
  const [shopAddress, setShopAddress] = useState(myShop?.address || currentUser.address);
  const [shopProvince, setShopProvince] = useState(myShop?.province || currentUser.province || 'Sindh');
  const [shopCity, setShopCity] = useState(myShop?.city || currentUser.city || 'Mithi');
  const [shopArea, setShopArea] = useState(myShop?.area || currentUser.area || 'Shahi Bazaar');
  const [shopLocation, setShopLocation] = useState(
    myShop?.locationCoordinates || '24.7410° N, 69.8000° E (Mithi Central Market)'
  );
  const [openingHours, setOpeningHours] = useState(myShop?.openingHours || '08:00 AM');
  const [closingHours, setClosingHours] = useState(myShop?.closingHours || '10:00 PM');
  const [deliveryAvailability, setDeliveryAvailability] = useState<boolean>(myShop?.deliveryAvailability ?? true);
  const [shopStatusOpen, setShopStatusOpen] = useState<boolean>(myShop?.isOpen ?? true);
  const [deliveryAreasStr, setDeliveryAreasStr] = useState(
    myShop?.deliveryAreas?.join(', ') || 'Shahi Bazaar, Kashmir Chowk, Main Hospital Road, Saddar Mithi'
  );
  const [deliveryFee, setDeliveryFee] = useState<number>(myShop?.deliveryFee || 120);

  // About & Promotion Form State (PRD Section 7)
  const [aboutDescription, setAboutDescription] = useState(
    myShop?.aboutDescription ||
      'Established in 2021, our shop is committed to bringing pure, chemical-free and farm-fresh ingredients to Tharparkar households.'
  );
  const [shopIntroduction, setShopIntroduction] = useState(
    myShop?.shopIntroduction || 'Your trusted neighborhood partner for daily kitchen staples, dairy, and seasonal goods.'
  );
  const [promotionalBanner, setPromotionalBanner] = useState(
    myShop?.promotionalBannerUrl || '/assets/aistudio/shop_smart_shop_local_9330ee28.png'
  );
  const [specialOffers, setSpecialOffers] = useState(
    myShop?.specialOffers || 'Get 10% off on all fresh vegetables every Friday & free delivery over 10 kg!'
  );
  const [discountAnnouncements, setDiscountAnnouncements] = useState(
    myShop?.discountAnnouncements || 'Special discounts on bulk cooking oil and flour packs this week!'
  );

  const [shopSavedMsg, setShopSavedMsg] = useState(false);
  const [promoSavedMsg, setPromoSavedMsg] = useState(false);

  // Image Cropper modal state for My Account
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperTarget, setCropperTarget] = useState<'logo' | 'cover' | 'banner'>('logo');
  const [cropperRatio, setCropperRatio] = useState<'1:1' | '16:9' | '4:3'>('1:1');
  const [cropperInitialUrl, setCropperInitialUrl] = useState('');

  const handleCroppedSave = (dataUrl: string) => {
    if (cropperTarget === 'logo') {
      setShopLogo(dataUrl);
    } else if (cropperTarget === 'cover') {
      setShopCoverImage(dataUrl);
    } else if (cropperTarget === 'banner') {
      setPromotionalBanner(dataUrl);
    }
  };

  if (!isOpen) return null;

  // Handle saving user profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...currentUser,
      fullName,
      phone,
      whatsappNumber,
      email,
      address,
      cnic,
    };
    setCurrentUser(updatedUser);
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 2000);
  };

  // Handle creating or updating shop
  const handleSaveShopProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const shopId = myShop?.id || `shop_${Date.now()}`;
    const areas = deliveryAreasStr
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    const updatedShop: Shop = {
      id: shopId,
      ownerId: currentUser.id,
      ownerName: shopOwnerName || currentUser.fullName,
      shopName,
      logoUrl: shopLogo,
      coverImageUrl: shopCoverImage,
      phone: shopPhone,
      whatsappNumber: shopWhatsapp,
      email: shopEmail,
      cnic: currentUser.cnic || '44301-1234567-1',
      category: shopCategory,
      description: shopDescription,
      province: shopProvince,
      district: 'Tharparkar',
      city: shopCity,
      area: shopArea,
      address: shopAddress,
      locationCoordinates: shopLocation,
      openingHours,
      closingHours,
      deliveryAvailability,
      deliveryHours: `${openingHours} - ${closingHours}`,
      deliveryAreas: areas.length > 0 ? areas : [shopArea],
      deliveryRadiusKm: myShop?.deliveryRadiusKm || 10,
      deliveryFee: Number(deliveryFee),
      minOrderValue: myShop?.minOrderValue || 200,
      imageUrl: shopCoverImage || shopLogo,
      verificationStatus: myShop?.verificationStatus || 'verified',
      complianceCategory:
        shopCategory === 'Licensed pharmacy products'
          ? 'pharmacy'
          : shopCategory === 'Authorized LPG services'
          ? 'lpg'
          : shopCategory === 'Drinking water'
          ? 'water'
          : 'standard',
      rating: myShop?.rating || 4.9,
      totalOrders: myShop?.totalOrders || 0,
      isOpen: shopStatusOpen,
      aboutDescription,
      shopIntroduction,
      promotionalBannerUrl: promotionalBanner,
      specialOffers,
      discountAnnouncements,
      createdAt: myShop?.createdAt || new Date().toISOString(),
    };

    await saveShop(updatedShop);

    // Link shop to current user and ensure seller role
    setCurrentUser({
      ...currentUser,
      shopId: updatedShop.id,
      role: 'seller',
    });

    setShopSavedMsg(true);
    setTimeout(() => setShopSavedMsg(false), 2000);
    setActiveAccountTab('manage_shop');
  };

  // Handle saving promotional & about details
  const handleSavePromotions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myShop) return;

    const updatedShop: Shop = {
      ...myShop,
      aboutDescription,
      shopIntroduction,
      promotionalBannerUrl: promotionalBanner,
      specialOffers,
      discountAnnouncements,
    };

    await saveShop(updatedShop);
    setPromoSavedMsg(true);
    setTimeout(() => setPromoSavedMsg(false), 2000);
  };

  // Products belonging to this shop
  const myShopProducts = myShop ? products.filter((p) => p.shopId === myShop.id) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#126B45] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F2B84B] text-[#202C27] flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">My Account</h3>
                <span className="text-[11px] bg-emerald-800 text-yellow-300 font-bold px-2 py-0.5 rounded-full uppercase">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                {currentUser.fullName} • {currentUser.phone}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-emerald-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (NOTICE: Rider Dashboard is explicitly REMOVED per PRD Section 3) */}
        <div className="bg-[#F7F5EF] border-b border-gray-200 px-4 py-2 flex gap-1.5 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveAccountTab('profile')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              activeAccountTab === 'profile'
                ? 'bg-[#126B45] text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-200/70'
            }`}
          >
            <User className="w-3.5 h-3.5" /> My Profile
          </button>

          {!myShop ? (
            <button
              type="button"
              onClick={() => setActiveAccountTab('create_shop')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeAccountTab === 'create_shop'
                  ? 'bg-[#126B45] text-white shadow-xs'
                  : 'text-[#126B45] bg-emerald-100/70 hover:bg-emerald-200/70 font-bold'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#F2B84B]" /> Create Your Shop
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setActiveAccountTab('manage_shop')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  activeAccountTab === 'manage_shop'
                    ? 'bg-[#126B45] text-white shadow-xs'
                    : 'text-gray-700 hover:bg-gray-200/70'
                }`}
              >
                <Store className="w-3.5 h-3.5" /> Shop Profile
              </button>

              <button
                type="button"
                onClick={() => setActiveAccountTab('promotions')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  activeAccountTab === 'promotions'
                    ? 'bg-[#126B45] text-white shadow-xs'
                    : 'text-gray-700 hover:bg-gray-200/70'
                }`}
              >
                <Megaphone className="w-3.5 h-3.5" /> About & Promotions
              </button>

              <button
                type="button"
                onClick={() => setActiveAccountTab('my_products')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  activeAccountTab === 'my_products'
                    ? 'bg-[#126B45] text-white shadow-xs'
                    : 'text-gray-700 hover:bg-gray-200/70'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Shop Products ({myShopProducts.length})
              </button>
            </>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* TAB 1: USER PROFILE */}
          {activeAccountTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Personal & Contact Information</h4>
                  <p className="text-gray-500">Your verified Pakistani user identity on Ghar365</p>
                </div>
                {profileSavedMsg && (
                  <span className="bg-emerald-100 text-[#126B45] font-bold px-2 py-1 rounded flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">National CNIC Number</label>
                  <input
                    type="text"
                    placeholder="44301-XXXXXXX-X"
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Mobile Number (+92)</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Complete Delivery / Home Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                />
              </div>

              {/* Become a Seller callout if user is only customer */}
              {!myShop && (
                <div className="bg-gradient-to-r from-emerald-50 to-[#F7F5EF] p-4 rounded-xl border border-emerald-200 flex items-center justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-[#126B45] text-sm flex items-center gap-1.5">
                      <Store className="w-4 h-4 text-[#F2B84B]" /> Are you a local shopkeeper or producer?
                    </h5>
                    <p className="text-gray-600 mt-0.5">
                      Open your verified online shop, set independent prices, and deliver to neighborhood customers in {currentUser.city}!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveAccountTab('create_shop')}
                    className="px-4 py-2 bg-[#126B45] hover:bg-[#0e5235] text-white font-bold rounded-xl shrink-0 transition shadow-xs"
                  >
                    Create Your Shop →
                  </button>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#126B45] hover:bg-[#0e5235] text-white font-bold rounded-xl transition shadow flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Profile Details
                </button>
              </div>
            </form>
          )}

          {/* TAB 2 & 3: CREATE OR MANAGE SHOP PROFILE (PRD Section 4 & 5 - All 17 Fields & Controls) */}
          {(activeAccountTab === 'create_shop' || activeAccountTab === 'manage_shop') && (
            <form onSubmit={handleSaveShopProfile} className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#126B45]" />
                    {myShop ? `Manage Shop: ${myShop.shopName}` : 'Register & Create Your Online Shop'}
                  </h4>
                  <p className="text-gray-500">
                    Complete all 17 shop details to activate neighborhood ordering & delivery
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {myShop && onOpenShopPreview && (
                    <button
                      type="button"
                      onClick={() => onOpenShopPreview(myShop)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-bold flex items-center gap-1 transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#126B45]" /> View Shop Profile
                    </button>
                  )}
                  {shopSavedMsg && (
                    <span className="bg-emerald-100 text-[#126B45] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Changes Saved!
                    </span>
                  )}
                </div>
              </div>

              {/* Status and Active Toggle */}
              <div className="bg-[#F7F5EF] p-3.5 rounded-xl border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-800 block text-xs">
                    Shop Operating Status (Open / Closed)
                  </span>
                  <span className="text-[11px] text-gray-500">
                    When closed, customers can browse your catalog but cannot place orders
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShopStatusOpen(!shopStatusOpen)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition flex items-center gap-1.5 ${
                    shopStatusOpen
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  {shopStatusOpen ? 'Shop is OPEN' : 'Shop is CLOSED'}
                </button>
              </div>

              {/* 1 & 4. Shop Name & Owner Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">1. Shop Name (دکان کا نام)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Al-Madina Fresh Mart, Thar Organic Honey"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">4. Shop Owner Name</label>
                  <input
                    type="text"
                    required
                    value={shopOwnerName}
                    onChange={(e) => setShopOwnerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                  />
                </div>
              </div>

              {/* 2 & 3. Logo and Cover Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-gray-700 block">2. Shop Logo (1:1 Square)</label>
                    <button
                      type="button"
                      onClick={() => {
                        setCropperTarget('logo');
                        setCropperRatio('1:1');
                        setCropperInitialUrl(shopLogo);
                        setCropperOpen(true);
                      }}
                      className="text-xs text-[#126B45] hover:text-[#0e5235] font-bold flex items-center gap-1"
                    >
                      <Crop className="w-3 h-3" /> Crop & Adjust
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={shopLogo}
                      alt="Logo Preview"
                      className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-200"
                    />
                    <input
                      type="text"
                      placeholder="Image URL or preset path"
                      value={shopLogo}
                      onChange={(e) => setShopLogo(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setShopLogo('/assets/aistudio/ghar365_brand_logo_panel_8e0bd9ca.png')}
                      className="text-[10px] text-[#126B45] hover:underline font-semibold"
                    >
                      Use Ghar365 Official Logo
                    </button>
                    <span className="text-gray-300">•</span>
                    <button
                      type="button"
                      onClick={() => setShopLogo('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80')}
                      className="text-[10px] text-[#126B45] hover:underline font-semibold"
                    >
                      Market Mart Preset
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-gray-700 block">3. Shop Cover Image (16:9)</label>
                    <button
                      type="button"
                      onClick={() => {
                        setCropperTarget('cover');
                        setCropperRatio('16:9');
                        setCropperInitialUrl(shopCoverImage);
                        setCropperOpen(true);
                      }}
                      className="text-xs text-[#126B45] hover:text-[#0e5235] font-bold flex items-center gap-1"
                    >
                      <Crop className="w-3 h-3" /> Crop & Adjust
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={shopCoverImage}
                      alt="Cover Preview"
                      className="w-20 h-12 rounded-xl object-cover bg-gray-100 border border-gray-200"
                    />
                    <input
                      type="text"
                      placeholder="Cover image URL or preset path"
                      value={shopCoverImage}
                      onChange={(e) => setShopCoverImage(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setShopCoverImage('/assets/aistudio/shop_smart_shop_local_9330ee28.png')}
                      className="text-[10px] text-[#126B45] hover:underline font-semibold"
                    >
                      Use &quot;Shop Smart Shop Local&quot; Banner
                    </button>
                    <span className="text-gray-300">•</span>
                    <button
                      type="button"
                      onClick={() => setShopCoverImage('/assets/aistudio/ghar365_main_hero_banner_3a4f6c8c.png')}
                      className="text-[10px] text-[#126B45] hover:underline font-semibold"
                    >
                      Family Hero Banner
                    </button>
                  </div>
                </div>
              </div>

              {/* 5, 6, 7. Phone, WhatsApp, Email */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">5. Phone Number</label>
                  <input
                    type="text"
                    required
                    value={shopPhone}
                    onChange={(e) => setShopPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">6. WhatsApp Number</label>
                  <input
                    type="text"
                    required
                    value={shopWhatsapp}
                    onChange={(e) => setShopWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">7. Email Address</label>
                  <input
                    type="email"
                    required
                    value={shopEmail}
                    onChange={(e) => setShopEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                  />
                </div>
              </div>

              {/* 8 & 9. Category & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">8. Shop Category</label>
                  <select
                    value={shopCategory}
                    onChange={(e) => setShopCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                  >
                    <option value="Grocery and Fresh Food">Grocery and Fresh Food</option>
                    <option value="Women's Fashion">Women&apos;s Fashion</option>
                    <option value="Beauty and Cosmetics">Beauty and Cosmetics</option>
                    <option value="Men's Fashion">Men&apos;s Fashion</option>
                    <option value="Baby and Kids">Baby and Kids</option>
                    <option value="Home and Kitchen">Home and Kitchen</option>
                    <option value="Licensed pharmacy products">Licensed pharmacy products</option>
                    <option value="Authorized LPG services">Authorized LPG services</option>
                    <option value="Drinking water">Drinking water</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">9. Shop Description</label>
                  <input
                    type="text"
                    required
                    value={shopDescription}
                    onChange={(e) => setShopDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                  />
                </div>
              </div>

              {/* 10, 11, 12, 13. Complete Address, City, Area, Location Pin */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">10. Complete Shop Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shop # 14-16, Shahi Bazaar, Near Ghanta Ghar"
                    value={shopAddress}
                    onChange={(e) => setShopAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">11. City</label>
                  <select
                    value={shopCity}
                    onChange={(e) => setShopCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                  >
                    <option value="Mithi">Mithi (Tharparkar)</option>
                    <option value="Islamkot">Islamkot</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">12. Area / Town</label>
                  <input
                    type="text"
                    required
                    value={shopArea}
                    onChange={(e) => setShopArea(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">13. Shop Location (Map / Coordinates)</label>
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#126B45] shrink-0" />
                    <input
                      type="text"
                      value={shopLocation}
                      onChange={(e) => setShopLocation(e.target.value)}
                      placeholder="Coordinates or landmark"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                    />
                  </div>
                </div>
              </div>

              {/* 14, 15, 16. Opening Hours, Closing Hours, Delivery Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">14. Opening Hours</label>
                  <input
                    type="text"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    placeholder="e.g. 08:00 AM"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">15. Closing Hours</label>
                  <input
                    type="text"
                    value={closingHours}
                    onChange={(e) => setClosingHours(e.target.value)}
                    placeholder="e.g. 10:00 PM"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">16. Delivery Availability</label>
                  <select
                    value={deliveryAvailability ? 'yes' : 'no'}
                    onChange={(e) => setDeliveryAvailability(e.target.value === 'yes')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                  >
                    <option value="yes">Available for Local Delivery</option>
                    <option value="no">In-store Pickup Only</option>
                  </select>
                </div>
              </div>

              {/* Delivery Areas in City & Standard Delivery Fee */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">Approved Neighborhood Delivery Areas</label>
                  <input
                    type="text"
                    value={deliveryAreasStr}
                    onChange={(e) => setDeliveryAreasStr(e.target.value)}
                    placeholder="Comma separated local areas in this city"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Standard Delivery Fee (Rs.)</label>
                  <input
                    type="number"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="text-[11px] text-gray-500">
                  * All changes save directly to persistent database & sync across sessions
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#126B45] hover:bg-[#0e5235] text-white font-bold rounded-xl transition shadow flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  {myShop ? 'Update Shop Profile' : 'Create & Launch Shop'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: ABOUT OUR SHOP & PROMOTIONS (PRD Section 7) */}
          {activeAccountTab === 'promotions' && myShop && (
            <form onSubmit={handleSavePromotions} className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-[#126B45]" />
                    About Our Shop & Promotion Section (Section 7)
                  </h4>
                  <p className="text-gray-500">
                    Showcase your brand story, promotional banners, special offers, and discounts to shoppers
                  </p>
                </div>
                {promoSavedMsg && (
                  <span className="bg-emerald-100 text-[#126B45] font-bold px-2 py-1 rounded flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Promotions Updated!
                  </span>
                )}
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">About Shop Description</label>
                <textarea
                  rows={3}
                  value={aboutDescription}
                  onChange={(e) => setAboutDescription(e.target.value)}
                  placeholder="Tell customers about your shop history, quality sourcing, and background..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Shop Introduction & Slogan</label>
                <input
                  type="text"
                  value={shopIntroduction}
                  onChange={(e) => setShopIntroduction(e.target.value)}
                  placeholder="e.g. Your trusted neighborhood partner for 100% pure Thari organic produce"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-gray-700 block">Promotional Banner Image</label>
                  <button
                    type="button"
                    onClick={() => {
                      setCropperTarget('banner');
                      setCropperRatio('16:9');
                      setCropperInitialUrl(promotionalBanner);
                      setCropperOpen(true);
                    }}
                    className="text-xs text-[#126B45] hover:text-[#0e5235] font-bold flex items-center gap-1"
                  >
                    <Crop className="w-3 h-3" /> Crop & Adjust Banner
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={promotionalBanner}
                    alt="Promo Banner Preview"
                    className="w-28 h-14 rounded-lg object-cover bg-gray-100 border border-gray-200"
                  />
                  <input
                    type="text"
                    value={promotionalBanner}
                    onChange={(e) => setPromotionalBanner(e.target.value)}
                    placeholder="Banner URL"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div className="flex gap-2 pt-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPromotionalBanner('/assets/aistudio/shop_smart_shop_local_9330ee28.png')}
                    className="text-[#126B45] hover:underline font-semibold"
                  >
                    Preset: &quot;Shop Smart Shop Local&quot;
                  </button>
                  <span className="text-gray-300">•</span>
                  <button
                    type="button"
                    onClick={() => setPromotionalBanner('/assets/aistudio/fast_reliable_delivery_e42af94e.png')}
                    className="text-[#126B45] hover:underline font-semibold"
                  >
                    Preset: &quot;Fast Delivery&quot;
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Special Offers & Deals</label>
                  <textarea
                    rows={2}
                    value={specialOffers}
                    onChange={(e) => setSpecialOffers(e.target.value)}
                    placeholder="e.g. Buy 5 kg potatoes, get 0.5 kg onions free"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Discount Announcements</label>
                  <textarea
                    rows={2}
                    value={discountAnnouncements}
                    onChange={(e) => setDiscountAnnouncements(e.target.value)}
                    placeholder="e.g. 15% discount on desi ghee this weekend"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#126B45] hover:bg-[#0e5235] text-white font-bold rounded-xl transition shadow flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save About & Promotional Details
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: MY PRODUCTS & INVENTORY INTEGRATION (PRD Section 6) */}
          {activeAccountTab === 'my_products' && myShop && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#126B45]" />
                    Products Linked to {myShop.shopName}
                  </h4>
                  <p className="text-gray-500">
                    Displaying shop name, logo, stock, price, and category as mandated by Section 6
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveRole('seller');
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-[#126B45] text-white rounded-lg font-bold hover:bg-[#0e5235] transition"
                >
                  Go to Full Product Catalog Manager →
                </button>
              </div>

              {myShopProducts.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-xl text-center text-gray-500">
                  No products added yet for this shop. Click &quot;Go to Full Product Catalog Manager&quot; to publish items.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {myShopProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl border border-gray-200 bg-white flex gap-3 items-center shadow-xs"
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-14 h-14 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {myShop.logoUrl && (
                            <img
                              src={myShop.logoUrl}
                              alt=""
                              className="w-3.5 h-3.5 rounded-full object-cover inline"
                            />
                          )}
                          <span className="text-[10px] text-gray-500 font-semibold truncate">
                            {myShop.shopName}
                          </span>
                        </div>
                        <h5 className="font-bold text-xs text-gray-900 truncate">{p.name}</h5>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-bold text-[#126B45] text-xs">
                            Rs. {p.price} / {p.unit}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              p.availableStock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {p.availableStock > 0 ? `${p.availableStock} ${p.unit} in stock` : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs">
          <div className="text-gray-500">
            Account ID: <span className="font-mono">{currentUser.id}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>

      {/* Image Adjuster / Cropper Modal */}
      <ImageAdjusterModal
        isOpen={cropperOpen}
        onClose={() => setCropperOpen(false)}
        initialImageUrl={cropperInitialUrl}
        aspectRatio={cropperRatio}
        onSave={(dataUrl) => {
          handleCroppedSave(dataUrl);
          setCropperOpen(false);
        }}
      />
    </div>
  );
};
