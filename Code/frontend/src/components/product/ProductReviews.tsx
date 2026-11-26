'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ProductReviewResponse, ProductReviewSummary } from '@/types/review.types';
import { reviewService } from '@/services/reviewService';
import { RatingStars } from '@/components/ui/RatingStars';
import { IconBadgeCheck, IconMessageSquare } from '@/components/ui/Icons';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

interface ProductReviewsProps {
  productId: number;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const { isAuthenticated, user } = useAuthStore();
  const [reviews, setReviews] = useState<ProductReviewResponse[]>([]);
  const [summary, setSummary] = useState<ProductReviewSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  const loadReviewsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [reviewsData, summaryData] = await Promise.all([
        reviewService.getProductReviews(productId, 0, 10),
        reviewService.getProductReviewSummary(productId),
      ]);
      setReviews(reviewsData.items || []);
      setSummary(summaryData);
    } catch {
      setError('Không thể tải đánh giá sản phẩm.');
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadReviewsData();
  }, [loadReviewsData]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Vui lòng nhập nội dung nhận xét.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setFormSuccess(null);

    try {
      await reviewService.createReview(productId, {
        rating,
        comment: comment.trim(),
      });
      setFormSuccess('Gửi đánh giá thành công! Cảm ơn bạn đã đóng góp ý kiến.');
      setComment('');
      setRating(5);
      await loadReviewsData();
    } catch {
      setError('Không thể gửi đánh giá. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = summary?.totalReviews || 0;
  const avg = summary?.averageRating || 0;

  return (
    <section className="product-reviews-section" aria-label="Đánh giá sản phẩm">
      <div className="product-reviews-header">
        <div className="product-reviews-title-wrap">
          <span className="technical-eyebrow">FEEDBACK // MATRIX</span>
          <h2 className="product-reviews-heading">Đánh Giá & Nhận Xét Từ Khách Hàng</h2>
        </div>
      </div>

      {/* Review Summary Breakdown Matrix */}
      <div className="reviews-summary-grid">
        <div className="reviews-score-card">
          <div className="reviews-score-num tabular-nums">{avg.toFixed(1)}</div>
          <div className="reviews-score-stars">
            <RatingStars rating={avg} size={20} />
          </div>
          <div className="reviews-score-meta tabular-nums">
            Dựa trên {total} lượt đánh giá thực tế
          </div>
        </div>

        <div className="reviews-breakdown-card">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = summary?.ratingCounts?.[stars] || 0;
            const percent = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={stars} className="rating-bar-row">
                <span className="rating-bar-label tabular-nums">{stars} sao</span>
                <div className="rating-bar-track">
                  <div
                    className="rating-bar-fill"
                    style={{ width: `${percent}%` }}
                    role="progressbar"
                    aria-valuenow={percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <span className="rating-bar-count tabular-nums">
                  {count} ({percent}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form or Login Callout */}
      <div className="review-action-container">
        {isAuthenticated ? (
          <form className="review-form-card" onSubmit={handleSubmitReview}>
            <div className="review-form-header">
              <IconMessageSquare size={20} />
              <h3 className="review-form-title">
                Viết đánh giá của bạn ({user?.fullName || 'Khách hàng'})
              </h3>
            </div>

            {formSuccess && (
              <div className="form-alert form-alert-success" role="alert">
                {formSuccess}
              </div>
            )}

            {error && (
              <div className="form-alert form-alert-error" role="alert">
                {error}
              </div>
            )}

            <div className="review-form-field">
              <label className="review-field-label">Chọn mức độ hài lòng:</label>
              <div className="review-interactive-stars">
                <RatingStars
                  rating={rating}
                  interactive
                  size={24}
                  onRatingChange={(newRating) => setRating(newRating)}
                />
                <span className="review-rating-hint tabular-nums">
                  {rating === 5 && 'Tuyệt vời - Rất hài lòng'}
                  {rating === 4 && 'Tốt - Hài lòng'}
                  {rating === 3 && 'Bình thường'}
                  {rating === 2 && 'Chưa hài lòng'}
                  {rating === 1 && 'Kém - Cần cải thiện'}
                </span>
              </div>
            </div>

            <div className="review-form-field">
              <label htmlFor="review-comment" className="review-field-label">
                Nội dung nhận xét chi tiết:
              </label>
              <textarea
                id="review-comment"
                className="review-textarea"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm thực tế của bạn về chất lượng build, hiệu năng, tản nhiệt, độ bền..."
                maxLength={2000}
                required
              />
            </div>

            <div className="review-form-footer">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang gửi đánh giá...' : 'Gửi Nhận Xét'}
              </button>
            </div>
          </form>
        ) : (
          <div className="review-auth-card">
            <p className="review-auth-text">
              Bạn cần đăng nhập để gửi đánh giá và nhận xét cho sản phẩm này.
            </p>
            <Link href="/login" className="btn btn-secondary">
              Đăng Nhập Ngay
            </Link>
          </div>
        )}
      </div>

      {/* Customer Reviews List */}
      <div className="reviews-list-container">
        <h3 className="reviews-list-title tabular-nums">
          Nhận xét gần đây ({reviews.length})
        </h3>

        {isLoading ? (
          <div className="reviews-loading">Đang tải danh sách đánh giá...</div>
        ) : reviews.length === 0 ? (
          <div className="reviews-empty">
            Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên trải nghiệm và chia sẻ!
          </div>
        ) : (
          <div className="reviews-cards-stack">
            {reviews.map((rev) => (
              <article key={rev.id} className="review-item-card">
                <div className="review-item-header">
                  <div className="review-user-info">
                    <div className="review-avatar">
                      {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="review-user-name-row">
                        <span className="review-user-name">{rev.userName}</span>
                        {rev.isVerifiedPurchase && (
                          <span className="verified-buyer-badge">
                            <IconBadgeCheck size={14} />
                            <span>Đã mua hàng</span>
                          </span>
                        )}
                      </div>
                      <time className="review-time tabular-nums">
                        {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                      </time>
                    </div>
                  </div>
                  <div className="review-item-stars">
                    <RatingStars rating={rev.rating} size={15} />
                  </div>
                </div>
                <p className="review-item-comment">{rev.comment}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
