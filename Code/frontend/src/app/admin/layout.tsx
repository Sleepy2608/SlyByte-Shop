'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    // Nếu chưa đăng nhập -> chuyển hướng sang /login
    if (!isAuthenticated) {
      router.push('/login?from=/admin');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Nếu đã đăng nhập nhưng không có role ADMIN -> Chặn quyền truy cập
  if (isAuthenticated && user && user.role !== 'ADMIN') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-page)',
        padding: '24px',
        textAlign: 'center'
      }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '40px 32px',
          maxWidth: '480px'
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🚫</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ff4d4f', marginBottom: '12px' }}>
            Truy Cập Bị Từ Chối (403)
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.5 }}>
            Tài khoản của bạn (<strong>{user.email}</strong>) chỉ có quyền <strong>{user.role}</strong>, không đủ thẩm quyền để truy cập Phân hệ Quản trị (Admin Portal).
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link href="/" className="btn btn-primary">
              Về Trang Cửa Hàng
            </Link>
            <button onClick={handleLogout} className="btn btn-outline">
              Đăng Xuất
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Đang kiểm tra quyền quản trị viên...</p>
      </div>
    );
  }

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Bảng Điều Khiển Tổng Quan (Dashboard)';
    if (pathname === '/admin/orders') return 'Quản Lý Đơn Hàng Hệ Thống';
    if (pathname === '/admin/products') return 'Quản Lý Danh Mục & Thiết Bị Công Nghệ';
    return 'Phân Hệ Quản Trị Hệ Thống';
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Trái */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <span className="brand-dot" />
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)', letterSpacing: '0.5px' }}>
              SLYBYTE <span style={{ color: 'var(--color-primary)' }}>ADMIN</span>
            </span>
          </Link>
          <span className="badge-status status-cancelled" style={{ fontSize: '0.7rem' }}>PORTAL</span>
        </div>

        <nav className="admin-sidebar-nav">
          <Link
            href="/admin"
            className={`admin-nav-item ${pathname === '/admin' ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            <span>Tổng Quan (Dashboard)</span>
          </Link>

          <Link
            href="/admin/orders"
            className={`admin-nav-item ${pathname === '/admin/orders' ? 'active' : ''}`}
          >
            <span className="nav-icon">📦</span>
            <span>Quản Lý Đơn Hàng</span>
          </Link>

          <Link
            href="/admin/products"
            className={`admin-nav-item ${pathname === '/admin/products' ? 'active' : ''}`}
          >
            <span className="nav-icon">💻</span>
            <span>Sản Phẩm & Kho Hàng</span>
          </Link>

          <div style={{ margin: '16px 0 8px 12px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Hệ Thống
          </div>

          <Link href="/" className="admin-nav-item">
            <span className="nav-icon">🏪</span>
            <span>Xem Giao Diện Khách</span>
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--color-primary)',
              color: '#000',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              A
            </div>
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.fullName || 'Admin'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ROLE_ADMIN</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px 8px', color: '#ff4d4f' }}
            title="Đăng xuất quản trị"
          >
            🚪
          </button>
        </div>
      </aside>

      {/* Main Content Phải */}
      <div className="admin-main">
        <header className="admin-topbar">
          <h1 className="admin-topbar-title">{getPageTitle()}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/" className="btn btn-outline btn-sm">
              &larr; Cửa hàng
            </Link>
          </div>
        </header>

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}

