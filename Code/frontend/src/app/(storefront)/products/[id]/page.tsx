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
import { IconShoppingBag, IconCheck } from '@/components/ui/Icons';

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
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!idOrSlug) return;

    let isCancelled = false;

    async function loadProductData() {
      setLoading(true);
      setError(null);

      try {
        let res: ProductDetail;
        if (/^\d+$/.test(idOrSlug)) {
          res = await productService.getProductById(idOrSlug);
        } else {
          res = await productService.getProductBySlug(idOrSlug);
        }

        if (!isCancelled) {
          setProduct(res);

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
    setActionError(null);
    if (!isAuthenticated) {
      router.push(`/login?from=/products/${idOrSlug}`);
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
      setActionError(err instanceof Error ? err.message : 'Không thể thêm sản phẩm vào giỏ hàng.');
    }
  };

  const handleBuyNow = async () => {
    setActionError(null);
    if (!isAuthenticated) {
      router.push(`/login?from=/products/${idOrSlug}`);
      return;
    }
    if (!product) return;

    try {
      await addItem(product.id, 1);
      router.push('/cart');
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Không thể thêm sản phẩm vào giỏ hàng.');
    }
  };

  if (loading) {
    return (
      <div className="container detail-page">
        <div className="detail-grid">
          <div className="skeleton-thumb shimmer detail-skeleton-gallery" />
          <div className="detail-info">
            <div className="skeleton-line line-sm shimmer" />
            <div className="skeleton-line line-lg shimmer" />
            <div className="skeleton-line line-md shimmer" />
            <div className="skeleton-line line-price shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container detail-page">
        <div className="catalog-empty-state">
          <h2 className="catalog-empty-title">{error || 'Sản phẩm không tồn tại'}</h2>
          <p className="catalog-empty-desc">
            Thiết bị bạn đang tìm kiếm có thể đã được gỡ xuống hoặc thay đổi đường dẫn.
          </p>
          <Link href="/products" className="btn btn-primary">
            Xem các thiết bị khác
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = product.discountPercentage > 0 && product.originalPrice > product.salePrice;
  const isOutOfStock = product.status === 'OUT_OF_STOCK' || product.stockQuantity <= 0;

  return (
    <div className="detail-page">
      <div className="container">
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

        <div className="detail-grid">
          <ProductGallery
            images={product.images || []}
            fallbackThumbnail={product.thumbnail}
            productName={product.name}
          />

          <div className="detail-info">
            <div className="detail-badges-row">
              {product.brand && (
                <span className="detail-brand-badge">{product.brand.name}</span>
              )}
              {product.category && (
                <span className="detail-category-badge">{product.category.name}</span>
              )}
              <span className="detail-category-badge">SKU #{String(product.id).padStart(4, '0')}</span>
            </div>

            <h1 className="detail-title">{product.name}</h1>

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

              <div className={`detail-stock-indicator ${isOutOfStock ? 'out-of-stock' : ''}`}>
                <span className="stock-status-dot" />
                {isOutOfStock ? (
                  <span>Tạm thời hết hàng</span>
                ) : (
                  <span>Sẵn hàng trong kho ({product.stockQuantity} thiết bị)</span>
                )}
              </div>
            </div>

            {product.description && (
              <div className="detail-desc-box">
                <p>{product.description}</p>
              </div>
            )}

            <div className="detail-actions-row">
              <button
                type="button"
                className="btn btn-outline btn-add-cart"
                disabled={isOutOfStock || isCartLoading}
                onClick={handleAddToCart}
              >
                <IconShoppingBag size={18} />
                <span>{isCartLoading ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}</span>
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
              <div className="alert alert-success" role="status">
                <IconCheck size={16} />
                <span>Đã thêm sản phẩm vào giỏ hàng thành công.</span>
              </div>
            )}

            {actionError && (
              <div className="alert alert-error" role="alert">
                <span>{actionError}</span>
              </div>
            )}
          </div>
        </div>

        <ProductSpecsTable specs={product.specs || []} />

        {relatedProducts.length > 0 && (
          <section className="related-section">
            <h3 className="related-title">Thiết Bị Cùng Danh Mục</h3>
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
