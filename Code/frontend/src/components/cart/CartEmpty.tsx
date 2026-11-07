'use client';

import React from 'react';
import Link from 'next/link';

export function CartEmpty() {
  return (
    <div className="cart-empty-container">
      <div className="cart-empty-icon">🛒</div>
      <h2 className="cart-empty-title">Giỏ Hàng Của Bạn Đang Trống</h2>
      <p className="cart-empty-desc">
        Bạn chưa thêm bất kỳ thiết bị công nghệ nào vào giỏ hàng. Hãy khám phá danh mục Laptop đồ họa cao cấp, Smartphone Flagship và Gaming gear chính hãng của chúng tôi!
      </p>
      <Link href="/products" className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-2)' }}>
        Khám Phá Sản Phẩm Ngay &rarr;
      </Link>
    </div>
  );
}

