'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/AuthLayout';
import { useAuthStore } from '@/store/useAuthStore';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    phone?: string;
  }>({});

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const errors: typeof validationErrors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Vui lòng nhập họ và tên.';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Họ và tên tối thiểu 2 ký tự.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Vui lòng nhập địa chỉ email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Định dạng email không hợp lệ.';
    }

    if (!formData.password) {
      errors.password = 'Vui lòng nhập mật khẩu.';
    } else if (formData.password.length < 8) {
      errors.password = 'Mật khẩu phải có ít nhất 8 ký tự theo quy định bảo mật.';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận lại mật khẩu.';
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }

    if (formData.phone.trim() && !/^[0-9]{10,11}$/.test(formData.phone.trim())) {
      errors.phone = 'Số điện thoại phải từ 10 - 11 chữ số.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
      });
      router.replace('/');
    } catch {
      // Error is caught and tracked in Zustand store
    }
  };

  return (
    <AuthLayout
      title="Tạo tài khoản mới"
      subtitle="Trở thành thành viên Slybyte để nhận quyền lợi và ưu đãi đặc quyền."
    >
      {error && (
        <div className="alert alert-error" role="alert" aria-live="assertive">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="reg-fullName" className="form-label">
            Họ và tên <span className="label-required">*</span>
          </label>
          <input
            id="reg-fullName"
            name="fullName"
            type="text"
            className={`form-input ${validationErrors.fullName ? 'has-error' : ''}`}
            placeholder="Ví dụ: Nguyễn Văn A"
            value={formData.fullName}
            onChange={handleChange}
            disabled={isLoading}
            autoComplete="name"
            autoFocus
          />
          {validationErrors.fullName && (
            <p className="form-error">{validationErrors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="reg-email" className="form-label">
            Email <span className="label-required">*</span>
          </label>
          <input
            id="reg-email"
            name="email"
            type="email"
            className={`form-input ${validationErrors.email ? 'has-error' : ''}`}
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            autoComplete="email"
          />
          {validationErrors.email && (
            <p className="form-error">{validationErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="reg-password" className="form-label">
            Mật khẩu (tối thiểu 8 ký tự) <span className="label-required">*</span>
          </label>
          <div className="input-password-wrapper">
            <input
              id="reg-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className={`form-input ${validationErrors.password ? 'has-error' : ''}`}
              placeholder="Nhập ít nhất 8 ký tự"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? 'Ẩn' : 'Hiện'}
            </button>
          </div>
          {validationErrors.password && (
            <p className="form-error">{validationErrors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label htmlFor="reg-confirmPassword" className="form-label">
            Xác nhận mật khẩu <span className="label-required">*</span>
          </label>
          <input
            id="reg-confirmPassword"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            className={`form-input ${validationErrors.confirmPassword ? 'has-error' : ''}`}
            placeholder="Nhập lại mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            autoComplete="new-password"
          />
          {validationErrors.confirmPassword && (
            <p className="form-error">{validationErrors.confirmPassword}</p>
          )}
        </div>

        {/* Phone & Address in grid */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="reg-phone" className="form-label">
              Số điện thoại <span className="label-optional">(tùy chọn)</span>
            </label>
            <input
              id="reg-phone"
              name="phone"
              type="tel"
              className={`form-input ${validationErrors.phone ? 'has-error' : ''}`}
              placeholder="0912345678"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="tel"
            />
            {validationErrors.phone && (
              <p className="form-error">{validationErrors.phone}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="reg-address" className="form-label">
              Địa chỉ <span className="label-optional">(tùy chọn)</span>
            </label>
            <input
              id="reg-address"
              name="address"
              type="text"
              className="form-input"
              placeholder="Hà Nội, TP.HCM..."
              value={formData.address}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="street-address"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner" aria-hidden="true"></span>
              <span>Đang tạo tài khoản...</span>
            </>
          ) : (
            'Đăng ký tài khoản'
          )}
        </button>

        {/* Footer */}
        <div className="auth-form-footer">
          <span>Đã có tài khoản Slybyte? </span>
          <Link href="/login" className="auth-link">
            Đăng nhập ngay
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
