export interface ProductReviewResponse {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface ProductReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingCounts: Record<number, number>;
}

export interface CreateReviewRequest {
  rating: number;
  comment: string;
}
