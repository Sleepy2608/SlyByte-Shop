'use client';

import React from 'react';

interface ProductSkeletonProps {
  count?: number;
}

export function ProductSkeleton({ count = 8 }: ProductSkeletonProps) {
  return (
    <div className="product-grid-skeleton">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="product-card skeleton-card">
          <div className="skeleton-thumb shimmer" />
          <div className="skeleton-content">
            <div className="skeleton-line line-sm shimmer" />
            <div className="skeleton-line line-lg shimmer" />
            <div className="skeleton-line line-md shimmer" />
            <div className="skeleton-footer">
              <div className="skeleton-line line-price shimmer" />
              <div className="skeleton-btn shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

