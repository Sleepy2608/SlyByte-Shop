import { OrderStatus } from './order.types';
import { ProductStatus } from './product.types';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  outOfStockProducts: number;
}

export interface AdminProductPayload {
  name: string;
  slug?: string;
  categoryId: number;
  brandId: number;
  originalPrice: number;
  salePrice: number;
  stockQuantity: number;
  thumbnail?: string;
  description?: string;
  status?: ProductStatus;
  specs?: {
    specGroup: string;
    specKey: string;
    specValue: string;
  }[];
}

export interface AdminUpdateOrderStatusPayload {
  orderStatus: OrderStatus;
}

