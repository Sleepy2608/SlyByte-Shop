-- ============================================================
-- SAMPLE DATA - Shop Bán Hàng Đồ Công Nghệ
-- ============================================================

USE slybyte_shop;

-- ============================================================
-- USERS (password = "password123" - BCrypt hash)
-- ============================================================
INSERT INTO users (full_name, email, password_hash, phone, address, role) VALUES
('Admin System',    'admin@techshop.vn',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0901000001', 'Hà Nội', 'ADMIN'),
('Nguyễn Văn An',  'an.nguyen@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0901000002', '123 Nguyễn Huệ, TP.HCM', 'USER'),
('Trần Thị Bình',  'binh.tran@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0901000003', '45 Lê Lợi, Đà Nẵng', 'USER');

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT INTO categories (name, slug, description, parent_id) VALUES
('Laptop',          'laptop',           'Máy tính xách tay các loại',   NULL),
('Điện thoại',      'dien-thoai',       'Điện thoại thông minh',        NULL),
('Máy tính bảng',   'may-tinh-bang',    'iPad, Android Tablet',         NULL),
('Phụ kiện',        'phu-kien',         'Phụ kiện công nghệ',           NULL),
('Linh kiện',       'linh-kien',        'Linh kiện máy tính',           NULL),
-- Sub-categories của Laptop
('Laptop Gaming',   'laptop-gaming',    'Laptop chuyên game',           1),
('Laptop Văn phòng','laptop-van-phong', 'Laptop mỏng nhẹ, văn phòng',  1),
-- Sub-categories của Phụ kiện
('Chuột & Bàn phím','chuot-ban-phim',  'Chuột, bàn phím gaming & VP',  4),
('Tai nghe',        'tai-nghe',         'Tai nghe có dây & không dây',  4);

-- ============================================================
-- BRANDS
-- ============================================================
INSERT INTO brands (name, slug) VALUES
('Apple',       'apple'),
('Samsung',     'samsung'),
('Asus',        'asus'),
('Dell',        'dell'),
('HP',          'hp'),
('Lenovo',      'lenovo'),
('Sony',        'sony'),
('Logitech',    'logitech');

-- ============================================================
-- PRODUCTS
-- ============================================================
INSERT INTO products (category_id, brand_id, name, slug, description, original_price, sale_price, stock_quantity, status) VALUES
-- Laptop
(1, 1, 'MacBook Pro 14" M3 Pro 2023', 'macbook-pro-14-m3-pro-2023',
 'Laptop cao cấp của Apple với chip M3 Pro mạnh mẽ, màn hình Liquid Retina XDR.',
 49990000, 45990000, 15, 'ACTIVE'),

(1, 3, 'ASUS ROG Strix G16 2024', 'asus-rog-strix-g16-2024',
 'Laptop gaming đỉnh cao với RTX 4070, màn hình 165Hz QHD.',
 35990000, 32990000, 10, 'ACTIVE'),

(1, 4, 'Dell XPS 15 9530', 'dell-xps-15-9530',
 'Laptop văn phòng cao cấp, màn hình OLED 3.5K, mỏng nhẹ sang trọng.',
 42990000, 39990000, 8, 'ACTIVE'),

-- Điện thoại
(2, 1, 'iPhone 15 Pro Max 256GB', 'iphone-15-pro-max-256gb',
 'iPhone flagship 2023 với chip A17 Pro, camera 48MP, khung Titan.',
 34990000, 33490000, 30, 'ACTIVE'),

(2, 2, 'Samsung Galaxy S24 Ultra 256GB', 'samsung-galaxy-s24-ultra-256gb',
 'Flagship của Samsung với S Pen, camera 200MP, AI tích hợp.',
 29990000, 27990000, 25, 'ACTIVE');

-- ============================================================
-- PRODUCT_IMAGES
-- ============================================================
INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(1, 'https://placeholder.com/macbook-pro-14-1.jpg', TRUE,  0),
(1, 'https://placeholder.com/macbook-pro-14-2.jpg', FALSE, 1),
(2, 'https://placeholder.com/asus-rog-g16-1.jpg',   TRUE,  0),
(3, 'https://placeholder.com/dell-xps-15-1.jpg',    TRUE,  0),
(4, 'https://placeholder.com/iphone-15-pro-1.jpg',  TRUE,  0),
(4, 'https://placeholder.com/iphone-15-pro-2.jpg',  FALSE, 1),
(5, 'https://placeholder.com/samsung-s24-ultra-1.jpg', TRUE, 0);

-- ============================================================
-- PRODUCT_SPECS
-- ============================================================
-- MacBook Pro 14 M3 Pro
INSERT INTO product_specs (product_id, spec_group, spec_key, spec_value, sort_order) VALUES
(1, 'CPU',          'Chip xử lý',       'Apple M3 Pro (11-core CPU, 14-core GPU)', 0),
(1, 'Bộ nhớ',       'RAM',              '18GB Unified Memory',                      1),
(1, 'Bộ nhớ',       'Ổ cứng',           '512GB SSD',                                2),
(1, 'Màn hình',     'Kích thước',       '14.2 inch Liquid Retina XDR',              3),
(1, 'Màn hình',     'Độ phân giải',     '3024 x 1964 pixels (254 ppi)',             4),
(1, 'Pin',          'Dung lượng',       '72Wh - Sạc MagSafe 96W',                  5),
(1, 'Hệ điều hành', 'OS',              'macOS Sonoma',                              6),

-- ASUS ROG Strix G16
(2, 'CPU',          'Chip xử lý',       'Intel Core i9-14900HX',                   0),
(2, 'GPU',          'Card đồ họa',      'NVIDIA GeForce RTX 4070 8GB GDDR6',       1),
(2, 'Bộ nhớ',       'RAM',              '16GB DDR5 4800MHz (2 khe mở rộng)',        2),
(2, 'Bộ nhớ',       'Ổ cứng',           '1TB PCIe 4.0 NVMe SSD',                   3),
(2, 'Màn hình',     'Kích thước',       '16 inch QHD+ (2560x1600)',                4),
(2, 'Màn hình',     'Tần số quét',      '165Hz, Adaptive Sync',                    5),
(2, 'Pin',          'Dung lượng',       '90Wh - Sạc 240W',                         6),

-- iPhone 15 Pro Max
(4, 'CPU',          'Chip xử lý',       'Apple A17 Pro (6-core)',                   0),
(4, 'Camera',       'Camera sau',       '48MP Main + 12MP Ultra Wide + 12MP 5x Zoom',1),
(4, 'Camera',       'Camera trước',     '12MP TrueDepth',                           2),
(4, 'Màn hình',     'Kích thước',       '6.7 inch Super Retina XDR OLED',          3),
(4, 'Màn hình',     'Độ phân giải',     '2796 x 1290 pixels (460 ppi)',             4),
(4, 'Bộ nhớ',       'RAM',              '8GB',                                      5),
(4, 'Bộ nhớ',       'Bộ nhớ trong',     '256GB',                                   6),
(4, 'Pin',          'Dung lượng',       '4422 mAh - Sạc 27W, MagSafe 15W',         7),
(4, 'Khung vỏ',     'Chất liệu',        'Khung Titan, Mặt lưng kính mờ',           8),
(4, 'Hệ điều hành', 'OS',              'iOS 17',                                    9);

-- ============================================================
-- CARTS
-- ============================================================
INSERT INTO carts (user_id) VALUES (2), (3);

-- ============================================================
-- CART_ITEMS
-- ============================================================
INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES
(1, 4, 1, 33490000),
(1, 2, 1, 32990000),
(2, 1, 1, 45990000);

-- ============================================================
-- ORDERS
-- ============================================================
INSERT INTO orders (user_id, order_code, total_amount, recipient_name, phone, shipping_address, payment_method, payment_status, order_status) VALUES
(2, 'ORD-20241001-001', 33490000, 'Nguyễn Văn An',  '0901000002', '123 Nguyễn Huệ, Quận 1, TP.HCM', 'COD',           'UNPAID', 'DELIVERED'),
(3, 'ORD-20241001-002', 45990000, 'Trần Thị Bình',  '0901000003', '45 Lê Lợi, Hải Châu, Đà Nẵng',   'BANK_TRANSFER', 'PAID',   'PROCESSING');

-- ============================================================
-- ORDER_ITEMS
-- ============================================================
INSERT INTO order_items (order_id, product_id, product_name, price, quantity, total_price) VALUES
(1, 4, 'iPhone 15 Pro Max 256GB',       33490000, 1, 33490000),
(2, 1, 'MacBook Pro 14" M3 Pro 2023',   45990000, 1, 45990000);

-- ============================================================
-- PAYMENTS
-- ============================================================
INSERT INTO payments (order_id, amount, payment_method, status, paid_at) VALUES
(1, 33490000, 'COD',           'PENDING', NULL),
(2, 45990000, 'BANK_TRANSFER', 'SUCCESS', '2024-10-01 10:30:00');
