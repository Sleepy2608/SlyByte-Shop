'use client';

import React, { useState } from 'react';
import { IconStar } from './Icons';

interface RatingStarsProps {
  rating: number; // 1 to 5
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  size = 16,
  interactive = false,
  onRatingChange,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div
      className={`rating-stars-container ${className}`}
      role={interactive ? 'radiogroup' : undefined}
      aria-label={`Đánh giá: ${rating} trên ${maxStars} sao`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}
    >
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.round(activeRating);

        if (interactive) {
          return (
            <button
              key={starValue}
              type="button"
              className="rating-star-btn"
              onClick={() => onRatingChange?.(starValue)}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(null)}
              aria-label={`${starValue} sao`}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px',
                cursor: 'pointer',
                color: isFilled ? '#F59E0B' : '#475569',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'transform 0.15s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <IconStar size={size} filled={isFilled} />
            </button>
          );
        }

        return (
          <span
            key={starValue}
            style={{
              color: isFilled ? '#F59E0B' : '#334155',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <IconStar size={size} filled={isFilled} />
          </span>
        );
      })}
    </div>
  );
};
