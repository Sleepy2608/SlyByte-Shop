'use client';

import React from 'react';

interface ProductSortProps {
  totalItems: number;
  currentSort: string;
  onSortChange: (sort: string) => void;
}

export function ProductSort({ totalItems, currentSort, onSortChange }: ProductSortProps) {
  return (
    <div className="product-sort-bar">
      <div className="sort-count-info">
        Hiển thị <span className="highlight-count">{totalItems}</span> thiết bị
      </div>

      <div className="sort-controls">
        <label htmlFor="product-sort-select" className="sort-label">
          Sắp xếp theo:
        </label>
        <select
          id="product-sort-select"
          className="sort-select"
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá tăng dần</option>
          <option value="price_desc">Giá giảm dần</option>
        </select>
      </div>
    </div>
  );
}

