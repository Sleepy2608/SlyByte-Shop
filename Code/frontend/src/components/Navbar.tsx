'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { IconShoppingBag } from '@/components/ui/Icons';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { totalItems, fetchCart, reset: resetCart } = useCartStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      resetCart();
    }
  }, [isAuthenticated, fetchCart, resetCart]);

  const handleLogout = () => {
    logout();
    resetCart();
    router.push('/login');
  };

  return (
    <header className="navbar">
      <div className="container navbar-content">
        {/* Brand Logo */}
        <Link href="/" className="navbar-brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">
            SLYBYTE<span className="brand-accent"> SHOP</span>
          </span>
        </Link>

        {/* Categories navigation */}
        <nav className="navbar-nav" aria-label="Điều hướng chính">
          <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
            Trang chủ
          </Link>
          <Link href="/products" className={`nav-link ${pathname === '/products' ? 'active' : ''}`}>
            Sản phẩm
          </Link>
          <Link href="/products?category=1" className="nav-link">
            Laptop
          </Link>
          <Link href="/products?category=2" className="nav-link">
            Điện thoại
          </Link>
        </nav>

        {/* User / Cart / Auth actions */}
        <div className="navbar-actions">
          <Link href="/cart" className="navbar-cart-btn" aria-label="Giỏ hàng" title="Giỏ hàng">
            <IconShoppingBag size={18} />
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </Link>

          {isAuthenticated && user ? (
            <div className="user-menu">
              <div className="user-badge">
                <span className="user-avatar">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </span>
                <span className="user-name">{user.fullName || user.email}</span>
                {user.role === 'ADMIN' && <span className="role-tag">ADMIN</span>}
              </div>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="btn btn-outline btn-sm btn-accent-outline"
                  title="Phân hệ Quản trị"
                >
                  Quản trị
                </Link>
              )}
              <Link href="/orders" className="btn btn-ghost btn-sm" title="Lịch sử đơn hàng">
                Đơn hàng
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm" title="Đăng xuất">
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="auth-btns">
              <Link href="/login" className="btn btn-ghost btn-sm">
                Đăng nhập
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
