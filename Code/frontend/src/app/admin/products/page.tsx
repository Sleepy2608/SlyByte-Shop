'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { productService } from '@/services/productService';
import { adminService } from '@/services/adminService';
import { ProductSummary, Category, Brand } from '@/types/product.types';
import { AdminProductPayload } from '@/types/admin.types';
import { IconLaptop, IconX, IconArrowLeft, IconArrowRight } from '@/components/ui/Icons';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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
    setFeedbackMsg(null);
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
    setFeedbackMsg(null);
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
      setFeedbackMsg({ type: 'error', text: 'Vui lòng nhập tên thiết bị.' });
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
    setFeedbackMsg(null);
    try {
      if (editingId) {
        await adminService.updateProduct(editingId, payload);
        setFeedbackMsg({ type: 'success', text: `Đã cập nhật thiết bị "${payload.name}" thành công.` });
      } else {
        await adminService.createProduct(payload);
        setFeedbackMsg({ type: 'success', text: `Đã thêm thiết bị "${payload.name}" vào kho hàng.` });
      }
      setIsModalOpen(false);
      await fetchProducts(page);
    } catch (err: unknown) {
      setFeedbackMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'Lỗi khi lưu thông tin sản phẩm.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    setFeedbackMsg(null);
    try {
      await adminService.deleteProduct(id);
      setFeedbackMsg({ type: 'success', text: `Đã gỡ thiết bị "${name}" khỏi danh mục.` });
      await fetchProducts(page);
    } catch (err: unknown) {
      setFeedbackMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'Không thể xóa sản phẩm.',
      });
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
      {feedbackMsg && (
        <div
          className={`alert ${feedbackMsg.type === 'success' ? 'alert-success' : 'alert-error'} alert-dismissible`}
          role="status"
        >
          <span>{feedbackMsg.text}</span>
          <button
            type="button"
            className="alert-close-btn"
            onClick={() => setFeedbackMsg(null)}
            aria-label="Đóng thông báo"
          >
            <IconX size={16} />
          </button>
        </div>
      )}

      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <h2 className="admin-table-title">Quản Lý Sản Phẩm &amp; Kho Hàng</h2>

          <div className="admin-table-filters">
            <input
              type="text"
              className="admin-select"
              placeholder="Tìm kiếm thiết bị..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchProducts(0)}
            />

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
            >
              + Thêm Thiết Bị
            </button>
          </div>
        </div>

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
                  <td colSpan={8} className="admin-table-empty">
                    Đang nạp dữ liệu sản phẩm...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="admin-table-empty">
                    Không có sản phẩm nào phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="admin-product-thumb">
                        {p.thumbnail ? (
                          <img src={p.thumbnail} alt={p.name} className="admin-product-thumb-img" />
                        ) : (
                          <IconLaptop size={18} />
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="text-strong">{p.name}</div>
                      <span className="mono-id">ID #{p.id}</span>
                    </td>
                    <td>
                      <span className="detail-category-badge">{p.brandName || 'N/A'}</span>
                    </td>
                    <td className="text-muted-sm">{p.categoryName || 'N/A'}</td>
                    <td>
                      <div className="text-accent tabular-nums">{formatPrice(p.salePrice)}</div>
                      {p.originalPrice > p.salePrice && (
                        <div className="product-original-price tabular-nums">
                          {formatPrice(p.originalPrice)}
                        </div>
                      )}
                    </td>
                    <td className="tabular-nums">
                      <strong className={p.stockQuantity <= 3 ? 'text-danger' : 'text-strong'}>
                        {p.stockQuantity}
                      </strong>{' '}
                      <span className="text-muted-sm">máy</span>
                    </td>
                    <td>
                      {p.status === 'ACTIVE' && p.stockQuantity > 0 ? (
                        <span className="badge-status status-delivered">Đang bán</span>
                      ) : (
                        <span className="badge-status status-cancelled">Hết hàng</span>
                      )}
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => handleOpenEditModal(p)}
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm btn-danger-ghost"
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

        {totalPages > 1 && (
          <div className="admin-pagination-bar">
            <button
              type="button"
              className="pagination-btn"
              disabled={page <= 0}
              onClick={() => fetchProducts(page - 1)}
            >
              <IconArrowLeft size={14} />
              <span>Trang trước</span>
            </button>
            <span className="pagination-status-text">
              Trang {page + 1} / {totalPages}
            </span>
            <button
              type="button"
              className="pagination-btn"
              disabled={page >= totalPages - 1}
              onClick={() => fetchProducts(page + 1)}
            >
              <span>Trang sau</span>
              <IconArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

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
                aria-label="Đóng hộp thoại"
              >
                <IconX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="prod-name">
                    Tên thiết bị công nghệ <span className="label-required">*</span>
                  </label>
                  <input
                    id="prod-name"
                    type="text"
                    className="form-input"
                    placeholder="VD: MacBook Pro 16 inch M3 Max"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                </div>

                <div className="checkout-form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-cat">Danh mục</label>
                    <select
                      id="prod-cat"
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
                    <label className="form-label" htmlFor="prod-brand">Hãng sản xuất</label>
                    <select
                      id="prod-brand"
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

                <div className="admin-form-grid-3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-orig-price">Giá niêm yết (VND)</label>
                    <input
                      id="prod-orig-price"
                      type="number"
                      className="form-input"
                      value={formOriginalPrice}
                      onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-sale-price">Giá bán (VND)</label>
                    <input
                      id="prod-sale-price"
                      type="number"
                      className="form-input"
                      value={formSalePrice}
                      onChange={(e) => setFormSalePrice(Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-stock">Tồn kho</label>
                    <input
                      id="prod-stock"
                      type="number"
                      className="form-input"
                      value={formStock}
                      onChange={(e) => setFormStock(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="prod-thumb">URL ảnh đại diện (Thumbnail)</label>
                  <input
                    id="prod-thumb"
                    type="url"
                    className="form-input"
                    placeholder="https://..."
                    value={formThumbnail}
                    onChange={(e) => setFormThumbnail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="prod-desc">Mô tả tóm tắt tính năng</label>
                  <textarea
                    id="prod-desc"
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
