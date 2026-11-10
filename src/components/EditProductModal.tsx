import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Trash2,
  Plus,
  Image as ImageIcon,
  Crop,
  AlertTriangle,
  Check,
  Scale,
  DollarSign,
  Boxes,
  Tag,
  Palette,
  Maximize2,
} from 'lucide-react';
import { Product, ProductVariant, UnitType } from '../types';
import { ImageAdjusterModal } from './ImageAdjusterModal';

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => Promise<void>;
  onDelete?: (productId: string) => Promise<void>;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  if (!isOpen || !product) return null;

  const [name, setName] = useState(product.name);
  const [nameUrdu, setNameUrdu] = useState(product.nameUrdu || '');
  const [description, setDescription] = useState(product.description || '');
  const [category, setCategory] = useState(product.category);
  const [subcategory, setSubcategory] = useState(product.subcategory || '');
  const [price, setPrice] = useState<number>(product.price);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(product.discountPrice);
  const [unit, setUnit] = useState<UnitType>(product.unit);
  const [stock, setStock] = useState<number>(product.availableStock);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(product.lowStockThreshold || 10);
  const [weightKg, setWeightKg] = useState<number>(product.weightKg || 1);
  const [isWeightEligible, setIsWeightEligible] = useState<boolean>(product.isWeightEligible ?? false);
  const [status, setStatus] = useState<Product['status']>(product.status);

  // Multiple Images State
  const [images, setImages] = useState<string[]>(() => {
    if (product.images && product.images.length > 0) return product.images;
    return product.imageUrl ? [product.imageUrl] : [];
  });
  const [primaryImageUrl, setPrimaryImageUrl] = useState<string>(product.imageUrl);

  // Colors & Sizes
  const [colorsStr, setColorsStr] = useState<string>(product.colors?.join(', ') || '');
  const [sizesStr, setSizesStr] = useState<string>(product.sizes?.join(', ') || '');

  // Variants
  const [hasVariants, setHasVariants] = useState<boolean>(product.hasVariants || false);
  const [variantsList, setVariantsList] = useState<ProductVariant[]>(product.variants || []);

  // Temporary Variant State
  const [vColor, setVColor] = useState('');
  const [vSize, setVSize] = useState('');
  const [vPrice, setVPrice] = useState<number>(product.price);
  const [vStock, setVStock] = useState<number>(10);
  const [vImage, setVImage] = useState<string>('');

  // Image Adjuster Modal State
  const [isAdjusterOpen, setIsAdjusterOpen] = useState(false);
  const [adjustingImageIndex, setAdjustingImageIndex] = useState<number | null>(null);
  const [isAdjustingPrimary, setIsAdjustingPrimary] = useState(false);

  // Delete confirmation
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync when product changes
  useEffect(() => {
    if (product) {
      setName(product.name);
      setNameUrdu(product.nameUrdu || '');
      setDescription(product.description || '');
      setCategory(product.category);
      setSubcategory(product.subcategory || '');
      setPrice(product.price);
      setDiscountPrice(product.discountPrice);
      setUnit(product.unit);
      setStock(product.availableStock);
      setLowStockThreshold(product.lowStockThreshold || 10);
      setWeightKg(product.weightKg || 1);
      setIsWeightEligible(product.isWeightEligible ?? false);
      setStatus(product.status);
      setImages(product.images && product.images.length > 0 ? product.images : [product.imageUrl]);
      setPrimaryImageUrl(product.imageUrl);
      setColorsStr(product.colors?.join(', ') || '');
      setSizesStr(product.sizes?.join(', ') || '');
      setHasVariants(product.hasVariants || false);
      setVariantsList(product.variants || []);
      setConfirmDelete(false);
    }
  }, [product]);

  const handleAddImage = (newUrl: string) => {
    if (!newUrl) return;
    setImages((prev) => [...prev, newUrl]);
    if (!primaryImageUrl) setPrimaryImageUrl(newUrl);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (primaryImageUrl === prev[index] && updated.length > 0) {
        setPrimaryImageUrl(updated[0]);
      }
      return updated;
    });
  };

  const handleOpenCropperForImage = (index: number) => {
    setAdjustingImageIndex(index);
    setIsAdjustingPrimary(false);
    setIsAdjusterOpen(true);
  };

  const handleOpenCropperForPrimary = () => {
    setIsAdjustingPrimary(true);
    setAdjustingImageIndex(null);
    setIsAdjusterOpen(true);
  };

  const handleCroppedSave = (croppedDataUrl: string) => {
    if (isAdjustingPrimary) {
      setPrimaryImageUrl(croppedDataUrl);
      if (!images.includes(croppedDataUrl)) {
        setImages((prev) => [croppedDataUrl, ...prev]);
      }
    } else if (adjustingImageIndex !== null && adjustingImageIndex >= 0) {
      setImages((prev) => {
        const updated = [...prev];
        updated[adjustingImageIndex] = croppedDataUrl;
        return updated;
      });
      if (primaryImageUrl === images[adjustingImageIndex]) {
        setPrimaryImageUrl(croppedDataUrl);
      }
    } else {
      handleAddImage(croppedDataUrl);
    }
  };

  const handleAddVariant = () => {
    if (!vColor && !vSize) {
      alert('Please enter at least a Color or Size for this variant.');
      return;
    }
    const newV: ProductVariant = {
      id: `var_${Date.now()}`,
      sku: `VAR-${Date.now().toString().slice(-4)}`,
      name: [vSize, vColor].filter(Boolean).join(' / '),
      color: vColor || undefined,
      size: vSize || undefined,
      price: Number(vPrice),
      stock: Number(vStock),
      imageUrl: vImage || primaryImageUrl,
    };
    setVariantsList([...variantsList, newV]);
    setVColor('');
    setVSize('');
  };

  const handleRemoveVariant = (id: string) => {
    setVariantsList(variantsList.filter((v) => v.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const colors = colorsStr
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const sizes = sizesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const currentAvailableStock = hasVariants
      ? variantsList.reduce((acc, v) => acc + v.stock, 0)
      : Number(stock);

    const updatedProduct: Product = {
      ...product,
      name,
      nameUrdu: nameUrdu.trim() || undefined,
      description,
      category,
      subcategory: subcategory.trim() || undefined,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      unit,
      availableStock: currentAvailableStock,
      lowStockThreshold: Number(lowStockThreshold),
      weightKg: Number(weightKg),
      isWeightEligible: Boolean(isWeightEligible),
      status: currentAvailableStock <= 0 ? 'out_of_stock' : status === 'out_of_stock' ? 'active' : status,
      imageUrl: primaryImageUrl || images[0] || product.imageUrl,
      images: images.length > 0 ? images : [primaryImageUrl || product.imageUrl],
      colors: colors.length > 0 ? colors : undefined,
      sizes: sizes.length > 0 ? sizes : undefined,
      hasVariants,
      variants: hasVariants ? variantsList : undefined,
    };

    await onSave(updatedProduct);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden text-xs">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#126B45] text-white flex items-center justify-center font-bold shadow-xs">
              <Boxes className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Edit Product & Inventory</h3>
              <p className="text-[11px] text-gray-500">
                Update details, stock availability, pricing, colours, sizes, and multiple photos
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-800 block mb-1">Product Title (English) *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-[#126B45]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">Product Title in Urdu (اردو میں نام)</label>
              <input
                type="text"
                value={nameUrdu}
                onChange={(e) => setNameUrdu(e.target.value)}
                placeholder="مثلاً: تازہ ٹماٹر، کڑھائی والی کرتی"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-urdu text-sm focus:ring-2 focus:ring-[#126B45]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-gray-800 block mb-1">Product Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-[#126B45]"
            />
          </div>

          {/* Categories & Units */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-gray-800 block mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-medium text-gray-900 focus:ring-2 focus:ring-[#126B45]"
              >
                <option value="Grocery and Fresh Food">Grocery and Fresh Food</option>
                <option value="Fruits">Fruits</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                <option value="Clothes & Fashion">Clothes & Fashion</option>
                <option value="Women's Fashion">Women&apos;s Fashion</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Medical Store">Medical Store</option>
                <option value="Licensed pharmacy products">Licensed Pharmacy Products</option>
                <option value="Grocery Store">Grocery Store</option>
                <option value="Cosmetics">Cosmetics</option>
                <option value="Shoes & Bags">Shoes & Bags</option>
                <option value="Electronics">Electronics</option>
                <option value="Home Essentials">Home Essentials</option>
                <option value="Authorized LPG services">Authorized LPG Services</option>
                <option value="Drinking water">Pure Drinking Water</option>
                <option value="Other Shops">Other Shops</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">Subcategory / Tag</label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g. Vegetables, Handbags, Cotton"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">Measuring Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as UnitType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-semibold"
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="g">Gram (g)</option>
                <option value="litre">Litre</option>
                <option value="piece">Piece / Item</option>
                <option value="packet">Packet</option>
                <option value="dozen">Dozen</option>
                <option value="pair">Pair</option>
                <option value="box">Box</option>
                <option value="meter">Meter</option>
              </select>
            </div>
          </div>

          {/* Pricing & Stock Management (PRD Section 5) */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <h4 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#126B45]" />
              Pricing, Inventory & Stock Status
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Price (Rs.) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Discount Price (Rs.)</label>
                <input
                  type="number"
                  min="0"
                  value={discountPrice || ''}
                  onChange={(e) => setDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Optional"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Available Stock *</label>
                <input
                  type="number"
                  min="0"
                  required
                  disabled={hasVariants}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold text-gray-900 disabled:bg-gray-200"
                />
                {hasVariants && <span className="text-[10px] text-gray-500">Auto-summed from variants</span>}
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Stock Availability</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold"
                >
                  <option value="active">Available (In Stock)</option>
                  <option value="out_of_stock">Mark Out of Stock</option>
                  <option value="low_stock">Low Stock Warning</option>
                  <option value="inactive">Hidden (Inactive)</option>
                </select>
              </div>
            </div>

            {/* Weight parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="weightEligibleCheck"
                  checked={isWeightEligible}
                  onChange={(e) => setIsWeightEligible(e.target.checked)}
                  className="rounded text-[#126B45] focus:ring-[#126B45]"
                />
                <label htmlFor="weightEligibleCheck" className="text-gray-800 font-semibold cursor-pointer">
                  Counts toward &gt;10 kg Free Delivery Rule
                </label>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-semibold shrink-0">Weight per {unit} (kg):</span>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-24 px-2.5 py-1 border border-gray-300 rounded-lg font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Multiple Product Images Management (PRD Section 5 & 6) */}
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#126B45]" />
                  Product Images Gallery ({images.length} photos)
                </h4>
                <p className="text-[11px] text-gray-500">
                  Upload multiple angles, colors, and close-ups. Crop, zoom, and reposition.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAdjustingPrimary(false);
                  setAdjustingImageIndex(null);
                  setIsAdjusterOpen(true);
                }}
                className="px-3 py-1.5 bg-[#126B45] hover:bg-[#0e5235] text-white rounded-lg font-bold flex items-center gap-1.5 transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add & Crop Photo
              </button>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {images.map((img, idx) => {
                const isPrimary = img === primaryImageUrl;
                return (
                  <div
                    key={idx}
                    className={`relative rounded-xl overflow-hidden border p-1 bg-white flex flex-col justify-between ${
                      isPrimary ? 'ring-2 ring-[#126B45] border-[#126B45]' : 'border-gray-200'
                    }`}
                  >
                    <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100 relative group">
                      <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                      {isPrimary && (
                        <span className="absolute top-1 left-1 bg-[#126B45] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                          Main Photo
                        </span>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-1 text-[10px]">
                      {!isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimaryImageUrl(img)}
                          className="text-[#126B45] font-bold hover:underline"
                        >
                          Make Main
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenCropperForImage(idx)}
                        className="text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-0.5"
                        title="Crop / Zoom"
                      >
                        <Crop className="w-3 h-3 text-[#126B45]" /> Crop
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="text-red-600 hover:text-red-800"
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Colours & Sizes (PRD Section 5) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1.5">
              <label className="font-bold text-gray-800 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-600" /> Available Colours
              </label>
              <input
                type="text"
                value={colorsStr}
                onChange={(e) => setColorsStr(e.target.value)}
                placeholder="e.g. Red, Black, White, Navy Blue"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
              />
              <span className="text-[10px] text-gray-500">Comma-separated color choices</span>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1.5">
              <label className="font-bold text-gray-800 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-blue-600" /> Available Sizes
              </label>
              <input
                type="text"
                value={sizesStr}
                onChange={(e) => setSizesStr(e.target.value)}
                placeholder="e.g. Small, Medium, Large, XL, Free Size"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
              />
              <span className="text-[10px] text-gray-500">Comma-separated sizing options</span>
            </div>
          </div>

          {/* Variants Management */}
          <div className="border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableVariantsModal"
                  checked={hasVariants}
                  onChange={(e) => setHasVariants(e.target.checked)}
                  className="rounded text-[#126B45] focus:ring-[#126B45]"
                />
                <label htmlFor="enableVariantsModal" className="font-bold text-gray-900 cursor-pointer">
                  Product Has Specific SKU Variants (Color / Size / Individual Stock)
                </label>
              </div>
            </div>

            {hasVariants && (
              <div className="space-y-3 pt-2">
                {/* Variant Creation Row */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-gray-50 p-3 rounded-xl">
                  <div>
                    <label className="text-[10px] text-gray-500 block">Color</label>
                    <input
                      type="text"
                      placeholder="e.g. Red"
                      value={vColor}
                      onChange={(e) => setVColor(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block">Size</label>
                    <input
                      type="text"
                      placeholder="e.g. Medium"
                      value={vSize}
                      onChange={(e) => setVSize(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block">Price (Rs.)</label>
                    <input
                      type="number"
                      value={vPrice}
                      onChange={(e) => setVPrice(Number(e.target.value))}
                      className="w-full px-2 py-1 border border-gray-300 rounded font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block">Stock Qty</label>
                    <input
                      type="number"
                      value={vStock}
                      onChange={(e) => setVStock(Number(e.target.value))}
                      className="w-full px-2 py-1 border border-gray-300 rounded font-bold"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex items-end">
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>

                {/* Variants List Table */}
                {variantsList.length > 0 && (
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-left">
                      <thead className="bg-gray-100 text-[10px] text-gray-600 uppercase">
                        <tr>
                          <th className="p-2">Variant</th>
                          <th className="p-2">SKU</th>
                          <th className="p-2">Price</th>
                          <th className="p-2">Stock</th>
                          <th className="p-2">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {variantsList.map((v) => (
                          <tr key={v.id}>
                            <td className="p-2 font-bold text-gray-800">{v.name}</td>
                            <td className="p-2 font-mono text-[10px] text-gray-500">{v.sku}</td>
                            <td className="p-2 font-bold text-[#126B45]">Rs. {v.price}</td>
                            <td className="p-2">
                              <span
                                className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                  v.stock <= 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-[#126B45]'
                                }`}
                              >
                                {v.stock > 0 ? `${v.stock} in stock` : 'Out of stock'}
                              </span>
                            </td>
                            <td className="p-2">
                              <button
                                type="button"
                                onClick={() => handleRemoveVariant(v.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Delete Confirmation Box */}
          {confirmDelete && onDelete && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-red-800 font-bold">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Are you sure you want to permanently delete &quot;{product.name}&quot;?
              </div>
              <p className="text-[11px] text-red-700">
                This item will be removed from your shop inventory and will no longer appear to customers.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1 bg-white border border-gray-300 rounded font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await onDelete(product.id);
                    onClose();
                  }}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Confirm Permanent Delete
                </button>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            {onDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-bold flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-4 h-4" /> Delete Product
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-[#126B45] hover:bg-[#0e5235] text-white font-bold rounded-xl transition shadow flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Product Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Image Cropper & Adjuster Modal */}
      <ImageAdjusterModal
        isOpen={isAdjusterOpen}
        onClose={() => setIsAdjusterOpen(false)}
        initialImageUrl={
          isAdjustingPrimary
            ? primaryImageUrl
            : adjustingImageIndex !== null
            ? images[adjustingImageIndex]
            : ''
        }
        aspectRatio="4:3"
        title="Crop & Adjust Product Photo"
        onSave={handleCroppedSave}
        presetImages={[
          { label: 'Fresh Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80' },
          { label: 'Farm Apples', url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80' },
          { label: 'Red Handbag', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80' },
          { label: 'Lawn Kurti', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
        ]}
      />
    </div>
  );
};
