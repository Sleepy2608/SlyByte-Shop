export interface WishlistItemResponse {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  salePrice: number;
  originalPrice: number;
  stockQuantity: number;
  thumbnail?: string;
  createdAt: string;
}
