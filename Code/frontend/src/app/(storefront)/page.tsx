'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';
import { productService } from '@/services/productService';
import { ProductSummary } from '@/types/product.types';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductSkeleton } from '@/components/product/ProductSkeleton';
import {
  IconLaptop,
  IconSmartphone,
  IconCpu,
  IconShieldCheck,
  IconRefresh,
  IconLock,
  IconArrowRight,
} from '@/components/ui/Icons';

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
      setApiTestResult(`Xác thực thành công từ backend. Tài khoản: ${data.username || user?.email} | Quyền: ${roleStr}`);
    } catch {
      setApiTestResult('Không thể kết nối đến /api/auth/me hoặc phiên đăng nhập đã hết hạn.');
    } finally {
      setTestingApi(false);
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const spotlightProduct = featuredProducts[0] || null;

  return (
    <div className="home-page">
      {/* Section 1: Asymmetric Split Hero */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-split-grid">
            {/* Left Column: 4-Element Stack (Eyebrow, Headline, Subtext, CTAs) */}
            <div className="hero-copy-col">
              <div className="hero-eyebrow">
                HỆ THỐNG PHÂN PHỐI PHẦN CỨNG CHÍNH HÃNG
              </div>

              <h1 className="hero-title">
                Thiết Bị Chuẩn Kỹ Thuật.<br />
                <span className="hero-title-accent">Hiệu Suất Thực Chiến.</span>
              </h1>

              <p className="hero-desc">
                Phân phối Laptop Workstation, Gaming Pro và Smartphone Flagship với hồ sơ cấu hình minh bạch tuyệt đối.
              </p>

              <div className="hero-actions">
                <Link href="/products" className="btn btn-primary btn-lg">
                  <span>Khám Phá Kho Thiết Bị</span>
                  <IconArrowRight size={16} />
                </Link>
                {!isAuthenticated ? (
                  <Link href="/register" className="btn btn-outline btn-lg">
                    Đăng Ký Thành Viên
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={handleTestMeApi}
                    className="btn btn-outline btn-lg"
                    disabled={testingApi}
                  >
                    {testingApi ? 'Đang kiểm tra phiên...' : 'Kiểm Tra Phiên Xác Thực'}
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Live Flagship Hardware Showcase */}
            <div className="hero-showcase-col">
              {spotlightProduct ? (
                <div className="hero-spotlight-card">
                  <div className="hero-spotlight-top">
                    <span className="hero-spotlight-tag">
                      {spotlightProduct.brandName || 'FLAGSHIP HARDWARE'}
                    </span>
                    <span className="hero-spotlight-sku">
                      SKU #{String(spotlightProduct.id).padStart(4, '0')}
                    </span>
                  </div>

                  <Link
                    href={`/products/${spotlightProduct.slug || spotlightProduct.id}`}
                    className="hero-spotlight-media"
                  >
                    {spotlightProduct.thumbnail ? (
                      <img
                        src={spotlightProduct.thumbnail}
                        alt={spotlightProduct.name}
                        className="hero-spotlight-img"
                      />
                    ) : (
                      <IconLaptop size={64} />
                    )}
                  </Link>

                  <div className="hero-spotlight-body">
                    <div className="hero-spotlight-category">
                      {spotlightProduct.categoryName || 'Thiết bị tiêu chuẩn'}
                    </div>
                    <h2 className="hero-spotlight-title">
                      <Link href={`/products/${spotlightProduct.slug || spotlightProduct.id}`}>
                        {spotlightProduct.name}
                      </Link>
                    </h2>

                    <div className="hero-spotlight-footer">
                      <div className="hero-spotlight-pricing">
                        <span className="hero-spotlight-price">
                          {formatPrice(spotlightProduct.salePrice)}
                        </span>
                        {spotlightProduct.originalPrice > spotlightProduct.salePrice && (
                          <span className="hero-spotlight-original">
                            {formatPrice(spotlightProduct.originalPrice)}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/products/${spotlightProduct.slug || spotlightProduct.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        <span>Cấu hình</span>
                        <IconArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hero-spotlight-card">
                  <div className="hero-spotlight-top">
                    <span className="hero-spotlight-tag">WORKSTATION SERIES</span>
                    <span className="hero-spotlight-sku">SPEC VERIFIED</span>
                  </div>
                  <div className="hero-spotlight-media">
                    <img
                      src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop"
                      alt="MacBook Pro Workstation"
                      className="hero-spotlight-img"
                    />
                  </div>
                  <div className="hero-spotlight-body">
                    <div className="hero-spotlight-category">Laptop Đồ Họa & Kỹ Thuật</div>
                    <h2 className="hero-spotlight-title">
                      <Link href="/products?category=1">
                        Hệ thống Workstation & Flagship hiệu năng cao
                      </Link>
                    </h2>
                    <div className="hero-spotlight-footer">
                      <div className="hero-spotlight-pricing">
                        <span className="hero-spotlight-price">Sẵn sàng giao ngay</span>
                      </div>
                      <Link href="/products" className="btn btn-outline btn-sm">
                        <span>Xem danh mục</span>
                        <IconArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Authenticated Session Bar */}
          {isAuthenticated && user && (
            <div className="user-welcome-card">
              <div className="user-welcome-info">
                <span className="status-dot online" aria-hidden="true" />
                <span>
                  Phiên làm việc: <strong>{user.fullName || user.email}</strong>
                </span>
                <span className="role-tag">{user.role}</span>
              </div>
              <div className="user-welcome-actions">
                <button
                  type="button"
                  onClick={handleTestMeApi}
                  className="btn btn-sm btn-ghost"
                  disabled={testingApi}
                >
                  Kiểm tra /api/auth/me
                </button>
                <button type="button" onClick={logout} className="btn btn-sm btn-outline">
                  Đăng xuất
                </button>
              </div>
            </div>
          )}

          {apiTestResult && (
            <div
              className={`alert ${apiTestResult.includes('thành công') ? 'alert-success' : 'alert-error'} hero-alert`}
              role="status"
            >
              <span>{apiTestResult}</span>
            </div>
          )}
        </div>
      </section>

      {/* Section 2: Hardware Architecture Category Strip */}
      <section className="category-strip-section">
        <div className="container">
          <div className="category-architecture-grid">
            <Link href="/products?category=1" className="category-arch-card">
              <div className="category-arch-icon">
                <IconLaptop size={24} />
              </div>
              <div className="category-arch-content">
                <div className="category-arch-meta">DANH MỤC 01 / COMPUTING</div>
                <h2 className="category-arch-title">Laptop Workstation & Gaming Pro</h2>
                <p className="category-arch-desc">
                  Vi xử lý Apple M-Series, Intel Core Ultra & GPU RTX 40-Series dành cho kỹ sư phần mềm, dựng phim 3D và eSports.
                </p>
              </div>
              <span className="category-arch-arrow">
                <IconArrowRight size={18} />
              </span>
            </Link>

            <Link href="/products?category=2" className="category-arch-card">
              <div className="category-arch-icon">
                <IconSmartphone size={24} />
              </div>
              <div className="category-arch-content">
                <div className="category-arch-meta">DANH MỤC 02 / MOBILE FLAGSHIP</div>
                <h2 className="category-arch-title">Smartphone Flagship Thế Hệ Mới</h2>
                <p className="category-arch-desc">
                  Màn hình LTPO OLED 120Hz, tiến trình chip 3nm và hệ thống camera quang học chuyên nghiệp.
                </p>
              </div>
              <span className="category-arch-arrow">
                <IconArrowRight size={18} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 3: Featured Products Catalog */}
      <section id="featured-products" className="products-section">
        <div className="container">
          <div className="section-header-bar">
            <div className="section-header-stack">
              <h2 className="section-title">Thiết Bị Tiêu Biểu</h2>
              <p className="section-subtitle">
                Các cấu hình phần cứng được lựa chọn nhiều nhất với thông số kiểm định đầy đủ.
              </p>
            </div>
            <Link href="/products" className="btn btn-outline btn-sm">
              <span>Xem tất cả thiết bị</span>
              <IconArrowRight size={14} />
            </Link>
          </div>

          {loadingProducts ? (
            <ProductSkeleton count={4} />
          ) : featuredProducts.length > 0 ? (
            <div className="catalog-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="catalog-empty-state">
              <p className="catalog-empty-desc">Hiện chưa có sản phẩm nổi bật nào trong danh mục.</p>
            </div>
          )}
        </div>
      </section>

      {/* Section 4: Asymmetric Technical Bento Grid (Replaces 3-equal emoji cards) */}
      <section className="bento-guarantee-section">
        <div className="container">
          <div className="section-header-stack bento-section-header">
            <h2 className="section-title">Tiêu Chuẩn Kỹ Thuật & Cam Kết Dịch Vụ</h2>
            <p className="section-subtitle">
              Mọi thiết bị phân phối tại SlyByte Shop đều tuân thủ quy trình kiểm định phần cứng nghiêm ngặt.
            </p>
          </div>

          <div className="bento-grid">
            {/* Cell 1: Span 7 - Highlighted Engineering Cell */}
            <div className="bento-cell bento-span-7 bento-cell-highlight">
              <div className="bento-cell-top">
                <div className="bento-icon-box">
                  <IconCpu size={20} />
                </div>
                <span className="bento-metric-badge">100% OEM NGUYÊN BẢN</span>
              </div>
              <h3 className="bento-cell-title">Minh Bạch Hồ Sơ Cấu Hình</h3>
              <p className="bento-cell-desc">
                Công bố chính xác thông số vi xử lý, xung nhịp, dung lượng bộ nhớ đệm, chuẩn RAM/SSD và độ phủ màu màn hình theo tài liệu kỹ thuật từ nhà sản xuất.
              </p>
            </div>

            {/* Cell 2: Span 5 */}
            <div className="bento-cell bento-span-5">
              <div className="bento-cell-top">
                <div className="bento-icon-box">
                  <IconShieldCheck size={20} />
                </div>
                <span className="bento-metric-badge">24 THÁNG</span>
              </div>
              <h3 className="bento-cell-title">Bảo Hành Chính Hãng Toàn Diện</h3>
              <p className="bento-cell-desc">
                Bảo hành tiêu chuẩn tại hệ thống trung tâm ủy quyền chính thức trên toàn quốc kèm tra cứu mã vận đơn trực tuyến.
              </p>
            </div>

            {/* Cell 3: Span 5 */}
            <div className="bento-cell bento-span-5">
              <div className="bento-cell-top">
                <div className="bento-icon-box">
                  <IconRefresh size={20} />
                </div>
                <span className="bento-metric-badge">1-ĐỔI-1 / 30 NGÀY</span>
              </div>
              <h3 className="bento-cell-title">Đổi Mới Phần Cứng Nhanh Chóng</h3>
              <p className="bento-cell-desc">
                Hỗ trợ đổi mới ngay trong 30 ngày đầu nếu phát sinh lỗi phần cứng từ nhà sản xuất, không mất phí thẩm định.
              </p>
            </div>

            {/* Cell 4: Span 7 */}
            <div className="bento-cell bento-span-7 bento-cell-surface">
              <div className="bento-cell-top">
                <div className="bento-icon-box">
                  <IconLock size={20} />
                </div>
                <span className="bento-metric-badge">JWT &amp; TLS 1.3</span>
              </div>
              <h3 className="bento-cell-title">Giao Dịch &amp; Tồn Kho Đồng Bộ Thời Gian Thực</h3>
              <p className="bento-cell-desc">
                Số lượng tồn kho và trạng thái đơn hàng được khóa nguyên tử ngay khi xác nhận thanh toán, bảo vệ quyền lợi khách hàng tuyệt đối.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
