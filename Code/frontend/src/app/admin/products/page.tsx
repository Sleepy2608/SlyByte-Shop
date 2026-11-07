'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { productService } from '@/services/productService';
import { adminService } from '@/services/adminService';
import { ProductSummary, Category, Brand } from '@/types/product.types';
import { AdminProductPayload } from '@/types/admin.types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal thêm/sửa sản phẩm
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<number>(1);
  const [formBrand, setFormBrand] = useState<number>(1);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(0);
  const [formSalePrice, setFormSalePrice] = useState<number>(0);
  const [formStock, setFormStock] = useState<number>(10);
  const [formThumbnail, setFormThumbnail] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = useCallback(async (targetPage = 0) => {
    setLoading(true);
    try {
      const data = await productService.getProducts({
        page: targetPage,
        size: 10,
        keyword: keyword.trim() || undefined,
        categoryId: selectedCategory || undefined,
        brandId: selectedBrand || undefined,
      });
      setProducts(data.items || []);
      setPage(data.page);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Lỗi khi tải danh sách sản phẩm:', err);
    } finally {
      setLoading(false);
    }
  }, [keyword, selectedCategory, selectedBrand]);

  useEffect(() => {
    // Tải danh mục và thương hiệu
    Promise.all([productService.getCategories(), productService.getBrands()])
      .then(([cats, brds]) => {
        setCategories(cats);
        setBrands(brds);
        if (cats.length > 0) setFormCategory(cats[0].id);
        if (brds.length > 0) setFormBrand(brds[0].id);
      })
      .catch(console.error);

    fetchProducts(0);
  }, [fetchProducts]);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormName('');
    setFormOriginalPrice(30000000);
    setFormSalePrice(28990000);
    setFormStock(15);
    setFormThumbnail('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop');
    setFormDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: ProductSummary) => {
    setEditingId(p.id);
    setFormName(p.name);
    setFormOriginalPrice(p.originalPrice);
    setFormSalePrice(p.salePrice);
    setFormStock(p.stockQuantity);
    setFormThumbnail(p.thumbnail || '');
    setFormCategory(p.categoryId || 1);
    setFormBrand(p.brandId || 1);
    setFormDescription('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Vui lòng nhập tên thiết bị!');
      return;
    }

    const payload: AdminProductPayload = {
      name: formName.trim(),
      categoryId: formCategory,
      brandId: formBrand,
      originalPrice: formOriginalPrice,
      salePrice: formSalePrice,
      stockQuantity: formStock,
      thumbnail: formThumbnail.trim() || undefined,
      description: formDescription.trim() || undefined,
    };

    setIsSubmitting(true);
    try {
      if (editingId) {
        await adminService.updateProduct(editingId, payload);
        alert('Cập nhật thông tin thiết bị thành công!');
      } else {
        await adminService.createProduct(payload);
        alert('Thêm thiết bị mới vào danh mục thành công!');
      }
      setIsModalOpen(false);
      await fetchProducts(page);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Lỗi khi lưu sản phẩm.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa/ẩn thiết bị "${name}"?`)) {
      try {
        await adminService.deleteProduct(id);
        alert('Đã xóa sản phẩm thành công!');
        await fetchProducts(page);
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : 'Không thể xóa sản phẩm.');
      }
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  return (
    <div>
      <div className="admin-table-card">
        {/* Toolbar */}
        <div className="admin-table-toolbar">
          <h2 className="admin-table-title">Quản Lý Sản Phẩm & Kho Hàng</h2>

          <div className="admin-table-filters">
            {/* Search */}
            <input
              type="text"
              className="admin-select"
              placeholder="Tìm kiếm thiết bị..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchProducts(0)}
              style={{ minWidth: '180px' }}
            />

            {/* Category */}
            <select
              className="admin-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Brand */}
            <select
              className="admin-select"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="">Tất cả hãng</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleOpenCreateModal}
              style={{ whiteSpace: 'nowrap' }}
            >
              + Thêm Thiết Bị
            </button>
          </div>
        </div>

        {/* Bảng sản phẩm */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên thiết bị</th>
                <th>Hãng</th>
                <th>Danh mục</th>
                <th>Giá bán</th>
                <th>Tồn kho</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '32px' }}>
                    Đang nạp dữ liệu sản phẩm...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    Không có sản phẩm nào phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ width: '44px', height: '44px', borderRadius: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {p.thumbnail ? (
                          <img src={p.thumbnail} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                          <span>💻</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        ID: #{p.id}
                      </span>
                    </td>
                    <td>
                      <span className="product-brand-tag" style={{ fontSize: '0.72rem' }}>
                        {p.brandName || 'N/A'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{p.categoryName || 'N/A'}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                        {formatPrice(p.salePrice)}
                      </div>
                      {p.originalPrice > p.salePrice && (
                        <div style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                          {formatPrice(p.originalPrice)}
                        </div>
                      )}
                    </td>
                    <td>
                      <strong style={{ color: p.stockQuantity <= 3 ? '#ff4d4f' : 'inherit' }}>
                        {p.stockQuantity}
                      </strong>{' '}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>máy</span>
                    </td>
                    <td>
                      {p.status === 'ACTIVE' && p.stockQuantity > 0 ? (
                        <span className="badge-status status-delivered">Đang bán</span>
                      ) : (
                        <span className="badge-status status-cancelled">Hết hàng</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                          onClick={() => handleOpenEditModal(p)}
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.8rem', color: '#ff4d4f' }}
                          onClick={() => handleDelete(p.id, p.name)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '16px' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              disabled={page <= 0}
              onClick={() => fetchProducts(page - 1)}
            >
              &larr; Trang trước
            </button>
            <span style={{ alignSelf: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Trang {page + 1} / {totalPages}
            </span>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              disabled={page >= totalPages - 1}
              onClick={() => fetchProducts(page + 1)}
            >
              Trang sau &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Modal Thêm / Chỉnh Sửa Sản Phẩm */}
      {isModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingId ? `Cập Nhật Thiết Bị #${editingId}` : 'Thêm Thiết Bị Công Nghệ Mới'}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="form-group">
                  <label className="form-label">Tên thiết bị công nghệ <span style={{ color: '#ff4d4f' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="VD: MacBook Pro 16 inch M3 Max"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Danh mục</label>
                    <select
                      className="form-input"
                      value={formCategory}
                      onChange={(e) => setFormCategory(Number(e.target.value))}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hãng sản xuất</label>
                    <select
                      className="form-input"
                      value={formBrand}
                      onChange={(e) => setFormBrand(Number(e.target.value))}
                    >
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Giá niêm yết (VND)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formOriginalPrice}
                      onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Giá khuyến mãi (VND)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formSalePrice}
                      onChange={(e) => setFormSalePrice(Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tồn kho</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formStock}
                      onChange={(e) => setFormStock(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">URL ảnh đại diện (Thumbnail)</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://..."
                    value={formThumbnail}
                    onChange={(e) => setFormThumbnail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mô tả tóm tắt tính năng</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Giới thiệu điểm nổi bật về hiệu năng, màn hình, cấu hình..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang lưu...' : editingId ? 'Lưu Cập Nhật' : 'Tạo Mới Thiết Bị'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

