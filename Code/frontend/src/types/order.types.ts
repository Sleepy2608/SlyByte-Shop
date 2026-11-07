export type PaymentMethod = 'COD' | 'BANK_TRANSFER' | 'VNPAY' | 'MOMO';

export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productThumb: string | null;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderDetail {
  id: number;
  orderCode: string;
  userId: number;
  recipientName: string;
  phone: string;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes?: string | null;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderSummary {
  id: number;
  orderCode: string;
  recipientName: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  totalItems: number;
  createdAt: string;
}

export interface CheckoutPayload {
  recipientName: string;
  phone: string;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

