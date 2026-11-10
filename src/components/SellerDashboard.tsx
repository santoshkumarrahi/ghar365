import React, { useState } from 'react';
import {
  Store,
  PackagePlus,
  Boxes,
  Truck,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2,
  Edit3,
  Layers,
  Scale,
  DollarSign,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, ProductVariant, Shop, UnitType, Order } from '../types';
import { Eye, Megaphone, Check, Save, Crop, Image as ImageIcon, Power, Palette, Maximize2 } from 'lucide-react';
import { EditProductModal } from './EditProductModal';
import { ImageAdjusterModal } from './ImageAdjusterModal';

interface SellerDashboardProps {
  onOpenShopPreview?: (shop: Shop) => void;
  onOpenAccount?: () => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ onOpenShopPreview, onOpenAccount }) => {
  const {
    shops,
    products,
    orders,
    saveProduct,
    saveShop,
    deleteProduct,
    updateOrderStatus,
    selectedCity,
    currentUser,
  } = useApp();

  // Find seller's shop (match current user's shop or ownerId, or fallback to first shop)
  const currentShop =
    shops.find((s) => (currentUser.shopId && s.id === currentUser.shopId) || s.ownerId === currentUser.id) ||
    shops.find((s) => s.id === 'shop_mithi_almadina') ||
    shops[0];

  const shopProducts = products.filter((p) => p.shopId === currentShop?.id);
  const shopOrders = orders.filter((o) => o.shopId === currentShop?.id);

  const [activeTab, setActiveTab] = useState<
    'inventory' | 'add_product' | 'shop_profile' | 'about_promotions' | 'orders' | 'delivery_settings'
  >('inventory');

  // Product editing modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Promotion state
  const [aboutDesc, setAboutDesc] = useState(currentShop?.aboutDescription || currentShop?.description || '');
  const [shopIntro, setShopIntro] = useState(currentShop?.shopIntroduction || '');
  const [promoBanner, setPromoBanner] = useState(currentShop?.promotionalBannerUrl || '/assets/aistudio/shop_smart_shop_local_9330ee28.png');
  const [offers, setOffers] = useState(currentShop?.specialOffers || '');
  const [discountNotice, setDiscountNotice] = useState(currentShop?.discountAnnouncements || '');
  const [promoSaved, setPromoSaved] = useState(false);

  // Shop Profile Editing state (PRD Section 5)
  const [shopNameInput, setShopNameInput] = useState(currentShop?.shopName || '');
  const [shopOwnerInput, setShopOwnerInput] = useState(currentShop?.ownerName || '');
  const [shopCategoryInput, setShopCategoryInput] = useState(currentShop?.category || 'Grocery and Fresh Food');
  const [shopAddressInput, setShopAddressInput] = useState(currentShop?.address || '');
  const [shopCityInput, setShopCityInput] = useState(currentShop?.city || 'Mithi');
  const [shopAreaInput, setShopAreaInput] = useState(currentShop?.area || '');
  const [shopPhoneInput, setShopPhoneInput] = useState(currentShop?.phone || '');
  const [shopWhatsappInput, setShopWhatsappInput] = useState(currentShop?.whatsappNumber || '');
  const [shopEmailInput, setShopEmailInput] = useState(currentShop?.email || '');
  const [shopLogoInput, setShopLogoInput] = useState(currentShop?.logoUrl || currentShop?.imageUrl || '');
  const [shopCoverInput, setShopCoverInput] = useState(currentShop?.coverImageUrl || '');
  const [shopHoursOpenInput, setShopHoursOpenInput] = useState(currentShop?.openingHours || '08:00 AM');
  const [shopHoursCloseInput, setShopHoursCloseInput] = useState(currentShop?.closingHours || '10:00 PM');
  const [shopDeliveryAvailableInput, setShopDeliveryAvailableInput] = useState<boolean>(currentShop?.deliveryAvailability ?? true);
  const [shopIsOpenInput, setShopIsOpenInput] = useState<boolean>(currentShop?.isOpen ?? true);
  const [shopProfileSaved, setShopProfileSaved] = useState(false);

  // Image Cropper modal state
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperTarget, setCropperTarget] = useState<'add_product' | 'shop_logo' | 'shop_cover' | 'shop_banner'>('add_product');
  const [cropperRatio, setCropperRatio] = useState<'1:1' | '16:9' | '4:3'>('4:3');
  const [cropperInitialUrl, setCropperInitialUrl] = useState('');

  // New Product Form State
  const [name, setName] = useState('');
  const [nameUrdu, setNameUrdu] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(currentShop?.category || 'Grocery and Fresh Food');
  const [price, setPrice] = useState<number>(150);
  const [unit, setUnit] = useState<UnitType>('kg');
  const [stock, setStock] = useState<number>(100);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(10);
  const [weightKg, setWeightKg] = useState<number>(1.0);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80');
  const [productImages, setProductImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
  ]);
  const [productColors, setProductColors] = useState('');
  const [productSizes, setProductSizes] = useState('');
  const [productStatus, setProductStatus] = useState<'active' | 'out_of_stock'>('active');
  const [hasVariants, setHasVariants] = useState(false);
  const [variantsList, setVariantsList] = useState<ProductVariant[]>([]);

  // Variant addition temporary state
  const [vColor, setVColor] = useState('');
  const [vSize, setVSize] = useState('');
  const [vPrice, setVPrice] = useState<number>(price);
  const [vStock, setVStock] = useState<number>(10);

  // Delivery configuration state
  const [deliveryAreasInput, setDeliveryAreasInput] = useState<string>(
    currentShop?.deliveryAreas?.join(', ') || ''
  );
  const [deliveryFee, setDeliveryFee] = useState<number>(currentShop?.deliveryFee || 120);
  const [deliveryRadius, setDeliveryRadius] = useState<number>(currentShop?.deliveryRadiusKm || 8);
  const [shopSaveNotice, setShopSaveNotice] = useState(false);

  const handleAddVariant = () => {
    if (!vColor && !vSize) {
      alert('Please specify at least a color or a size for this variant.');
      return;
    }
    const newVariant: ProductVariant = {
      id: `var_${Date.now()}`,
      sku: `VAR-${Date.now().toString().slice(-4)}`,
      name: [vSize, vColor].filter(Boolean).join(' / '),
      color: vColor || undefined,
      size: vSize || undefined,
      price: vPrice,
      stock: vStock,
      imageUrl: productImages[0] || imageUrl,
    };
    setVariantsList([...variantsList, newVariant]);
    setVColor('');
    setVSize('');
  };

  const handleRemoveVariant = (id: string) => {
    setVariantsList(variantsList.filter((v) => v.id !== id));
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentShop) return;

    const colors = productColors
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const sizes = productSizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const effectiveStock = hasVariants
      ? variantsList.reduce((acc, v) => acc + v.stock, 0)
      : Number(stock);

    const isWeightCategory =
      category.toLowerCase().includes('grocery') ||
      category.toLowerCase().includes('fruit') ||
      category.toLowerCase().includes('vegetable');

    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      shopId: currentShop.id,
      shopName: currentShop.shopName,
      name,
      nameUrdu: nameUrdu.trim() || undefined,
      description: description || `${name} fresh from ${currentShop.shopName}.`,
      category,
      sku: `SKU-${Date.now().toString().slice(-6)}`,
      price: Number(price),
      unit,
      minQuantity: unit === 'litre' || unit === 'kg' ? 0.5 : 1,
      maxQuantity: 100,
      availableStock: effectiveStock,
      lowStockThreshold: Number(lowStockThreshold),
      weightKg: Number(weightKg),
      isWeightEligible: isWeightCategory,
      hasVariants,
      variants: hasVariants ? variantsList : undefined,
      imageUrl: productImages[0] || imageUrl,
      images: productImages.length > 0 ? productImages : [imageUrl],
      colors: colors.length > 0 ? colors : undefined,
      sizes: sizes.length > 0 ? sizes : undefined,
      status: productStatus === 'out_of_stock' || effectiveStock <= 0 ? 'out_of_stock' : 'active',
      createdAt: new Date().toISOString(),
    };

    await saveProduct(newProduct);
    alert(`Product "${name}" successfully listed in your shop!`);
    // Reset form
    setName('');
    setNameUrdu('');
    setDescription('');
    setProductColors('');
    setProductSizes('');
    setVariantsList([]);
    setHasVariants(false);
    setActiveTab('inventory');
  };

  const handleQuickRestock = async (product: Product, addAmount: number) => {
    const updated: Product = {
      ...product,
      availableStock: product.availableStock + addAmount,
      status: 'active',
    };
    await saveProduct(updated);
  };

  const handleToggleStockStatus = async (product: Product) => {
    const nextStatus = product.status === 'out_of_stock' ? 'active' : 'out_of_stock';
    const updated: Product = {
      ...product,
      status: nextStatus,
      availableStock: nextStatus === 'active' && product.availableStock <= 0 ? 10 : product.availableStock,
    };
    await saveProduct(updated);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(productId);
    }
  };

  const handleSaveShopProfileInDashboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentShop) return;
    const updated: Shop = {
      ...currentShop,
      shopName: shopNameInput,
      ownerName: shopOwnerInput,
      category: shopCategoryInput,
      address: shopAddressInput,
      city: shopCityInput,
      area: shopAreaInput,
      phone: shopPhoneInput,
      whatsappNumber: shopWhatsappInput,
      email: shopEmailInput,
      logoUrl: shopLogoInput,
      imageUrl: shopCoverInput || shopLogoInput,
      coverImageUrl: shopCoverInput,
      openingHours: shopHoursOpenInput,
      closingHours: shopHoursCloseInput,
      deliveryAvailability: shopDeliveryAvailableInput,
      isOpen: shopIsOpenInput,
    };
    await saveShop(updated);
    setShopProfileSaved(true);
    setTimeout(() => setShopProfileSaved(false), 2500);
  };

  const handleCroppedSaveInDashboard = (dataUrl: string) => {
    if (cropperTarget === 'add_product') {
      setProductImages((prev) => [...prev, dataUrl]);
      setImageUrl(dataUrl);
    } else if (cropperTarget === 'shop_logo') {
      setShopLogoInput(dataUrl);
    } else if (cropperTarget === 'shop_cover') {
      setShopCoverInput(dataUrl);
    } else if (cropperTarget === 'shop_banner') {
      setPromoBanner(dataUrl);
    }
  };

  const handleSaveDeliveryConfig = async () => {
    if (!currentShop) return;
    const areas = deliveryAreasInput
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    const updatedShop: Shop = {
      ...currentShop,
      deliveryAreas: areas,
      deliveryFee: Number(deliveryFee),
      deliveryRadiusKm: Number(deliveryRadius),
    };

    await saveShop(updatedShop);
    setShopSaveNotice(true);
    setTimeout(() => setShopSaveNotice(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Seller Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-[#126B45] flex items-center justify-center font-bold shadow-xs">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">{currentShop?.shopName}</h2>
              <span className="bg-emerald-100 text-[#126B45] text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Shop
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Proprietor: {currentShop?.ownerName} • CNIC: {currentShop?.cnic} • City: <strong>{currentShop?.city}</strong>
            </p>
          </div>
        </div>

        {/* Quick Stats & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            {onOpenShopPreview && currentShop && (
              <button
                type="button"
                onClick={() => onOpenShopPreview(currentShop)}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#126B45] rounded-xl text-xs font-bold border border-emerald-200 transition flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" /> View Public Shop
              </button>
            )}
            {onOpenAccount && (
              <button
                type="button"
                onClick={onOpenAccount}
                className="px-3 py-1.5 bg-[#126B45] hover:bg-[#0e5235] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" /> Manage in My Account
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="bg-[#F7F5EF] px-3 py-1.5 rounded-xl border border-gray-200 text-center">
              <div className="text-gray-500 font-medium">Products</div>
              <div className="text-sm font-bold text-[#126B45]">{shopProducts.length}</div>
            </div>
            <div className="bg-[#F7F5EF] px-3 py-1.5 rounded-xl border border-gray-200 text-center">
              <div className="text-gray-500 font-medium">Orders</div>
              <div className="text-sm font-bold text-[#126B45]">{shopOrders.length}</div>
            </div>
            <div className="bg-[#F7F5EF] px-3 py-1.5 rounded-xl border border-gray-200 text-center">
              <div className="text-gray-500 font-medium">Rating</div>
              <div className="text-sm font-bold text-amber-600">★ {currentShop?.rating || 4.8}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'bg-[#126B45] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Boxes className="w-4 h-4" /> Stock & Products ({shopProducts.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('add_product')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'add_product'
              ? 'bg-[#126B45] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <PackagePlus className="w-4 h-4" /> Add New Product
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('shop_profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'shop_profile'
              ? 'bg-[#126B45] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Store className="w-4 h-4" /> Shop Profile & Info
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('about_promotions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'about_promotions'
              ? 'bg-[#126B45] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Megaphone className="w-4 h-4" /> About & Promotions
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
          <Clock className="w-4 h-4" /> Received Orders ({shopOrders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('delivery_settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'delivery_settings'
              ? 'bg-[#126B45] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Truck className="w-4 h-4" /> Local Delivery Zones
        </button>
      </div>

      {/* TAB 1: INVENTORY & STOCK MANAGEMENT (Section 5, 8, 9, 10) */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                Shop Inventory & Product Management
              </h3>
              <p className="text-xs text-gray-500">
                Edit products, update prices, adjust stock, upload multiple images, or mark items Available / Out of Stock
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('add_product')}
              className="self-start sm:self-auto px-3.5 py-1.5 bg-[#126B45] hover:bg-[#0e5235] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <PackagePlus className="w-4 h-4" /> + Add New Product
            </button>
          </div>

          {/* Desktop Table View */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hidden sm:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Selling Price</th>
                    <th className="p-3">Available Stock</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {shopProducts.map((p) => {
                    const isOut = p.status === 'out_of_stock' || p.availableStock <= 0;
                    const isLow = !isOut && p.availableStock <= p.lowStockThreshold;

                    return (
                      <tr key={p.id} className="hover:bg-gray-50/80 transition">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-200"
                            />
                            <div>
                              <div className="font-bold text-gray-900 line-clamp-1">{p.name}</div>
                              {p.nameUrdu && (
                                <div className="font-urdu text-[11px] text-[#126B45] font-semibold">{p.nameUrdu}</div>
                              )}
                              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-0.5">
                                <span>SKU: {p.sku}</span>
                                {p.images && p.images.length > 1 && (
                                  <span>• 📷 {p.images.length} photos</span>
                                )}
                                {p.hasVariants && (
                                  <span>• 🏷️ {p.variants?.length} variants</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-medium text-gray-600">{p.category}</td>
                        <td className="p-3 font-bold text-[#126B45]">
                          Rs. {p.price.toLocaleString()} / {p.unit}
                        </td>
                        <td className="p-3 font-bold text-gray-800">
                          {p.availableStock} {p.unit}
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => handleToggleStockStatus(p)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition flex items-center gap-1 ${
                              isOut
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : isLow
                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                : 'bg-emerald-100 text-[#126B45] hover:bg-emerald-200'
                            }`}
                            title="Click to toggle In Stock / Out of Stock"
                          >
                            <Power className="w-3 h-3" />
                            {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingProduct(p)}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#126B45] font-bold rounded-lg text-[11px] transition flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickRestock(p, 10)}
                              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded text-[11px] transition"
                              title="Restock +10 units"
                            >
                              +10
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Responsive Cards View (sm:hidden) */}
          <div className="grid grid-cols-1 gap-3 sm:hidden">
            {shopProducts.map((p) => {
              const isOut = p.status === 'out_of_stock' || p.availableStock <= 0;
              return (
                <div
                  key={p.id}
                  className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs space-y-2.5"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-14 h-14 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-gray-900 text-sm leading-tight line-clamp-1">{p.name}</div>
                      {p.nameUrdu && (
                        <div className="font-urdu text-xs text-[#126B45] font-semibold">{p.nameUrdu}</div>
                      )}
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="font-black text-[#126B45]">Rs. {p.price} / {p.unit}</span>
                        <span className="text-gray-600 font-bold">Stock: {p.availableStock}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleStockStatus(p)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        isOut ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-[#126B45]'
                      }`}
                    >
                      {isOut ? '● Out of Stock' : '● Available'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleQuickRestock(p, 10)}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-[11px] font-bold"
                      >
                        +10
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(p)}
                        className="px-2.5 py-1 bg-emerald-50 text-[#126B45] rounded-lg text-[11px] font-bold flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1 text-red-500 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ADD PRODUCT & VARIANTS (Section 8 & 9) */}
      {activeTab === 'add_product' && (
        <form onSubmit={handleCreateProduct} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-5 text-xs">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">
            List a New Product in {currentShop?.shopName}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Product Title (English)</label>
              <input
                type="text"
                required
                placeholder="e.g. Fresh Red Tomatoes, Farm Milk, Lawn Kurti"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Product Title in Urdu (اردو میں نام)</label>
              <input
                type="text"
                placeholder="مثلاً: تازہ لال ٹماٹر، دیسی گھی"
                value={nameUrdu}
                onChange={(e) => setNameUrdu(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-urdu text-sm focus:ring-2 focus:ring-[#126B45]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
              >
                <option value="Grocery and Fresh Food">Grocery and Fresh Food</option>
                <option value="Women's Fashion">Women&apos;s Fashion</option>
                <option value="Licensed pharmacy products">Licensed pharmacy products</option>
                <option value="Authorized LPG services">Authorized LPG services</option>
                <option value="Drinking water">Drinking water</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Selling Price (Rs.)</label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Measurement Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as UnitType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="g">Gram (g)</option>
                <option value="litre">Litre</option>
                <option value="ml">Millilitre</option>
                <option value="piece">Piece</option>
                <option value="packet">Packet</option>
                <option value="dozen">Dozen</option>
                <option value="bottle">Bottle</option>
                <option value="box">Box</option>
                <option value="pair">Pair</option>
                <option value="meter">Meter</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Available Stock ({unit})</label>
              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Low-Stock Alert Level</label>
              <input
                type="number"
                min="1"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Weight per unit in Kg</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
              />
              <span className="text-[10px] text-gray-500">Counts towards customer &gt;10 kg free delivery</span>
            </div>
          </div>

          {/* Multiple Product Images & Cropping */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-bold text-gray-800 block text-xs">Product Images & Gallery (Multiple Photos)</label>
                <span className="text-[10px] text-gray-500">Upload multiple angles, colors, or closeups. Adjust with built-in cropper.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCropperTarget('add_product');
                  setCropperRatio('4:3');
                  setCropperInitialUrl(productImages[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80');
                  setCropperOpen(true);
                }}
                className="px-3 py-1.5 bg-emerald-50 text-[#126B45] hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Crop className="w-3.5 h-3.5" /> + Crop / Add Photo
              </button>
            </div>

            {/* Thumbnail Preview Strip */}
            <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200 min-h-[60px]">
              {productImages.map((img, idx) => (
                <div key={idx} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-gray-300 bg-white">
                  <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      const filtered = productImages.filter((_, i) => i !== idx);
                      setProductImages(filtered);
                      if (filtered[0]) setImageUrl(filtered[0]);
                    }}
                    className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded p-0.5 opacity-90 hover:opacity-100"
                    title="Remove"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-emerald-800 text-[8px] text-white text-center font-bold py-0.2">
                      Main
                    </span>
                  )}
                </div>
              ))}

              <div className="flex-1 min-w-[200px]">
                <div className="flex gap-1.5">
                  <input
                    type="url"
                    placeholder="Or paste direct image URL here..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (imageUrl && !productImages.includes(imageUrl)) {
                        setProductImages([...productImages, imageUrl]);
                      }
                    }}
                    className="px-2.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Colours & Sizes & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Available Colors</label>
              <input
                type="text"
                placeholder="e.g. Red, Blue, Black (comma-separated)"
                value={productColors}
                onChange={(e) => setProductColors(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Available Sizes</label>
              <input
                type="text"
                placeholder="e.g. S, M, L, XL or Standard (comma-separated)"
                value={productSizes}
                onChange={(e) => setProductSizes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Availability Status</label>
              <select
                value={productStatus}
                onChange={(e) => setProductStatus(e.target.value as 'active' | 'out_of_stock')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45] font-semibold"
              >
                <option value="active">In Stock / Available</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Variants section (Section 9) */}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="hasVariantsCheck"
                checked={hasVariants}
                onChange={(e) => setHasVariants(e.target.checked)}
                className="rounded text-[#126B45] focus:ring-[#126B45]"
              />
              <label htmlFor="hasVariantsCheck" className="font-bold text-gray-800">
                This product has color or size variations (e.g. Handbag in Red/Black, Kurtis in M/L)
              </label>
            </div>

            {hasVariants && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                <div className="font-bold text-gray-700">Add Product Variants:</div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <input
                    type="text"
                    placeholder="Color (e.g. Red, Black)"
                    value={vColor}
                    onChange={(e) => setVColor(e.target.value)}
                    className="px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Size (e.g. Medium, Large)"
                    value={vSize}
                    onChange={(e) => setVSize(e.target.value)}
                    className="px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white"
                  />
                  <input
                    type="number"
                    placeholder="Price (Rs.)"
                    value={vPrice}
                    onChange={(e) => setVPrice(Number(e.target.value))}
                    className="px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={vStock}
                    onChange={(e) => setVStock(Number(e.target.value))}
                    className="px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="px-3 py-1.5 bg-[#126B45] text-white rounded-lg font-bold hover:bg-[#0e5235] transition"
                  >
                    + Add Variant
                  </button>
                </div>

                {variantsList.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {variantsList.map((vr) => (
                      <div
                        key={vr.id}
                        className="bg-white p-2 rounded-lg border border-gray-200 flex items-center justify-between"
                      >
                        <div>
                          <strong className="text-gray-900">{vr.name}</strong> • Rs. {vr.price} • {vr.stock} in stock
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(vr.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#126B45] hover:bg-[#0e5235] text-white font-bold rounded-xl transition shadow"
            >
              Publish Product to My Shop
            </button>
          </div>
        </form>
      )}

      {/* TAB: SHOP PROFILE & DETAILS MANAGEMENT (PRD Sections 4 & 5) */}
      {activeTab === 'shop_profile' && (
        <form onSubmit={handleSaveShopProfileInDashboard} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                <Store className="w-4 h-4 text-[#126B45]" />
                Shop Profile & Settings (PRD Sections 4 & 5)
              </h3>
              <p className="text-gray-500">
                Update shop details, change logo and cover photo with crop/zoom, configure hours, and activate or deactivate shop.
              </p>
            </div>
            {shopProfileSaved && (
              <span className="bg-emerald-100 text-[#126B45] font-bold px-3 py-1 rounded-lg flex items-center gap-1 self-start sm:self-auto">
                <Check className="w-3.5 h-3.5" /> Saved & Synchronized!
              </span>
            )}
          </div>

          {/* Shop Images (Logo + Cover) with Cropper */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            {/* Shop Logo */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-gray-800">1. Shop Logo (1:1 Square)</label>
                <button
                  type="button"
                  onClick={() => {
                    setCropperTarget('shop_logo');
                    setCropperRatio('1:1');
                    setCropperInitialUrl(shopLogoInput || currentShop?.logoUrl || '');
                    setCropperOpen(true);
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-[#126B45] border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition"
                >
                  <Crop className="w-3 h-3" /> Crop / Upload Logo
                </button>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={shopLogoInput || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'}
                  alt="Shop Logo Preview"
                  className="w-16 h-16 rounded-xl object-cover bg-white border border-gray-300 shadow-xs"
                />
                <input
                  type="text"
                  placeholder="Or enter logo image URL..."
                  value={shopLogoInput}
                  onChange={(e) => setShopLogoInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-[#126B45]"
                />
              </div>
            </div>

            {/* Shop Cover Banner */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-gray-800">2. Shop Cover Image (16:9 Banner)</label>
                <button
                  type="button"
                  onClick={() => {
                    setCropperTarget('shop_cover');
                    setCropperRatio('16:9');
                    setCropperInitialUrl(shopCoverInput || currentShop?.coverImageUrl || '');
                    setCropperOpen(true);
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-[#126B45] border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition"
                >
                  <Crop className="w-3 h-3" /> Crop / Upload Cover
                </button>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={shopCoverInput || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80'}
                  alt="Shop Cover Preview"
                  className="w-24 h-14 rounded-xl object-cover bg-white border border-gray-300 shadow-xs"
                />
                <input
                  type="text"
                  placeholder="Or enter cover image URL..."
                  value={shopCoverInput}
                  onChange={(e) => setShopCoverInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-[#126B45]"
                />
              </div>
            </div>
          </div>

          {/* Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Shop Name *</label>
              <input
                type="text"
                required
                value={shopNameInput}
                onChange={(e) => setShopNameInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#126B45]"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Owner Name *</label>
              <input
                type="text"
                required
                value={shopOwnerInput}
                onChange={(e) => setShopOwnerInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#126B45]"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Shop Category *</label>
              <select
                value={shopCategoryInput}
                onChange={(e) => setShopCategoryInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#126B45]"
              >
                <option value="Fruits">Fruits (پھل)</option>
                <option value="Vegetables">Vegetables (سبزیاں)</option>
                <option value="Fruits & Vegetables">Fruits & Vegetables (پھل اور سبزیاں)</option>
                <option value="Grocery Store">Grocery Store (کریانہ اسٹور)</option>
                <option value="Pharmacy">Pharmacy (فارمیسی)</option>
                <option value="Medical Store">Medical Store (میڈیکل اسٹور)</option>
                <option value="Clothes & Fashion">Clothes & Fashion (کپڑے اور فیشن)</option>
                <option value="Cosmetics">Cosmetics (کاسمیٹکس)</option>
                <option value="Shoes & Bags">Shoes & Bags (جوتے اور بیگز)</option>
                <option value="Electronics">Electronics (الیکٹرانکس)</option>
                <option value="Home Essentials">Home Essentials (گھریلو سامان)</option>
                <option value="Other Shops">Other Shops (دیگر دکانیں)</option>
              </select>
            </div>
          </div>

          {/* Location & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">City *</label>
              <select
                value={shopCityInput}
                onChange={(e) => setShopCityInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#126B45]"
              >
                <option value="Mithi">Mithi</option>
                <option value="Islamkot">Islamkot</option>
                <option value="Naukot">Naukot</option>
                <option value="Diplo">Diplo</option>
                <option value="Chachro">Chachro</option>
                <option value="Karachi">Karachi</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Area / Town *</label>
              <input
                type="text"
                placeholder="e.g. Shahi Bazaar, Main Chowk, Saddar"
                value={shopAreaInput}
                onChange={(e) => setShopAreaInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#126B45]"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Full Shop Address</label>
              <input
                type="text"
                value={shopAddressInput}
                onChange={(e) => setShopAddressInput(e.target.value)}
                placeholder="Shop #, Street, Landmark"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#126B45]"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Phone Number (+92)</label>
              <input
                type="tel"
                value={shopPhoneInput}
                onChange={(e) => setShopPhoneInput(e.target.value)}
                placeholder="03001234567"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#126B45]"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">WhatsApp Number</label>
              <input
                type="tel"
                value={shopWhatsappInput}
                onChange={(e) => setShopWhatsappInput(e.target.value)}
                placeholder="03001234567"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#126B45]"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={shopEmailInput}
                onChange={(e) => setShopEmailInput(e.target.value)}
                placeholder="shop@ghar365.pk"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#126B45]"
              />
            </div>
          </div>

          {/* Timings, Delivery & Activation Status */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Opening Hours</label>
              <input
                type="text"
                value={shopHoursOpenInput}
                onChange={(e) => setShopHoursOpenInput(e.target.value)}
                placeholder="08:00 AM"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Closing Hours</label>
              <input
                type="text"
                value={shopHoursCloseInput}
                onChange={(e) => setShopHoursCloseInput(e.target.value)}
                placeholder="10:00 PM"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Delivery Availability</label>
              <select
                value={shopDeliveryAvailableInput ? 'yes' : 'no'}
                onChange={(e) => setShopDeliveryAvailableInput(e.target.value === 'yes')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white font-semibold"
              >
                <option value="yes">Available for Home Delivery</option>
                <option value="no">Pickup Only / No Delivery</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Shop Status (Activate / Deactivate)</label>
              <button
                type="button"
                onClick={() => setShopIsOpenInput(!shopIsOpenInput)}
                className={`w-full px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  shopIsOpenInput
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                {shopIsOpenInput ? 'Shop is Active (Open)' : 'Shop is Closed (Deactivated)'}
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center">
            {currentShop && onOpenShopPreview && (
              <button
                type="button"
                onClick={() => onOpenShopPreview(currentShop)}
                className="text-[#126B45] hover:underline font-bold text-xs flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> View Public Storefront Preview
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#126B45] hover:bg-[#0e5235] text-white font-bold rounded-xl transition shadow flex items-center gap-1.5 ml-auto"
            >
              <Save className="w-4 h-4" /> Save Shop Profile
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: RECEIVED ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4 text-xs">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">
            Orders Received by {currentShop?.shopName}
          </h3>

          {shopOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 text-gray-500">
              No orders received yet. Once customers order from your shop, they will appear here.
            </div>
          ) : (
            <div className="space-y-3">
              {shopOrders.map((o) => (
                <div key={o.id} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2">
                    <div>
                      <div className="font-bold text-sm text-gray-900">{o.orderNumber}</div>
                      <div className="text-gray-500">
                        Customer: {o.customerName} ({o.customerPhone}) • Destination: {o.customerArea}, {o.customerCity}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-100 text-[#126B45] font-bold px-2 py-0.5 rounded-full capitalize">
                        {o.orderStatus.replace(/_/g, ' ')}
                      </span>
                      <span className="font-bold text-sm text-gray-900">Rs. {o.totalAmount}</span>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {o.items.map((i, idx) => (
                      <div key={idx} className="py-1 flex justify-between">
                        <span>
                          {i.productName} {i.variantName ? `(${i.variantName})` : ''} × {i.quantity} {i.unit}
                        </span>
                        <span className="font-medium">Rs. {i.totalPrice}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions for seller to advance order */}
                  <div className="bg-gray-50 p-2.5 rounded-xl flex flex-wrap items-center justify-between gap-2">
                    <span className="text-gray-500">
                      Payment: <strong>{o.paymentMethod.toUpperCase()}</strong> ({o.paymentStatus})
                    </span>

                    <div className="flex gap-2">
                      {o.orderStatus === 'payment_confirmed' && (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(o.id, 'seller_confirmed', 'Seller accepted order')}
                          className="px-3 py-1 bg-[#126B45] text-white rounded-lg font-bold hover:bg-[#0e5235]"
                        >
                          Confirm Order
                        </button>
                      )}
                      {(o.orderStatus === 'seller_confirmed' || o.orderStatus === 'placed') && (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(o.id, 'preparing', 'Seller packing items')}
                          className="px-3 py-1 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700"
                        >
                          Mark Preparing
                        </button>
                      )}
                      {o.orderStatus === 'preparing' && (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(o.id, 'ready_for_pickup', 'Packed and ready for rider')}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                        >
                          Ready for Rider Pickup
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: LOCAL DELIVERY ZONES CONFIGURATION (Section 11) */}
      {activeTab === 'delivery_settings' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
              Approved Local Delivery Areas & Fees (Section 11)
            </h3>
            {shopSaveNotice && (
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded">
                Saved Successfully!
              </span>
            )}
          </div>

          <p className="text-gray-600">
            Sellers configure specific neighborhood delivery zones within their city (<strong>{currentShop?.city}</strong>). Customers outside these zones will be notified and prevented from ordering.
          </p>

          <div className="space-y-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Approved Delivery Areas in {currentShop?.city} (comma-separated):
              </label>
              <textarea
                rows={3}
                value={deliveryAreasInput}
                onChange={(e) => setDeliveryAreasInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#126B45]"
              />
              <span className="text-[10px] text-gray-500">
                Example: Shahi Bazaar, Kashmir Chowk, Main Hospital Road, Saddar Mithi, Naukot Road
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Standard Delivery Fee (Rs.)</label>
                <input
                  type="number"
                  min="0"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#126B45]"
                />
                <span className="text-[10px] text-gray-500">Waived when order weight strictly &gt; 10 kg</span>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Delivery Radius (Kilometers)</label>
                <input
                  type="number"
                  min="1"
                  value={deliveryRadius}
                  onChange={(e) => setDeliveryRadius(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#126B45]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveDeliveryConfig}
                className="px-5 py-2 bg-[#126B45] hover:bg-[#0e5235] text-white font-bold rounded-xl transition shadow"
              >
                Save Delivery Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ABOUT OUR SHOP & PROMOTIONS (PRD Section 7) */}
      {activeTab === 'about_promotions' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#126B45]" />
                About Our Shop & Promotion Section (Section 7)
              </h3>
              <p className="text-gray-500">
                Manage promotional banners, shop introduction, special offers, and discount announcements for {currentShop?.shopName}
              </p>
            </div>
            {promoSaved && (
              <span className="bg-emerald-100 text-[#126B45] font-bold px-3 py-1 rounded-lg flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">About Shop Description</label>
              <textarea
                rows={3}
                value={aboutDesc}
                onChange={(e) => setAboutDesc(e.target.value)}
                placeholder="Describe your shop's mission, fresh sourcing, and quality promise..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Shop Introduction & Slogan</label>
              <input
                type="text"
                value={shopIntro}
                onChange={(e) => setShopIntro(e.target.value)}
                placeholder="e.g. Pure Desi Honey & Organic Farm Produce in Tharparkar"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Promotional Banner Image</label>
              <div className="flex items-center gap-3">
                <img
                  src={promoBanner}
                  alt="Banner Preview"
                  className="w-28 h-14 rounded-lg object-cover bg-gray-100 border border-gray-200"
                />
                <input
                  type="text"
                  value={promoBanner}
                  onChange={(e) => setPromoBanner(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>
              <div className="flex gap-2 pt-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setPromoBanner('/assets/aistudio/shop_smart_shop_local_9330ee28.png')}
                  className="text-[#126B45] hover:underline font-semibold"
                >
                  Preset: &quot;Shop Smart Shop Local&quot;
                </button>
                <span className="text-gray-300">•</span>
                <button
                  type="button"
                  onClick={() => setPromoBanner('/assets/aistudio/fast_reliable_delivery_e42af94e.png')}
                  className="text-[#126B45] hover:underline font-semibold"
                >
                  Preset: &quot;Fast Delivery&quot;
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Special Offers</label>
                <textarea
                  rows={2}
                  value={offers}
                  onChange={(e) => setOffers(e.target.value)}
                  placeholder="e.g. Free 1 kg potatoes on orders above Rs. 1500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Discount Announcements</label>
                <textarea
                  rows={2}
                  value={discountNotice}
                  onChange={(e) => setDiscountNotice(e.target.value)}
                  placeholder="e.g. Weekend Flash Sale: 10% off on pure milk"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126B45]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={async () => {
                  if (!currentShop) return;
                  const updated: Shop = {
                    ...currentShop,
                    aboutDescription: aboutDesc,
                    shopIntroduction: shopIntro,
                    promotionalBannerUrl: promoBanner,
                    specialOffers: offers,
                    discountAnnouncements: discountNotice,
                  };
                  await saveShop(updated);
                  setPromoSaved(true);
                  setTimeout(() => setPromoSaved(false), 2000);
                }}
                className="px-6 py-2.5 bg-[#126B45] hover:bg-[#0e5235] text-white font-bold rounded-xl transition shadow flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Promotions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          isOpen={!!editingProduct}
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={async (updated) => {
            await saveProduct(updated);
            setEditingProduct(null);
          }}
          onDelete={async (productId) => {
            await deleteProduct(productId);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Image Adjuster / Cropper Modal */}
      <ImageAdjusterModal
        isOpen={cropperOpen}
        onClose={() => setCropperOpen(false)}
        initialImageUrl={cropperInitialUrl}
        aspectRatio={cropperRatio}
        onSave={(dataUrl) => {
          handleCroppedSaveInDashboard(dataUrl);
          setCropperOpen(false);
        }}
      />
    </div>
  );
};
