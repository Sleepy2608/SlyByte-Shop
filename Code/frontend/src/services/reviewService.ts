import { api } from './api';
import { CreateReviewRequest, ProductReviewResponse, ProductReviewSummary } from '@/types/review.types';
import { PageResponse } from '@/types/product.types';

export const reviewService = {
  async getProductReviews(
    productId: number,
    page: number = 0,
    size: number = 10
  ): Promise<PageResponse<ProductReviewResponse>> {
    const response = await api.get<PageResponse<ProductReviewResponse>>(
      `/products/${productId}/reviews`,
      { params: { page, size } }
    );
    return response.data;
  },

  async getProductReviewSummary(productId: number): Promise<ProductReviewSummary> {
    const response = await api.get<ProductReviewSummary>(
      `/products/${productId}/reviews/summary`
    );
    return response.data;
  },

  async createReview(
    productId: number,
    data: CreateReviewRequest
  ): Promise<ProductReviewResponse> {
    const response = await api.post<ProductReviewResponse>(
      `/products/${productId}/reviews`,
      data
    );
    return response.data;
  },
};
