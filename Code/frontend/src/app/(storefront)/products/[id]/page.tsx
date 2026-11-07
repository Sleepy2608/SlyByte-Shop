'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { productService } from '@/services/productService';
import { ProductDetail, ProductSummary } from '@/types/product.types';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductSpecsTable } from '@/components/product/ProductSpecsTable';
import { ProductCard } from '@/components/product/ProductCard';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idOrSlug = params?.id as string;

  const { addItem, isLoading: isCartLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    if (!idOrSlug) return;

    let isCancelled = false;

    async function loadProductData() {
      setLoading(true);
      setError(null);

      try {
        // Hỗ trợ cả tìm theo ID số hoặc tìm theo Slug chữ
        let res: ProductDetail;
        if (/^\d+$/.test(idOrSlug)) {
          res = await productService.getProductById(idOrSlug);
        } else {
          res = await productService.getProductBySlug(idOrSlug);
        }

        if (!isCancelled) {
          setProduct(res);

          // Tải sản phẩm liên quan cùng danh mục
          if (res.category?.id) {
            try {
              const related = await productService.getRelatedProducts(res.id, res.category.id);
              if (!isCancelled) {
                setRelatedProducts(related);
              }
            } catch (relErr) {
              console.error('Lỗi khi tải sản phẩm liên quan:', relErr);
            }
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Lỗi khi tải chi tiết sản phẩm:', err);
          setError('Không thể tìm thấy thông tin thiết bị yêu cầu.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadProductData();

    return () => {
      isCancelled = true;
    };
  }, [idOrSlug]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      if (confirm('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Đi đến trang đăng nhập ngay?')) {
        router.push(`/login?from=/products/${idOrSlug}`);
      }
      return;
    }
    if (!product) return;

    try {
      await addItem(product.id, 1);
      setAddedNotice(true);
      setTimeout(() => {
        setAddedNotice(false);
      }, 3500);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Không thể thêm sản phẩm vào giỏ hàng.');
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      if (confirm('Bạn cần đăng nhập để đặt mua sản phẩm. Đi đến trang đăng nhập ngay?')) {
        router.push(`/login?from=/products/${idOrSlug}`);
      }
      return;
    }
    if (!product) return;

    try {
      await addItem(product.id, 1);
      router.push('/cart');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Không thể thêm sản phẩm vào giỏ hàng.');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div className="skeleton-thumb shimmer" style={{ height: '420px', borderRadius: '12px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="skeleton-line line-sm shimmer" />
            <div className="skeleton-line line-lg shimmer" style={{ height: '32px' }} />
            <div className="skeleton-line line-md shimmer" />
            <div className="skeleton-line line-price shimmer" style={{ height: '50px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '12px', color: 'var(--text-primary)' }}>
          {error || 'Sản phẩm không tồn tại'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Thiết bị bạn đang tìm kiếm có thể đã được gỡ xuống hoặc đổi đường dẫn.
        </p>
        <Link href="/products" className="btn btn-primary">
          Xem các sản phẩm khác
        </Link>
      </div>
    );
  }

  const hasDiscount = product.discountPercentage > 0 && product.originalPrice > product.salePrice;
  const isOutOfStock = product.status === 'OUT_OF_STOCK' || product.stockQuantity <= 0;

  return (
    <div className="detail-page">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb-nav" aria-label="Breadcrumb">
          <Link href="/" className="breadcrumb-link">Trang chủ</Link>
          <span className="breadcrumb-separator">/</span>
          <Link href="/products" className="breadcrumb-link">Sản phẩm</Link>
          {product.category && (
            <>
              <span className="breadcrumb-separator">/</span>
              <Link href={`/products?category=${product.category.id}`} className="breadcrumb-link">
                {product.category.name}
              </Link>
            </>
          )}
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        {/* 2-Column Product Detail Showcase */}
        <div className="detail-grid">
          {/* Cột trái: Gallery ảnh */}
          <ProductGallery
            images={product.images || []}
            fallbackThumbnail={product.thumbnail}
            productName={product.name}
          />

          {/* Cột phải: Thông tin sản phẩm */}
          <div className="detail-info">
            <div className="detail-badges-row">
              {product.brand && (
                <span className="detail-brand-badge">{product.brand.name}</span>
              )}
              {product.category && (
                <span className="detail-category-badge">{product.category.name}</span>
              )}
            </div>

            <h1 className="detail-title">{product.name}</h1>

            {/* Khung giá tiền */}
            <div className="detail-price-box">
              <div className="detail-price-row">
                <span className="detail-sale-price">{formatPrice(product.salePrice)}</span>
                {hasDiscount && (
                  <>
                    <span className="detail-original-price">{formatPrice(product.originalPrice)}</span>
                    <span className="detail-discount-pill">Tiết kiệm {product.discountPercentage}%</span>
                  </>
                )}
              </div>

              {/* Tình trạng tồn kho */}
              <div className={`detail-stock-indicator ${isOutOfStock ? 'out-of-stock' : ''}`}>
                <span className="stock-status-dot" />
                {isOutOfStock ? (
                  <span>Tạm thời hết hàng</span>
                ) : (
                  <span>Còn hàng trong kho ({product.stockQuantity} sản phẩm sẵn có)</span>
                )}
              </div>
            </div>

            {/* Mô tả tóm tắt */}
            {product.description && (
              <div className="detail-desc-box">
                <p>{product.description}</p>
              </div>
            )}

            {/* Nút tác vụ đặt hàng */}
            <div className="detail-actions-row">
              <button
                type="button"
                className="btn btn-outline btn-add-cart"
                disabled={isOutOfStock || isCartLoading}
                onClick={handleAddToCart}
              >
                {isCartLoading ? 'Đang thêm...' : '🛒 Thêm vào giỏ hàng'}
              </button>
              <button
                type="button"
                className="btn btn-primary btn-buy-now"
                disabled={isOutOfStock || isCartLoading}
                onClick={handleBuyNow}
              >
                Mua ngay
              </button>
            </div>

            {addedNotice && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-primary-light)',
                border: '1px solid var(--color-primary-border)',
                color: 'var(--color-primary)',
                fontSize: '0.875rem',
                fontWeight: 600
              }}>
                ✓ Đã thêm sản phẩm vào giỏ hàng thành công!
              </div>
            )}
          </div>
        </div>

        {/* Bảng thông số kỹ thuật chi tiết Specs */}
        <ProductSpecsTable specs={product.specs || []} />

        {/* Danh sách sản phẩm liên quan */}
        {relatedProducts.length > 0 && (
          <section className="related-section">
            <h3 className="related-title">Thiết Bị Cùng Danh Mục Đề Xuất</h3>
            <div className="catalog-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

