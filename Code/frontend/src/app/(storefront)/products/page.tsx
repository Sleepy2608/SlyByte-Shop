'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { productService } from '@/services/productService';
import { Category, Brand, ProductSummary } from '@/types/product.types';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductFilter } from '@/components/product/ProductFilter';
import { ProductSort } from '@/components/product/ProductSort';
import { ProductSkeleton } from '@/components/product/ProductSkeleton';
import { IconSearch, IconArrowLeft, IconArrowRight } from '@/components/ui/Icons';

function ProductsCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get('category');
  const brandParam = searchParams.get('brand');
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const keywordParam = searchParams.get('q');
  const pageParam = searchParams.get('page');
  const sortParam = searchParams.get('sort');

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(pageParam ? Number(pageParam) : 0);
  const [searchInput, setSearchInput] = useState(keywordParam || '');

  const selectedCategoryId = categoryParam ? Number(categoryParam) : undefined;
  const selectedBrandId = brandParam ? Number(brandParam) : undefined;
  const selectedMinPrice = minPriceParam ? Number(minPriceParam) : undefined;
  const selectedMaxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;
  const currentSort = sortParam || 'newest';

  useEffect(() => {
    async function loadMetadata() {
      try {
        const [cats, brs] = await Promise.all([
          productService.getCategories(),
          productService.getBrands(),
        ]);
        setCategories(cats);
        setBrands(brs);
      } catch (err) {
        console.error('Lỗi khi tải danh mục hoặc thương hiệu:', err);
      }
    }
    loadMetadata();
  }, []);

  const updateUrlParams = useCallback(
    (newParams: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });

      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    let isCancelled = false;

    async function loadProducts() {
      setLoading(true);
      try {
        const pageIdx = pageParam ? Number(pageParam) : 0;
        setCurrentPage(pageIdx);

        const res = await productService.getProducts({
          categoryId: categoryParam ? Number(categoryParam) : undefined,
          brandId: brandParam ? Number(brandParam) : undefined,
          minPrice: minPriceParam ? Number(minPriceParam) : undefined,
          maxPrice: maxPriceParam ? Number(maxPriceParam) : undefined,
          keyword: keywordParam || undefined,
          page: pageIdx,
          size: 12,
          sort: sortParam || 'newest',
        });

        if (!isCancelled) {
          setProducts(res.items || []);
          setTotalElements(res.totalElements || 0);
          setTotalPages(res.totalPages || 0);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Lỗi khi tải danh sách sản phẩm:', err);
          setProducts([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isCancelled = true;
    };
  }, [categoryParam, brandParam, minPriceParam, maxPriceParam, keywordParam, pageParam, sortParam]);

  const handleCategoryChange = (catId?: number) => {
    updateUrlParams({ category: catId, page: 0 });
  };

  const handleBrandChange = (brandId?: number) => {
    updateUrlParams({ brand: brandId, page: 0 });
  };

  const handlePriceChange = (min?: number, max?: number) => {
    updateUrlParams({ minPrice: min, maxPrice: max, page: 0 });
  };

  const handleSortChange = (sort: string) => {
    updateUrlParams({ sort, page: 0 });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({ q: searchInput.trim() || undefined, page: 0 });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    router.push('/products');
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="catalog-page">
      <div className="container">
        <div className="catalog-header">
          <h1 className="catalog-title">Kho Thiết Bị Công Nghệ</h1>
          <p className="catalog-subtitle">
            Tra cứu và lọc cấu hình phần cứng chính hãng theo danh mục, thương hiệu và phân khúc ngân sách.
          </p>

          <form onSubmit={handleSearchSubmit} className="catalog-search-container">
            <span className="catalog-search-icon">
              <IconSearch size={16} />
            </span>
            <input
              type="text"
              placeholder="Tìm theo tên máy, chip xử lý, card đồ họa..."
              className="catalog-search-input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
        </div>

        <div className="catalog-layout">
          <ProductFilter
            categories={categories}
            brands={brands}
            selectedCategoryId={selectedCategoryId}
            selectedBrandId={selectedBrandId}
            selectedMinPrice={selectedMinPrice}
            selectedMaxPrice={selectedMaxPrice}
            onCategoryChange={handleCategoryChange}
            onBrandChange={handleBrandChange}
            onPriceChange={handlePriceChange}
            onReset={handleResetFilters}
          />

          <div className="catalog-products-col">
            <ProductSort
              totalItems={totalElements}
              currentSort={currentSort}
              onSortChange={handleSortChange}
            />

            {loading ? (
              <ProductSkeleton count={6} />
            ) : products.length > 0 ? (
              <>
                <div className="catalog-grid">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination-wrapper">
                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={currentPage <= 0}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <IconArrowLeft size={14} />
                      <span>Trang trước</span>
                    </button>

                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`pagination-page-chip ${currentPage === idx ? 'active' : ''}`}
                        onClick={() => handlePageChange(idx)}
                      >
                        {idx + 1}
                      </button>
                    ))}

                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={currentPage >= totalPages - 1}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <span>Trang sau</span>
                      <IconArrowRight size={14} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="catalog-empty-state">
                <span className="catalog-empty-icon">
                  <IconSearch size={36} />
                </span>
                <h3 className="catalog-empty-title">Không tìm thấy thiết bị phù hợp</h3>
                <p className="catalog-empty-desc">
                  Thử thay đổi khoảng giá, thương hiệu hoặc tìm kiếm bằng từ khóa cấu hình khác.
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleResetFilters}
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container section"><ProductSkeleton count={6} /></div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}
