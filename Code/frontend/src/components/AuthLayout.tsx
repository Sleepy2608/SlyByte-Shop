import React from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side: Brand Showcase */}
        <div className="auth-showcase">
          <Link href="/" className="showcase-brand">
            <span className="brand-dot"></span>
            <span className="brand-name">SLYBYTE<span className="brand-accent"> SHOP</span></span>
          </Link>

          <div className="showcase-content">
            <div className="showcase-tag">Nền Tảng Công Nghệ Cao Cấp</div>
            <h2 className="showcase-title">
              Trải nghiệm thiết bị đỉnh cao với chất lượng chính hãng.
            </h2>
            <p className="showcase-desc">
              Khám phá hệ sinh thái Laptop, Smartphone và phần cứng thế hệ mới với thông số kỹ thuật minh bạch và dịch vụ bảo hành tiêu chuẩn.
            </p>

            <div className="showcase-features">
              <div className="showcase-feature-item">
                <div className="feature-icon-box">✓</div>
                <div>
                  <strong>Sản phẩm chính hãng 100%</strong>
                  <span>Phân phối từ Apple, Asus, Dell, Samsung</span>
                </div>
              </div>
              <div className="showcase-feature-item">
                <div className="feature-icon-box">✓</div>
                <div>
                  <strong>Thông số kỹ thuật chuẩn hóa</strong>
                  <span>Minh bạch cấu hình CPU, GPU, RAM, Storage</span>
                </div>
              </div>
              <div className="showcase-feature-item">
                <div className="feature-icon-box">✓</div>
                <div>
                  <strong>Bảo mật tài khoản & Đơn hàng</strong>
                  <span>Xác thực JWT hiện đại, bảo mật đa tầng</span>
                </div>
              </div>
            </div>
          </div>

          <div className="showcase-footer">
            <span>© {new Date().getFullYear()} Slybyte Shop (Slybyte). All rights reserved.</span>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="auth-form-side">
          <div className="auth-form-card">
            <div className="auth-form-header">
              <Link href="/" className="mobile-brand">
                <span className="brand-dot"></span>
                <span>SLYBYTE<span className="brand-accent"> SHOP</span></span>
              </Link>
              <h1 className="auth-title">{title}</h1>
              <p className="auth-subtitle">{subtitle}</p>
            </div>

            <div className="auth-form-body">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
