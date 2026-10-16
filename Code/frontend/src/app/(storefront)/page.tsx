'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';

interface MockProduct {
  id: number;
  name: string;
  brand: string;
  badge: string;
  specs: string[];
  price: string;
  category: string;
}

const FEATURED_PRODUCTS: MockProduct[] = [
  {
    id: 1,
    name: 'MacBook Pro 16 inch M3 Max',
    brand: 'APPLE',
    badge: 'Flagship',
    specs: ['Apple M3 Max', '36GB Unified RAM', '1TB SSD NVMe', '16.2" Liquid Retina XDR'],
    price: '79.990.000 ₫',
    category: 'Laptop',
  },
  {
    id: 2,
    name: 'ASUS ROG Strix SCAR 18 (2024)',
    brand: 'ASUS',
    badge: 'Gaming Pro',
    specs: ['Intel Core i9-14900HX', 'RTX 4080 12GB', '32GB DDR5', '18" QHD+ 240Hz Nebula'],
    price: '84.990.000 ₫',
    category: 'Laptop',
  },
  {
    id: 3,
    name: 'Samsung Galaxy S24 Ultra 5G',
    brand: 'SAMSUNG',
    badge: 'Galaxy AI',
    specs: ['Snapdragon 8 Gen 3', '12GB RAM', '512GB Storage', '200MP Camera Zoom 100x'],
    price: '29.990.000 ₫',
    category: 'Điện thoại',
  },
  {
    id: 4,
    name: 'Sony WH-1000XM5 Wireless',
    brand: 'SONY',
    badge: 'Hi-Res Audio',
    specs: ['Auto NC Optimizer', 'Dual Noise Sensor', '30 Hours Battery', 'Multipoint Connection'],
    price: '7.490.000 ₫',
    category: 'Âm thanh',
  },
];

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [apiTestResult, setApiTestResult] = useState<string | null>(null);
  const [testingApi, setTestingApi] = useState(false);

  const handleTestMeApi = async () => {
    setTestingApi(true);
    setApiTestResult(null);
    try {
      const data = await authService.getMe();
      const roleStr = data.authorities?.map((a) => a.authority).join(', ') || user?.role || 'N/A';
      setApiTestResult(`Xác thực thành công từ backend! Tài khoản: ${data.username || user?.email} | Quyền: ${roleStr}`);
    } catch {
      setApiTestResult('Không thể kết nối đến /api/auth/me hoặc Token đã hết hạn.');
    } finally {
      setTestingApi(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-wrapper">
          <div className="hero-badge">
            <span className="brand-dot"></span>
            <span>NEXT-GEN TECH HARDWARE • CHÍNH HÃNG 100%</span>
          </div>

          <h1 className="hero-title">
            Đỉnh Cao Thiết Bị Công Nghệ.<br />
            <span className="hero-title-gradient">Sẵn Sàng Cho Mọi Tác Vụ Chuyên Nghiệp.</span>
          </h1>

          <p className="hero-desc">
            SlyByte Shop cung cấp hệ sinh thái Laptop đồ họa cao cấp, Laptop Gaming cấu hình tối thượng và Smartphone Flagship với thông số kỹ thuật minh bạch tuyệt đối.
          </p>

          <div className="hero-actions">
            <a href="#featured-products" className="btn btn-primary btn-lg">
              Khám Phá Sản Phẩm
            </a>
            {!isAuthenticated ? (
              <Link href="/register" className="btn btn-outline btn-lg">
                Đăng Ký Thành Viên
              </Link>
            ) : (
              <button onClick={handleTestMeApi} className="btn btn-outline btn-lg" disabled={testingApi}>
                {testingApi ? 'Đang kiểm tra token...' : 'Kiểm tra Phiên /api/auth/me'}
              </button>
            )}
          </div>

          {/* User Session Banner if logged in */}
          {isAuthenticated && user && (
            <div className="user-welcome-card">
              <div className="user-welcome-info">
                <span className="status-dot online"></span>
                <span>
                  Xin chào, <strong>{user.fullName || user.email}</strong>! Bạn đang đăng nhập với quyền{' '}
                  <span className="badge badge-primary">{user.role}</span>
                </span>
              </div>
              <div className="user-welcome-actions">
                <button onClick={handleTestMeApi} className="btn btn-sm btn-ghost" disabled={testingApi}>
                  Test /api/auth/me
                </button>
                <button onClick={logout} className="btn btn-sm btn-outline">
                  Đăng xuất
                </button>
              </div>
            </div>
          )}

          {/* API Test Feedback */}
          {apiTestResult && (
            <div
              className={`alert ${apiTestResult.includes('thành công') ? 'alert-success' : 'alert-error'} mt-4`}
              style={{ maxWidth: '640px', margin: '1.5rem auto 0 auto' }}
            >
              <span>{apiTestResult}</span>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured-products" className="products-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-tag">DANH MỤC NỔI BẬT</span>
              <h2 className="section-title">Thiết Bị Tiêu Biểu Thế Hệ Mới</h2>
            </div>
            <span className="section-hint">Phase 4 sẽ kích hoạt bộ lọc cấu hình chi tiết</span>
          </div>

          <div className="grid-4 product-grid">
            {FEATURED_PRODUCTS.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-card-top">
                  <span className="product-brand">{product.brand}</span>
                  <span className="product-badge">{product.badge}</span>
                </div>

                <div className="product-image-placeholder">
                  <span className="device-icon">💻</span>
                  <span className="category-tag">{product.category}</span>
                </div>

                <div className="product-card-body">
                  <h3 className="product-name">{product.name}</h3>

                  <ul className="product-specs">
                    {product.specs.map((spec, i) => (
                      <li key={i}>{spec}</li>
                    ))}
                  </ul>

                  <div className="product-card-bottom">
                    <div className="product-price">{product.price}</div>
                    <button className="btn btn-primary btn-sm" title="Tính năng giỏ hàng sẽ ra mắt ở Phase 5">
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Section */}
      <section className="trust-section">
        <div className="container">
          <div className="grid-3">
            <div className="trust-card">
              <div className="trust-icon">⚡</div>
              <h4>Hiệu Năng Vượt Trội</h4>
              <p>Mọi cấu hình đều được thẩm định kỹ thuật và cam kết phần cứng nguyên bản chính hãng.</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">🛡️</div>
              <h4>Bảo Mật & Tin Cậy</h4>
              <p>Hệ thống xác thực mã hóa bảo vệ thông tin tài khoản và lịch sử giao dịch tuyệt đối.</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">🔄</div>
              <h4>Bảo Hành Toàn Diện</h4>
              <p>Hỗ trợ kỹ thuật 24/7 và chính sách đổi trả minh bạch theo tiêu chuẩn nhà sản xuất.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
