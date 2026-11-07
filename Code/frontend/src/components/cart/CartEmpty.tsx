'use client';

import React from 'react';
import Link from 'next/link';
import { IconShoppingBag, IconArrowRight } from '@/components/ui/Icons';

export function CartEmpty() {
  return (
    <div className="cart-empty-container">
      <div className="cart-empty-icon">
        <IconShoppingBag size={36} />
      </div>
      <h2 className="cart-empty-title">Giỏ Hàng Của Bạn Đang Trống</h2>
      <p className="cart-empty-desc">
        Bạn chưa thêm thiết bị công nghệ nào vào giỏ hàng. Khám phá danh mục Laptop Workstation, Gaming Pro và Smartphone Flagship chính hãng.
      </p>
      <Link href="/products" className="btn btn-primary btn-lg">
        <span>Khám Phá Kho Thiết Bị</span>
        <IconArrowRight size={16} />
      </Link>
    </div>
  );
}
