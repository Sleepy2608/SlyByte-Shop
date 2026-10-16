'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthLayout } from '@/components/AuthLayout';
import { useAuthStore } from '@/store/useAuthStore';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

  const from = searchParams.get('from') || '/';

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(from);
    }
  }, [isAuthenticated, router, from]);

  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'Vui lòng nhập địa chỉ email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Định dạng email không hợp lệ.';
    }

    if (!password) {
      errors.password = 'Vui lòng nhập mật khẩu.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login({ email: email.trim(), password });
      router.replace(from);
    } catch {
      // Error is tracked in useAuthStore.error
    }
  };

  return (
    <AuthLayout
      title="Chào mừng trở lại"
      subtitle="Đăng nhập để quản lý giỏ hàng, đơn hàng và ưu đãi của bạn."
    >
      {error && (
        <div className="alert alert-error" role="alert" aria-live="assertive">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Email field */}
        <div className="form-group">
          <label htmlFor="login-email" className="form-label">
            Email <span className="label-required">*</span>
          </label>
          <input
            id="login-email"
            type="email"
            className={`form-input ${validationErrors.email ? 'has-error' : ''}`}
            placeholder="name@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (validationErrors.email) {
                setValidationErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            disabled={isLoading}
            autoComplete="email"
            autoFocus
          />
          {validationErrors.email && (
            <p className="form-error">{validationErrors.email}</p>
          )}
        </div>

        {/* Password field */}
        <div className="form-group">
          <div className="form-label-row">
            <label htmlFor="login-password" className="form-label">
              Mật khẩu <span className="label-required">*</span>
            </label>
          </div>
          <div className="input-password-wrapper">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className={`form-input ${validationErrors.password ? 'has-error' : ''}`}
              placeholder="Nhập mật khẩu của bạn"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password) {
                  setValidationErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              disabled={isLoading}
              autoComplete="current-password"
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

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner" aria-hidden="true"></span>
              <span>Đang xác thực...</span>
            </>
          ) : (
            'Đăng nhập'
          )}
        </button>

        {/* Footer links */}
        <div className="auth-form-footer">
          <span>Chưa có tài khoản Slybyte? </span>
          <Link href="/register" className="auth-link">
            Đăng ký ngay
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="auth-page"><span className="spinner"></span></div>}>
      <LoginForm />
    </Suspense>
  );
}
