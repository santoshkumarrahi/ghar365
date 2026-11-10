import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { Product, Shop, Order, AppSettings, PaymentVerificationRecord, Rider } from '../types';
import { INITIAL_APP_SETTINGS, INITIAL_SHOPS, INITIAL_PRODUCTS } from '../data/seedData';

const STORAGE_KEYS = {
  SHOPS: 'ghar365_shops_v1',
  PRODUCTS: 'ghar365_products_v1',
  ORDERS: 'ghar365_orders_v1',
  SETTINGS: 'ghar365_settings_v1',
  RIDERS: 'ghar365_riders_v1',
  PAYMENTS: 'ghar365_payments_v1',
};

// Seed riders
const INITIAL_RIDERS: Rider[] = [
  {
    id: 'rider_farhan_mithi',
    userId: 'rider_farhan_user',
    fullName: 'Farhan Ali Soomro',
    phone: '+92 344 1122334',
    cnic: '44301-4455667-9',
    vehicleType: 'Motorcycle',
    vehiclePlate: 'THAR-7842',
    operationalProvince: 'Sindh',
    operationalCity: 'Mithi',
    operationalAreas: [
      'Shahi Bazaar',
      'Kashmir Chowk',
      'Main Hospital Road',
      'Saddar Mithi',
      'Naukot Road',
      'Sonar Colony',
      'Govt Degree College Area',
    ],
    isOnline: true,
    isApproved: true,
    activeDeliveriesCount: 0,
    totalDelivered: 142,
    totalEarnings: 21300,
    currentCodCollection: 0,
    createdAt: '2026-01-10T12:00:00Z',
  },
];

class StorageService {
  private isFirestoreReady: boolean = false;

  constructor() {
    this.init();
  }

  private async init() {
    // Check if we need to seed local storage first
    if (!localStorage.getItem(STORAGE_KEYS.SHOPS)) {
      localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(INITIAL_SHOPS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_APP_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RIDERS)) {
      localStorage.setItem(STORAGE_KEYS.RIDERS, JSON.stringify(INITIAL_RIDERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify([]));
    }
  }

  // --- SHOPS ---
  async getShops(): Promise<Shop[]> {
    try {
      const snap = await getDocs(collection(db, 'shops'));
      if (!snap.empty) {
        const shops = snap.docs.map((d) => d.data() as Shop);
        localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(shops));
        return shops;
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'shops');
    }
    // Fallback to localStorage / seed
    const local = localStorage.getItem(STORAGE_KEYS.SHOPS);
    return local ? JSON.parse(local) : INITIAL_SHOPS;
  }

