export type UserRole = 'customer' | 'seller' | 'rider' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  fullName: string;
  role: UserRole;
  province: string;
  district: string;
  city: string;
  area: string;
  address: string;
  cnic?: string;
  status: 'active' | 'pending' | 'suspended';
  shopId?: string;
  createdAt: string;
}

export type UnitType = 
  | 'kg' 
  | 'g' 
  | 'litre' 
  | 'ml' 
  | 'piece' 
  | 'packet' 
  | 'dozen' 
  | 'bottle' 
  | 'box' 
  | 'pair' 
  | 'set' 
  | 'meter';

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  color?: string;
  size?: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export interface Product {
  id: string;
  shopId: string;
  shopName: string;
  name: string;
  nameUrdu?: string;
  description: string;
  category: string;
  subcategory?: string;
  brand?: string;
  sku: string;
  price: number;
  discountPrice?: number;
  unit: UnitType;
  minQuantity: number;
  maxQuantity: number;
  availableStock: number;
  lowStockThreshold: number;
  weightKg: number; // weight per unit for delivery calculation
  isWeightEligible: boolean; // whether weight counts toward free delivery
  hasVariants: boolean;
  variants?: ProductVariant[];
  imageUrl: string;
  images?: string[]; // Multiple product images support
  colors?: string[]; // Multiple product colors support
  sizes?: string[]; // Multiple product sizes support
  status: 'active' | 'low_stock' | 'out_of_stock' | 'inactive';
  isPrescriptionRequired?: boolean;
  complianceCategory?: 'standard' | 'pharmacy' | 'lpg' | 'water';
  rating?: number;
  createdAt: string;
}

export interface Shop {
  id: string;
  ownerId: string;
  ownerName: string;
  shopName: string;
  logoUrl?: string;
  coverImageUrl?: string;
  phone: string;
  whatsappNumber?: string;
  email?: string;
  cnic: string;
  category: string;
  description?: string;
  province: string;
  district: string;
  city: string;
  area: string;
  address: string;
  locationCoordinates?: string;
  openingHours?: string;
  closingHours?: string;
  deliveryAvailability?: boolean;
  deliveryAreas: string[]; // List of areas in the city this shop delivers to
  deliveryRadiusKm: number;
  deliveryFee: number;
  minOrderValue: number;
  deliveryHours: string;
  imageUrl: string; // fallback / main display image
  verificationStatus: 'pending' | 'under_review' | 'verified' | 'rejected' | 'suspended';
  complianceCategory: 'standard' | 'lpg' | 'pharmacy' | 'water';
  licenseNumber?: string;
  rating: number;
  totalOrders: number;
  isOpen: boolean;
  // About & Promotion Section (PRD Section 7)
  aboutDescription?: string;
  shopIntroduction?: string;
  promotionalBannerUrl?: string;
  specialOffers?: string;
  discountAnnouncements?: string;
  featuredProductIds?: string[];
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  shopId: string;
  shopName: string;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number; // can be float like 1.5, 2.0
  unitPrice: number;
  totalPrice: number;
  totalWeightKg: number;
}

export type OrderStatus =
  | 'placed'
  | 'payment_verification_pending'
  | 'payment_confirmed'
  | 'seller_confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'rider_assigned'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'rejected'
  | 'cancelled';

export type PaymentMethod = 'easypaisa' | 'jazzcash' | 'cod';
export type PaymentStatus = 'pending' | 'verification_pending' | 'verified' | 'rejected';

export interface OrderItem {
  productId: string;
  productName: string;
  unit: UnitType;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variantName?: string;
  weightKg: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerArea: string;
  customerAddress: string;
  shopId: string;
  shopName: string;
  shopCity: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalWeightKg: number;
  isFreeDelivery: boolean;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  paymentEvidenceUrl?: string;
  orderStatus: OrderStatus;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  deliveryOtp: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
    updatedBy: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Rider {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  cnic: string;
  vehicleType: 'Motorcycle' | 'Bicycle' | 'Rickshaw' | 'Van';
  vehiclePlate: string;
  operationalProvince: string;
  operationalCity: string;
  operationalAreas: string[];
  isOnline: boolean;
  isApproved: boolean;
  activeDeliveriesCount: number;
  totalDelivered: number;
  totalEarnings: number;
  currentCodCollection: number;
  createdAt: string;
}

export interface PaymentVerificationRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: PaymentMethod;
  transactionReference: string;
  amount: number;
  evidenceUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface AppSettings {
  id: string;
  platformName: string;
  taglineUrdu: string;
  taglineEnglish: string;
  freeDeliveryThresholdKg: number; // strictly > 10 kg
  defaultDeliveryFee: number;
  intercityEnabled: boolean; // default false
  commissionRatePercent: number; // default 5%
  easypaisaAccountTitle: string;
  easypaisaAccountNumber: string;
  jazzcashAccountTitle: string;
  jazzcashAccountNumber: string;
  operationalCities: string[];
  updatedAt: string;
}

export interface LocationHierarchy {
  country: string;
  provinces: {
    name: string;
    divisions: {
      name: string;
      districts: {
        name: string;
        cities: {
          name: string;
          areas: string[];
        }[];
      }[];
    }[];
  }[];
}
