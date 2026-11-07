export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  productThumbnail: string | null;
  brandName?: string | null;
  categoryName?: string | null;
  price: number;
  currentPrice: number;
  quantity: number;
  subtotal: number;
  stockQuantity: number;
  status: string;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface AddToCartPayload {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

