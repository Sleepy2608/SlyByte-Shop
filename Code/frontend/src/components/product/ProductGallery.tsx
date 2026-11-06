'use client';

import React, { useState } from 'react';
import { ProductImage } from '@/types/product.types';

interface ProductGalleryProps {
  images: ProductImage[];
  fallbackThumbnail?: string | null;
  productName: string;
}

export function ProductGallery({
  images,
  fallbackThumbnail,
  productName,
}: ProductGalleryProps) {
  // Chuẩn bị danh sách ảnh đầy đủ
  const allImages = React.useMemo(() => {
    if (images && images.length > 0) {
      return images;
    }
    if (fallbackThumbnail) {
      return [
        {
          id: 0,
          imageUrl: fallbackThumbnail,
          isPrimary: true,
          sortOrder: 0,
        },
      ];
    }
    return [];
  }, [images, fallbackThumbnail]);

  const [activeIdx, setActiveIdx] = useState(0);
  const currentImage = allImages[activeIdx];

  return (
    <div className="product-gallery">
      {/* Khung ảnh chính */}
      <div className="gallery-main-container">
        {currentImage?.imageUrl ? (
          <img
            src={currentImage.imageUrl}
            alt={`${productName} - Ảnh ${activeIdx + 1}`}
            className="gallery-main-img"
          />
        ) : (
          <div className="gallery-placeholder">
            <span>💻</span>
          </div>
        )}
      </div>

      {/* Dãy thumbnail nhỏ bên dưới */}
      {allImages.length > 1 && (
        <div className="gallery-thumbnails-row">
          {allImages.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              className={`gallery-thumb-btn ${activeIdx === idx ? 'active' : ''}`}
              onClick={() => setActiveIdx(idx)}
            >
              <img
                src={img.imageUrl}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="gallery-thumb-img"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
