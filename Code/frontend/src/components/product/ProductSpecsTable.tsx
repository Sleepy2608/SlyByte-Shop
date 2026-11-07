'use client';

import React from 'react';
import { ProductSpec } from '@/types/product.types';
import { IconCpu } from '@/components/ui/Icons';

interface ProductSpecsTableProps {
  specs: ProductSpec[];
}

export function ProductSpecsTable({ specs }: ProductSpecsTableProps) {
  if (!specs || specs.length === 0) {
    return (
      <div className="specs-empty-state">
        <p>Thông số kỹ thuật chi tiết đang được cập nhật.</p>
      </div>
    );
  }

  const groupedSpecs: Record<string, ProductSpec[]> = {};
  specs.forEach((spec) => {
    const group = spec.specGroup || 'Cấu Hình Chi Tiết';
    if (!groupedSpecs[group]) {
      groupedSpecs[group] = [];
    }
    groupedSpecs[group].push(spec);
  });

  return (
    <section className="specs-table-wrapper">
      <div className="specs-section-heading">
        <IconCpu size={20} />
        <h3 className="specs-table-title">Hồ Sơ Thông Số Kỹ Thuật</h3>
      </div>

      <div className="specs-groups-container">
        {Object.entries(groupedSpecs).map(([groupName, groupItems]) => (
          <div key={groupName} className="specs-group-card">
            <h4 className="specs-group-header">{groupName}</h4>
            <dl className="specs-list">
              {groupItems.map((item) => (
                <div key={item.id} className="specs-row">
                  <dt className="specs-key">{item.specKey}</dt>
                  <dd className="specs-value">{item.specValue}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}