  async saveShop(shop: Shop): Promise<void> {
    try {
      await setDoc(doc(db, 'shops', shop.id), shop);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `shops/${shop.id}`);
    }
    const current = await this.getShops();
    const idx = current.findIndex((s) => s.id === shop.id);
    if (idx >= 0) {
      current[idx] = shop;
    } else {
      current.push(shop);
    }
    localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(current));
  }

  async deleteShop(shopId: string): Promise<void> {
    try {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'shops', shopId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `shops/${shopId}`);
    }
    const current = await this.getShops();
    const filtered = current.filter((s) => s.id !== shopId);
    localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(filtered));
  }

  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    try {
      const snap = await getDocs(collection(db, 'products'));
      if (!snap.empty) {
        const products = snap.docs.map((d) => d.data() as Product);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        return products;
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'products');
    }
    const local = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return local ? JSON.parse(local) : INITIAL_PRODUCTS;
  }

  async saveProduct(product: Product): Promise<void> {
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `products/${product.id}`);
    }
    const current = await this.getProducts();
    const idx = current.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      current[idx] = product;
    } else {
      current.push(product);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(current));
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'products', productId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${productId}`);
    }
    const current = await this.getProducts();
    const filtered = current.filter((p) => p.id !== productId);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
  }

  async updateProductStock(productId: string, quantityToDeduct: number, variantId?: string): Promise<boolean> {
    const products = await this.getProducts();
    const p = products.find((item) => item.id === productId);
    if (!p) return false;

    if (variantId && p.variants) {
      const v = p.variants.find((vr) => vr.id === variantId);
      if (!v || v.stock < quantityToDeduct) return false;
      v.stock -= quantityToDeduct;
      // Also adjust parent availableStock
      p.availableStock = p.variants.reduce((acc, vr) => acc + vr.stock, 0);
    } else {
      if (p.availableStock < quantityToDeduct) return false;
      p.availableStock -= quantityToDeduct;
    }

    if (p.availableStock <= 0) {
      p.status = 'out_of_stock';
    } else if (p.availableStock <= p.lowStockThreshold) {
      p.status = 'low_stock';
    } else {
      p.status = 'active';
    }

    await this.saveProduct(p);
    return true;
  }

  // --- ORDERS ---
  async getOrders(): Promise<Order[]> {
    try {
      const snap = await getDocs(collection(db, 'orders'));
      if (!snap.empty) {
        const orders = snap.docs.map((d) => d.data() as Order);
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        return orders;
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'orders');
    }
    const local = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return local ? JSON.parse(local) : [];
  }

  async saveOrder(order: Order): Promise<void> {
    try {
      await setDoc(doc(db, 'orders', order.id), order);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `orders/${order.id}`);
    }
    const current = await this.getOrders();
    const idx = current.findIndex((o) => o.id === order.id);
    if (idx >= 0) {
      current[idx] = order;
    } else {
      current.unshift(order);
    }
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(current));
  }

  async updateOrderStatus(orderId: string, status: Order['orderStatus'], updatedBy: string, note?: string): Promise<void> {
    const orders = await this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    order.orderStatus = status;
    order.updatedAt = new Date().toISOString();
    order.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      updatedBy,
      note,
    });

    if (status === 'delivered' && order.paymentMethod === 'cod') {
      order.paymentStatus = 'verified';
    }

    await this.saveOrder(order);
  }

  // --- RIDERS ---
  async getRiders(): Promise<Rider[]> {
    try {
      const snap = await getDocs(collection(db, 'riders'));
      if (!snap.empty) {
        const riders = snap.docs.map((d) => d.data() as Rider);
        localStorage.setItem(STORAGE_KEYS.RIDERS, JSON.stringify(riders));
        return riders;
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'riders');
    }
    const local = localStorage.getItem(STORAGE_KEYS.RIDERS);
    return local ? JSON.parse(local) : INITIAL_RIDERS;
  }

  async saveRider(rider: Rider): Promise<void> {
    try {
      await setDoc(doc(db, 'riders', rider.id), rider);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `riders/${rider.id}`);
    }
    const current = await this.getRiders();
    const idx = current.findIndex((r) => r.id === rider.id);
    if (idx >= 0) {
      current[idx] = rider;
    } else {
      current.push(rider);
    }
    localStorage.setItem(STORAGE_KEYS.RIDERS, JSON.stringify(current));
  }

  // --- PAYMENT VERIFICATIONS ---
  async getPaymentVerifications(): Promise<PaymentVerificationRecord[]> {
    try {
      const snap = await getDocs(collection(db, 'payment_verifications'));
      if (!snap.empty) {
        const records = snap.docs.map((d) => d.data() as PaymentVerificationRecord);
        localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(records));
        return records;
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'payment_verifications');
    }
    const local = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return local ? JSON.parse(local) : [];
  }

  async savePaymentVerification(record: PaymentVerificationRecord): Promise<void> {
    try {
      await setDoc(doc(db, 'payment_verifications', record.id), record);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `payment_verifications/${record.id}`);
    }
    const current = await this.getPaymentVerifications();
    const idx = current.findIndex((p) => p.id === record.id);
    if (idx >= 0) {
      current[idx] = record;
    } else {
      current.unshift(record);
    }
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(current));
  }

  // --- SETTINGS ---
  async getSettings(): Promise<AppSettings> {
    try {
      const snap = await getDocs(collection(db, 'settings'));
      if (!snap.empty) {
        const s = snap.docs[0].data() as AppSettings;
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(s));
        return s;
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'settings');
    }
    const local = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return local ? JSON.parse(local) : INITIAL_APP_SETTINGS;
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await setDoc(doc(db, 'settings', settings.id), settings);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `settings/${settings.id}`);
    }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // Reset to initial test state
  async resetToDemoState(): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(INITIAL_SHOPS));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_APP_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.RIDERS, JSON.stringify(INITIAL_RIDERS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify([]));
  }
}

export const storage = new StorageService();
