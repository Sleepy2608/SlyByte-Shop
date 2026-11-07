'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
  IconChart,
  IconPackage,
  IconLaptop,
  IconStore,
  IconLogOut,
  IconAlertOctagon,
  IconArrowLeft,
} from '@/components/ui/Icons';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?from=/admin');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isAuthenticated && user && user.role !== 'ADMIN') {
    return (
      <div className="admin-forbidden-page">
        <div className="admin-forbidden-card">
          <div className="admin-forbidden-icon">
            <IconAlertOctagon size={36} />
          </div>
          <h1 className="admin-forbidden-title">Truy Cập Bị Từ Chối (403)</h1>
          <p className="admin-forbidden-desc">
            Tài khoản của bạn (<strong>{user.email}</strong>) chỉ có quyền <strong>{user.role}</strong>, không đủ thẩm quyền để truy cập Phân hệ Quản trị.
          </p>
          <div className="empty-state-actions">
            <Link href="/" className="btn btn-primary">
              Về Trang Cửa Hàng
            </Link>
            <button type="button" onClick={handleLogout} className="btn btn-outline">
              Đăng Xuất
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="admin-forbidden-page">
        <p className="catalog-empty-desc">Đang kiểm tra quyền quản trị viên...</p>
      </div>
    );
  }

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Bảng Điều Khiển Tổng Quan';
    if (pathname === '/admin/orders') return 'Quản Lý Đơn Hàng Hệ Thống';
    if (pathname === '/admin/products') return 'Quản Lý Danh Mục & Thiết Bị Công Nghệ';
    return 'Phân Hệ Quản Trị Hệ Thống';
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <Link href="/admin" className="navbar-brand">
            <span className="brand-mark" aria-hidden="true" />
            <span className="brand-name">
              SLYBYTE<span className="brand-accent"> ADMIN</span>
            </span>
          </Link>
          <span className="role-tag">PORTAL</span>
        </div>

        <nav className="admin-sidebar-nav" aria-label="Điều hướng quản trị">
          <Link
            href="/admin"
            className={`admin-nav-item ${pathname === '/admin' ? 'active' : ''}`}
          >
            <span className="nav-icon">
              <IconChart size={18} />
            </span>
            <span>Tổng Quan (Dashboard)</span>
          </Link>

          <Link
            href="/admin/orders"
            className={`admin-nav-item ${pathname === '/admin/orders' ? 'active' : ''}`}
          >
            <span className="nav-icon">
              <IconPackage size={18} />
            </span>
            <span>Quản Lý Đơn Hàng</span>
          </Link>

          <Link
            href="/admin/products"
            className={`admin-nav-item ${pathname === '/admin/products' ? 'active' : ''}`}
          >
            <span className="nav-icon">
              <IconLaptop size={18} />
            </span>
            <span>Sản Phẩm &amp; Kho Hàng</span>
          </Link>

          <div className="admin-nav-section-label">Hệ Thống</div>

          <Link href="/" className="admin-nav-item">
            <span className="nav-icon">
              <IconStore size={18} />
            </span>
            <span>Giao Diện Cửa Hàng</span>
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-summary">
            <div className="admin-user-avatar">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="admin-user-meta">
              <div className="admin-user-name">{user.fullName || 'Admin'}</div>
              <div className="admin-user-role">ROLE_ADMIN</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-ghost btn-sm btn-danger-ghost"
            title="Đăng xuất quản trị"
            aria-label="Đăng xuất quản trị"
          >
            <IconLogOut size={16} />
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <h1 className="admin-topbar-title">{getPageTitle()}</h1>
          <Link href="/" className="btn btn-outline btn-sm">
            <IconArrowLeft size={14} />
            <span>Cửa hàng</span>
          </Link>
        </header>

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
