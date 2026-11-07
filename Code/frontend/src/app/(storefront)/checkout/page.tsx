'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { orderService } from '@/services/orderService';
import { PaymentMethod } from '@/types/order.types';
import {
  IconShoppingBag,
  IconCash,
  IconBank,
  IconLaptop,
  IconLock,
  IconBolt,
  IconArrowRight,
  IconArrowLeft,
} from '@/components/ui/Icons';
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

  useEffect(() => {
    if (user) {
      if (user.fullName) setRecipientName(user.fullName);
      if (user.phone) setPhone(user.phone);
      if (user.address) setShippingAddress(user.address);
    }
  }, [user]);

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
      setErrorMessage('Giỏ hàng của bạn đang trống. Vui lòng chọn sản phẩm trước khi thanh toán.');
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

      await fetchCart();
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
            <div className="cart-empty-icon">
              <IconShoppingBag size={36} />
            </div>
            <h2 className="cart-empty-title">Giỏ Hàng Đang Trống</h2>
            <p className="cart-empty-desc">
              Không có thiết bị nào để tiến hành thanh toán. Vui lòng chọn sản phẩm trước.
            </p>
            <Link href="/products" className="btn btn-primary btn-lg">
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
        <div className="checkout-header">
          <h1 className="checkout-title">Tiến Hành Đặt Hàng</h1>
          <p className="checkout-subtitle">
            Xác nhận thông tin người nhận và lựa chọn phương thức thanh toán.
          </p>
        </div>

        {errorMessage && (
          <div className="alert alert-error" role="alert">
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="checkout-layout">
            <div className="checkout-main">
              {/* Step 1: Shipping Info */}
              <div className="checkout-section-card">
                <h2 className="checkout-section-title">
                  <span className="step-number">1</span>
                  <span>Thông Tin Giao Nhận Hàng</span>
                </h2>

                <div className="checkout-form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="recipientName">
                      Họ và tên người nhận <span className="label-required">*</span>
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
                      Số điện thoại nhận hàng <span className="label-required">*</span>
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
                      Địa chỉ nhận hàng chi tiết <span className="label-required">*</span>
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
                      Ghi chú giao hàng <span className="label-optional">(Tùy chọn)</span>
                    </label>
                    <textarea
                      id="notes"
                      className="form-textarea"
                      placeholder="Ghi chú thêm về khung giờ nhận hàng hoặc hướng dẫn tòa nhà..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="checkout-section-card">
                <h2 className="checkout-section-title">
                  <span className="step-number">2</span>
                  <span>Phương Thức Thanh Toán</span>
                </h2>

                <div className="payment-methods-grid">
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
                      <IconCash size={18} />
                      <span>Thanh Toán Khi Nhận Hàng (COD)</span>
                    </div>
                    <p className="payment-method-desc">
                      Đồng kiểm thiết bị nguyên niêm phong và thanh toán trực tiếp cho nhân viên giao vận.
                    </p>
                  </label>

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
                      <IconBank size={18} />
                      <span>Chuyển Khoản Ngân Hàng</span>
                    </div>
                    <p className="payment-method-desc">
                      Chuyển khoản đến tài khoản doanh nghiệp SlyByte Shop theo mã đơn hàng định danh.
                    </p>
                  </label>
                </div>
              </div>
            </div>

            <aside className="checkout-sidebar">
              <div className="cart-summary-card">
                <h3 className="cart-summary-title">Kiểm Tra Đơn Hàng</h3>

                <div className="checkout-items-list">
                  {cart.items.map((item) => (
                    <div key={item.id} className="checkout-item-mini">
                      <div className="checkout-item-mini-info">
                        <div className="checkout-item-mini-thumb">
                          {item.productThumbnail ? (
                            <img
                              src={item.productThumbnail}
                              alt={item.productName}
                              className="checkout-item-mini-img"
                            />
                          ) : (
                            <IconLaptop size={20} />
                          )}
                        </div>
                        <div className="checkout-item-mini-meta">
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

                <div className="cart-summary-row">
                  <span>Tạm tính ({cart.totalItems} thiết bị):</span>
                  <span className="tabular-nums">{formatPrice(cart.totalPrice)}</span>
                </div>

                <div className="cart-summary-row">
                  <span>Phí vận chuyển:</span>
                  <span className="text-success-strong">Miễn phí toàn quốc</span>
                </div>

                <div className="cart-summary-row total-row">
                  <span>Tổng thanh toán:</span>
                  <span className="cart-summary-total-price">{formatPrice(cart.totalPrice)}</span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg"
                  disabled={isSubmitting}
                >
                  <span>{isSubmitting ? 'Đang xử lý đơn hàng...' : 'Xác Nhận Đặt Hàng'}</span>
                  {!isSubmitting && <IconArrowRight size={16} />}
                </button>

                <Link href="/cart" className="btn btn-ghost btn-block btn-sm">
                  <IconArrowLeft size={14} />
                  <span>Quay lại chỉnh sửa giỏ hàng</span>
                </Link>

                <div className="cart-summary-guarantee">
                  <div className="cart-summary-guarantee-item">
                    <IconLock size={15} />
                    <span>Bảo mật giao dịch mã hóa tiêu chuẩn TLS</span>
                  </div>
                  <div className="cart-summary-guarantee-item">
                    <IconBolt size={15} />
                    <span>Đóng gói chống sốc chuyên dụng cho phần cứng</span>
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
