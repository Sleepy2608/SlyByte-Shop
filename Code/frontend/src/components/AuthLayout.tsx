import React from 'react';
import Link from 'next/link';
import { IconCheck } from '@/components/ui/Icons';

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
            <span className="brand-mark" aria-hidden="true" />
            <span className="brand-name">
              SLYBYTE<span className="brand-accent"> SHOP</span>
            </span>
          </Link>

          <div className="showcase-content">
            <div className="showcase-tag">Hệ Sinh Thái Phần Cứng</div>
            <h2 className="showcase-title">
              Thiết bị công nghệ chuẩn xác cho hiệu suất chuyên nghiệp.
            </h2>
            <p className="showcase-desc">
              Truy cập hệ thống phân phối Laptop Workstation, Gaming Pro và Smartphone Flagship với hồ sơ kỹ thuật minh bạch cùng chính sách bảo hành chính hãng.
            </p>

            <div className="showcase-features">
              <div className="showcase-feature-item">
                <div className="feature-icon-box">
                  <IconCheck size={13} />
                </div>
                <div>
                  <strong>Phần cứng nguyên bản 100%</strong>
                  <span>Phân phối chính thức từ Apple, Asus, Dell, Samsung</span>
                </div>
              </div>
              <div className="showcase-feature-item">
                <div className="feature-icon-box">
                  <IconCheck size={13} />
                </div>
                <div>
                  <strong>Thông số kỹ thuật minh bạch</strong>
                  <span>Chuẩn hóa cấu hình CPU, GPU, RAM và băng thông lưu trữ</span>
                </div>
              </div>
              <div className="showcase-feature-item">
                <div className="feature-icon-box">
                  <IconCheck size={13} />
                </div>
                <div>
                  <strong>Bảo mật phiên giao dịch</strong>
                  <span>Xác thực JWT và đồng bộ giỏ hàng theo tài khoản</span>
                </div>
              </div>
            </div>
          </div>

          <div className="showcase-footer">
            <span>© {new Date().getFullYear()} Slybyte Shop. All rights reserved.</span>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="auth-form-side">
          <div className="auth-form-card">
            <div className="auth-form-header">
              <Link href="/" className="mobile-brand">
                <span className="brand-mark" aria-hidden="true" />
                <span>
                  SLYBYTE<span className="brand-accent"> SHOP</span>
                </span>
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
