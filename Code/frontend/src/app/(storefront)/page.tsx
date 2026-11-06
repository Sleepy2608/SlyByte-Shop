'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';
import { productService } from '@/services/productService';
import { ProductSummary } from '@/types/product.types';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductSkeleton } from '@/components/product/ProductSkeleton';

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [apiTestResult, setApiTestResult] = useState<string | null>(null);
  const [testingApi, setTestingApi] = useState(false);

  const [featuredProducts, setFeaturedProducts] = useState<ProductSummary[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    let isMounted = true;
    productService
      .getFeaturedProducts()
      .then((data) => {
        if (isMounted) {
          setFeaturedProducts(data);
        }
      })
      .catch((err) => {
        console.error('Không thể tải sản phẩm nổi bật:', err);
      })
      .finally(() => {
        if (isMounted) {
          setLoadingProducts(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span className="section-tag">DANH MỤC NỔI BẬT</span>
              <h2 className="section-title">Thiết Bị Tiêu Biểu Thế Hệ Mới</h2>
            </div>
            <Link href="/products" className="btn btn-outline btn-sm">
              Xem tất cả thiết bị &rarr;
            </Link>
          </div>

          <div className="catalog-grid">
            {loadingProducts ? (
              Array.from({ length: 4 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="catalog-empty" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                <p>Hiện chưa có sản phẩm nổi bật nào.</p>
              </div>
            )}
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
