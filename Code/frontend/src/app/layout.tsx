import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthInitializer } from '@/components/AuthInitializer';

export const metadata: Metadata = {
  title: 'SlyByte Shop — Nền Tảng Thiết Bị Công Nghệ Cao Cấp',
  description: 'Hệ sinh thái thiết bị công nghệ chính hãng Slybyte. Phân phối Laptop Flagship, Gaming Pro, Smartphone và Linh kiện chuẩn hóa.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
}
