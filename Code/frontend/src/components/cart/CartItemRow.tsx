'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CartItem } from '@/types/cart.types';
import { useCartStore } from '@/store/useCartStore';

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const handleDecrease = async () => {
    if (item.quantity <= 1) {
      if (confirm(`Bạn có chắc chắn muốn xóa "${item.productName}" khỏi giỏ hàng?`)) {
        setIsUpdating(true);
        try {
          await removeItem(item.id);
        } finally {
          setIsUpdating(false);
        }
      }
      return;
    }
    setIsUpdating(true);
    try {
      await updateQuantity(item.id, item.quantity - 1);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncrease = async () => {
    if (item.quantity >= item.stockQuantity) {
      alert(`Sản phẩm này chỉ còn tối đa ${item.stockQuantity} thiết bị trong kho.`);
      return;
    }
    setIsUpdating(true);
    try {
      await updateQuantity(item.id, item.quantity + 1);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (confirm(`Xóa "${item.productName}" khỏi giỏ hàng?`)) {
      setIsUpdating(true);
      try {
        await removeItem(item.id);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className="cart-item-row">
      {/* Cột 1: Thông tin sản phẩm */}
      <div className="cart-item-info">
        <div className="cart-item-thumb">
          {item.productThumbnail ? (
            <img
              src={item.productThumbnail}
              alt={item.productName}
              className="cart-item-img"
              loading="lazy"
            />
          ) : (
            <span style={{ fontSize: '1.8rem' }}>💻</span>
          )}
        </div>
        <div className="cart-item-details">
          {item.brandName && (
            <span className="cart-item-brand">{item.brandName}</span>
          )}
          <Link
            href={`/products/${item.productSlug || item.productId}`}
            className="cart-item-title"
          >
            {item.productName}
          </Link>
          <span className="cart-item-stock-hint">
            Kho: {item.stockQuantity} sản phẩm sẵn có
          </span>
        </div>
      </div>

      {/* Cột 2: Đơn giá */}
      <div className="cart-item-price-unit">
        {formatPrice(item.price)}
      </div>

      {/* Cột 3: Bộ tăng/giảm số lượng */}
      <div className="cart-item-stepper-col">
        <div className="quantity-stepper">
          <button
            type="button"
            className="stepper-btn"
            onClick={handleDecrease}
            disabled={isUpdating}
            title="Giảm số lượng"
          >
            -
          </button>
          <span className="stepper-value">{item.quantity}</span>
          <button
            type="button"
            className="stepper-btn"
            onClick={handleIncrease}
            disabled={isUpdating || item.quantity >= item.stockQuantity}
            title="Tăng số lượng"
          >
            +
          </button>
        </div>
      </div>

      {/* Cột 4: Thành tiền (subtotal) */}
      <div className="cart-item-subtotal">
        {formatPrice(item.subtotal)}
      </div>

      {/* Cột 5: Nút xóa */}
      <div className="cart-item-action-col">
        <button
          type="button"
          className="cart-item-remove-btn"
          onClick={handleRemove}
          disabled={isUpdating}
          title="Xóa sản phẩm này"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

