'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CartItem } from '@/types/cart.types';
import { useCartStore } from '@/store/useCartStore';
import { IconLaptop, IconTrash } from '@/components/ui/Icons';

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
      setIsUpdating(true);
      try {
        await removeItem(item.id);
      } finally {
        setIsUpdating(false);
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
    setIsUpdating(true);
    try {
      await removeItem(item.id);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="cart-item-row">
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
            <IconLaptop size={24} />
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
            Tồn kho: {item.stockQuantity} thiết bị
          </span>
        </div>
      </div>

      <div className="cart-item-price-unit">
        {formatPrice(item.price)}
      </div>

      <div className="cart-item-stepper-col">
        <div className="quantity-stepper">
          <button
            type="button"
            className="stepper-btn"
            onClick={handleDecrease}
            disabled={isUpdating}
            title="Giảm số lượng"
            aria-label="Giảm số lượng"
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
            aria-label="Tăng số lượng"
          >
            +
          </button>
        </div>
      </div>

      <div className="cart-item-subtotal">
        {formatPrice(item.subtotal)}
      </div>

      <div className="cart-item-action-col">
        <button
          type="button"
          className="cart-item-remove-btn"
          onClick={handleRemove}
          disabled={isUpdating}
          title="Xóa sản phẩm khỏi giỏ"
          aria-label="Xóa sản phẩm khỏi giỏ"
        >
          <IconTrash size={16} />
        </button>
      </div>
    </div>
  );
}
