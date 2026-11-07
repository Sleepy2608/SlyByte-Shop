'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { orderService } from '@/services/orderService';
import { PaymentMethod } from '@/types/order.types';
import axios from 'axios';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { cart, fetchCart } = useCartStore();

  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Điền trước thông tin từ tài khoản nếu có
  useEffect(() => {
    if (user) {
      if (user.fullName) setRecipientName(user.fullName);
      if (user.phone) setPhone(user.phone);
      if (user.address) setShippingAddress(user.address);
    }
  }, [user]);

  // Kiểm tra đăng nhập
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?from=/checkout');
    }
  }, [isAuthenticated, router]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!recipientName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên người nhận hàng.');
      return;
    }

    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(phone.trim())) {
      setErrorMessage('Số điện thoại không hợp lệ (ví dụ: 0987654321).');
      return;
    }

    if (!shippingAddress.trim()) {
      setErrorMessage('Vui lòng nhập địa chỉ giao nhận hàng cụ thể.');
      return;
    }

    if (!cart || cart.items.length === 0) {
      setErrorMessage('Giỏ hàng của bạn đang trống! Vui lòng chọn sản phẩm trước khi thanh toán.');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await orderService.checkout({
        recipientName: recipientName.trim(),
        phone: phone.trim(),
        shippingAddress: shippingAddress.trim(),
        paymentMethod,
        notes: notes.trim() || undefined,
      });

      // Làm mới giỏ hàng sau khi checkout thành công
      await fetchCart();

      // Chuyển hướng sang trang thành công
      router.push(`/order-success/${order.orderCode}`);
    } catch (err: unknown) {
      let msg = 'Đặt hàng không thành công. Vui lòng kiểm tra lại thông tin.';
      if (axios.isAxiosError(err) && err.response?.data) {
        if (typeof err.response.data === 'string') {
          msg = err.response.data;
        } else if (typeof err.response.data.message === 'string') {
          msg = err.response.data.message;
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="cart-empty-container">
            <div className="cart-empty-icon">🛒</div>
            <h2 className="cart-empty-title">Giỏ Hàng Đang Trống</h2>
            <p className="cart-empty-desc">
              Không có sản phẩm nào để tiến hành thanh toán. Vui lòng chọn mua thiết bị trước.
            </p>
            <Link href="/products" className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-2)' }}>
              Quay lại danh mục sản phẩm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        {/* Header */}
        <div className="checkout-header">
          <h1 className="checkout-title">Tiến Hành Đặt Hàng</h1>
          <p className="checkout-subtitle">
            Hoàn tất thông tin nhận hàng và phương thức thanh toán an toàn.
          </p>
        </div>

        {/* Thông báo lỗi nếu có */}
        {errorMessage && (
          <div className="alert alert-error" style={{ marginBottom: 'var(--space-6)' }}>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="checkout-layout">
            {/* Cột trái: Form thông tin & Phương thức thanh toán */}
            <div className="checkout-main">
              {/* Card 1: Thông tin người nhận */}
              <div className="checkout-section-card">
                <h2 className="checkout-section-title">
                  <span className="step-number">1</span>
                  Thông Tin Giao Nhận Hàng
                </h2>

                <div className="checkout-form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="recipientName">
                      Họ và tên người nhận <span style={{ color: '#ff4d4f' }}>*</span>
                    </label>
                    <input
                      id="recipientName"
                      type="text"
                      className="form-input"
                      placeholder="VD: Nguyễn Văn A"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">
                      Số điện thoại nhận hàng <span style={{ color: '#ff4d4f' }}>*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className="form-input"
                      placeholder="VD: 0987654321"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label" htmlFor="shippingAddress">
                      Địa chỉ nhận hàng chi tiết <span style={{ color: '#ff4d4f' }}>*</span>
                    </label>
                    <input
                      id="shippingAddress"
                      type="text"
                      className="form-input"
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label" htmlFor="notes">
                      Ghi chú đơn hàng (Tùy chọn)
                    </label>
                    <textarea
                      id="notes"
                      className="form-textarea"
                      placeholder="Ghi chú thêm về thời gian giao hàng, chỉ dẫn địa chỉ..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Phương thức thanh toán */}
              <div className="checkout-section-card">
                <h2 className="checkout-section-title">
                  <span className="step-number">2</span>
                  Phương Thức Thanh Toán
                </h2>

                <div className="payment-methods-grid">
                  {/* COD */}
                  <label
                    className={`payment-method-card ${paymentMethod === 'COD' ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                    />
                    <div className="payment-method-header">
                      <span>💵</span>
                      <span>Thanh Toán Khi Nhận Hàng (COD)</span>
                    </div>
                    <p className="payment-method-desc">
                      Kiểm tra thiết bị nguyên seal và thanh toán tiền mặt trực tiếp cho nhân viên giao vận.
                    </p>
                  </label>

                  {/* Chuyển khoản ngân hàng */}
                  <label
                    className={`payment-method-card ${paymentMethod === 'BANK_TRANSFER' ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BANK_TRANSFER"
                      checked={paymentMethod === 'BANK_TRANSFER'}
                      onChange={() => setPaymentMethod('BANK_TRANSFER')}
                    />
                    <div className="payment-method-header">
                      <span>🏦</span>
                      <span>Chuyển Khoản Ngân Hàng (QR)</span>
                    </div>
                    <p className="payment-method-desc">
                      Chuyển khoản qua số tài khoản chính thức của SlyByte Shop kèm mã đơn hàng.
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* Cột phải: Tóm tắt đơn hàng & Xác nhận */}
            <aside className="checkout-sidebar">
              <div className="cart-summary-card">
                <h3 className="cart-summary-title">Kiểm Tra Đơn Hàng</h3>

                {/* Danh sách sản phẩm mini */}
                <div className="checkout-items-list">
                  {cart.items.map((item) => (
                    <div key={item.id} className="checkout-item-mini">
                      <div className="checkout-item-mini-info">
                        <div className="checkout-item-mini-thumb">
                          {item.productThumbnail ? (
                            <img
                              src={item.productThumbnail}
                              alt={item.productName}
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                          ) : (
                            <span>💻</span>
                          )}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <div className="checkout-item-mini-name" title={item.productName}>
                            {item.productName}
                          </div>
                          <span className="checkout-item-mini-qty">Số lượng: x{item.quantity}</span>
                        </div>
                      </div>
                      <span className="checkout-item-mini-price">
                        {formatPrice(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tổng thanh toán */}
                <div className="cart-summary-row">
                  <span>Tạm tính ({cart.totalItems} thiết bị):</span>
                  <span>{formatPrice(cart.totalPrice)}</span>
                </div>

                <div className="cart-summary-row">
                  <span>Phí vận chuyển:</span>
                  <span style={{ color: '#52c41a', fontWeight: 600 }}>Miễn phí toàn quốc</span>
                </div>

                <div className="cart-summary-row total-row">
                  <span>Tổng thanh toán:</span>
                  <span className="cart-summary-total-price">{formatPrice(cart.totalPrice)}</span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg"
                  disabled={isSubmitting}
                  style={{ marginTop: 'var(--space-2)' }}
                >
                  {isSubmitting ? 'Đang xử lý đơn hàng...' : 'Xác Nhận Đặt Hàng →'}
                </button>

                <Link
                  href="/cart"
                  className="btn btn-ghost btn-block btn-sm"
                  style={{ textAlign: 'center' }}
                >
                  ← Quay lại chỉnh sửa giỏ hàng
                </Link>

                <div className="cart-summary-guarantee">
                  <div className="cart-summary-guarantee-item">
                    <span>🔒</span>
                    <span>Bảo mật giao dịch mã hóa tiêu chuẩn SSL</span>
                  </div>
                  <div className="cart-summary-guarantee-item">
                    <span>⚡</span>
                    <span>Đóng gói chống sốc chuyên dụng cho đồ công nghệ</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}

