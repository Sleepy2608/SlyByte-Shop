'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    } else if (requireAdmin && user?.role !== 'ADMIN') {
      router.replace('/');
    }
  }, [isAuthenticated, user, requireAdmin, router, pathname]);

  if (!isAuthenticated || (requireAdmin && user?.role !== 'ADMIN')) {
    return null;
  }

  return children;
};
