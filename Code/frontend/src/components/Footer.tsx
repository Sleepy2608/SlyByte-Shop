import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <Link href="/" className="brand-logo">
            <span className="brand-mark" aria-hidden="true" />
            <span className="brand-name">
              SLYBYTE<span className="brand-accent"> SHOP</span>
            </span>
          </Link>
          <p className="footer-desc">
            Hệ sinh thái thiết bị công nghệ chính hãng Slybyte. Cung cấp Laptop cao cấp, Smartphone Flagship và giải pháp phần cứng tiêu chuẩn.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>Danh mục thiết bị</h4>
            <ul>
              <li><Link href="/products?category=1">Laptop Đồ họa & Workstation</Link></li>
              <li><Link href="/products?category=1">Laptop Gaming Hiệu năng cao</Link></li>
              <li><Link href="/products?category=2">Smartphone Flagship</Link></li>
              <li><Link href="/products">Toàn bộ danh mục</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Dịch vụ khách hàng</h4>
            <ul>
              <li><Link href="/orders">Tra cứu lịch sử đơn hàng</Link></li>
              <li><Link href="/cart">Giỏ hàng thiết bị</Link></li>
              <li><span>Bảo hành tiêu chuẩn 24 tháng</span></li>
              <li><span>Đổi mới phần cứng 30 ngày</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>© {new Date().getFullYear()} Slybyte Shop. All rights reserved.</p>
          <p className="footer-subtext">Chuẩn hóa thông số kỹ thuật & phân phối chính hãng.</p>
        </div>
      </div>
    </footer>
  );
};
