'use client';

import React from 'react';
import { ProductSpec } from '@/types/product.types';

interface ProductSpecsTableProps {
  specs: ProductSpec[];
}

export function ProductSpecsTable({ specs }: ProductSpecsTableProps) {
  if (!specs || specs.length === 0) {
    return (
      <div className="specs-empty-state">
        <p>Thông số kỹ thuật đang được cập nhật.</p>
      </div>
    );
  }

  // Nhóm specs theo `specGroup`
  const groupedSpecs: Record<string, ProductSpec[]> = {};
  specs.forEach((spec) => {
    const group = spec.specGroup || 'Thông Số Chung';
    if (!groupedSpecs[group]) {
      groupedSpecs[group] = [];
    }
    groupedSpecs[group].push(spec);
  });

  return (
    <div className="specs-table-wrapper">
      <h3 className="specs-table-title">Thông Số Kỹ Thuật Chi Tiết</h3>

      <div className="specs-groups-container">
        {Object.entries(groupedSpecs).map(([groupName, groupItems]) => (
          <div key={groupName} className="specs-group-card">
            <h4 className="specs-group-header">{groupName}</h4>
            <div className="specs-list">
              {groupItems.map((item) => (
                <div key={item.id} className="specs-row">
                  <div className="specs-key">{item.specKey}</div>
                  <div className="specs-value">{item.specValue}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

