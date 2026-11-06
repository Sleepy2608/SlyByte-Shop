'use client';

import React from 'react';
import { Category, Brand } from '@/types/product.types';

interface PriceRange {
  label: string;
  min?: number;
  max?: number;
}

const PRICE_RANGES: PriceRange[] = [
  { label: 'Tất cả mức giá' },
  { label: 'Dưới 15 triệu', max: 15_000_000 },
  { label: '15 - 30 triệu', min: 15_000_000, max: 30_000_000 },
  { label: '30 - 50 triệu', min: 30_000_000, max: 50_000_000 },
  { label: 'Trên 50 triệu', min: 50_000_000 },
];

interface ProductFilterProps {
  categories: Category[];
  brands: Brand[];
  selectedCategoryId?: number;
  selectedBrandId?: number;
  selectedMinPrice?: number;
  selectedMaxPrice?: number;
  onCategoryChange: (categoryId?: number) => void;
  onBrandChange: (brandId?: number) => void;
  onPriceChange: (min?: number, max?: number) => void;
  onReset: () => void;
}

export function ProductFilter({
  categories,
  brands,
  selectedCategoryId,
  selectedBrandId,
  selectedMinPrice,
  selectedMaxPrice,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onReset,
}: ProductFilterProps) {
  // Tách danh mục cha (gốc)
  const rootCategories = categories.filter((c) => !c.parentId);

  const isPriceSelected = (range: PriceRange) => {
    return selectedMinPrice === range.min && selectedMaxPrice === range.max;
  };

  const hasAnyFilter = Boolean(
    selectedCategoryId || selectedBrandId || selectedMinPrice || selectedMaxPrice
  );

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <h3 className="filter-heading">Bộ Lọc Thiết Bị</h3>
        {hasAnyFilter && (
          <button onClick={onReset} className="filter-reset-btn" type="button">
            Đặt lại
          </button>
        )}
      </div>

      {/* Danh mục */}
      <div className="filter-section">
        <h4 className="filter-section-title">Danh Mục</h4>
        <ul className="filter-list">
          <li className="filter-list-item">
            <button
              type="button"
              className={`filter-item-btn ${!selectedCategoryId ? 'active' : ''}`}
              onClick={() => onCategoryChange(undefined)}
            >
              Tất cả danh mục
            </button>
          </li>
          {rootCategories.map((cat) => {
            const subCategories = categories.filter((c) => c.parentId === cat.id);
            const isCatActive = selectedCategoryId === cat.id;

            return (
              <li key={cat.id} className="filter-list-item">
                <button
                  type="button"
                  className={`filter-item-btn ${isCatActive ? 'active' : ''}`}
                  onClick={() => onCategoryChange(cat.id)}
                >
                  {cat.name}
                </button>

                {subCategories.length > 0 && (
                  <ul className="filter-sublist">
                    {subCategories.map((sub) => (
                      <li key={sub.id}>
                        <button
                          type="button"
                          className={`filter-subitem-btn ${
                            selectedCategoryId === sub.id ? 'active' : ''
                          }`}
                          onClick={() => onCategoryChange(sub.id)}
                        >
                          └ {sub.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Thương hiệu */}
      <div className="filter-section">
        <h4 className="filter-section-title">Thương Hiệu</h4>
        <div className="filter-brands-grid">
          <button
            type="button"
            className={`filter-brand-chip ${!selectedBrandId ? 'active' : ''}`}
            onClick={() => onBrandChange(undefined)}
          >
            Tất cả
          </button>
          {brands.map((brand) => (
            <button
              key={brand.id}
              type="button"
              className={`filter-brand-chip ${
                selectedBrandId === brand.id ? 'active' : ''
              }`}
              onClick={() => onBrandChange(brand.id)}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      {/* Khoảng giá */}
      <div className="filter-section">
        <h4 className="filter-section-title">Mức Giá</h4>
        <ul className="filter-list">
          {PRICE_RANGES.map((range, index) => {
            const selected = isPriceSelected(range);
            return (
              <li key={index} className="filter-list-item">
                <button
                  type="button"
                  className={`filter-item-btn ${selected ? 'active' : ''}`}
                  onClick={() => onPriceChange(range.min, range.max)}
                >
                  <span className={`filter-radio-dot ${selected ? 'checked' : ''}`} />
                  {range.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

