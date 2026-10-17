-- ============================================================
-- DATABASE SCHEMA - Shop Bán Hàng Đồ Công Nghệ (MVP)
-- ============================================================

CREATE DATABASE IF NOT EXISTS slybyte_shop
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE slybyte_shop;

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name       VARCHAR(100)    NOT NULL,
    email           VARCHAR(150)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    phone           VARCHAR(15),
    address         TEXT,
    avatar_url      VARCHAR(500),
    role            ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. CATEGORIES
-- ============================================================
CREATE TABLE categories (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL,
    slug        VARCHAR(150)    NOT NULL UNIQUE,
    description TEXT,
    parent_id   BIGINT          DEFAULT NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ============================================================
-- 3. BRANDS
-- ============================================================
CREATE TABLE brands (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL,
    slug        VARCHAR(150)    NOT NULL UNIQUE,
    logo_url    VARCHAR(500),
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. PRODUCTS
-- ============================================================
CREATE TABLE products (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id     BIGINT          NOT NULL,
    brand_id        BIGINT          NOT NULL,
    name            VARCHAR(255)    NOT NULL,
    slug            VARCHAR(300)    NOT NULL UNIQUE,
    description     TEXT,
    original_price  DECIMAL(15, 0)  NOT NULL,
    sale_price      DECIMAL(15, 0)  NOT NULL,
    stock_quantity  INT             NOT NULL DEFAULT 0,
    thumbnail       VARCHAR(500),
    status          ENUM('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK') NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (brand_id)    REFERENCES brands(id)     ON DELETE RESTRICT
);

-- ============================================================
-- 5. PRODUCT_IMAGES
-- ============================================================
CREATE TABLE product_images (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id  BIGINT          NOT NULL,
    image_url   VARCHAR(500)    NOT NULL,
    is_primary  BOOLEAN         NOT NULL DEFAULT FALSE,
    sort_order  INT             NOT NULL DEFAULT 0,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================================
-- 6. PRODUCT_SPECS (Thông số kỹ thuật - Đặc thù đồ công nghệ)
-- ============================================================
CREATE TABLE product_specs (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id  BIGINT          NOT NULL,
    spec_group  VARCHAR(100)    NOT NULL,  -- VD: 'CPU', 'Màn hình', 'Bộ nhớ'
    spec_key    VARCHAR(150)    NOT NULL,  -- VD: 'Chip xử lý', 'Kích thước màn hình'
    spec_value  VARCHAR(500)    NOT NULL,  -- VD: 'Apple M3 Pro', '14.2 inch'
    sort_order  INT             NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================================
-- 7. CARTS
-- ============================================================
CREATE TABLE carts (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT          NOT NULL UNIQUE,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- 8. CART_ITEMS
-- ============================================================
CREATE TABLE cart_items (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id     BIGINT          NOT NULL,
    product_id  BIGINT          NOT NULL,
    quantity    INT             NOT NULL DEFAULT 1,
    price       DECIMAL(15, 0)  NOT NULL,  -- Giá tại thời điểm thêm vào giỏ
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_cart_product (cart_id, product_id),
    FOREIGN KEY (cart_id)    REFERENCES carts(id)    ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================================
-- 9. ORDERS
-- ============================================================
CREATE TABLE orders (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id          BIGINT          NOT NULL,
    order_code       VARCHAR(50)     NOT NULL UNIQUE,   -- VD: ORD-20241001-001
    total_amount     DECIMAL(15, 0)  NOT NULL,
    recipient_name   VARCHAR(100)    NOT NULL,
    phone            VARCHAR(15)     NOT NULL,
    shipping_address TEXT            NOT NULL,
    payment_method   ENUM('COD', 'BANK_TRANSFER', 'VNPAY', 'MOMO') NOT NULL DEFAULT 'COD',
    payment_status   ENUM('UNPAID', 'PAID', 'REFUNDED')             NOT NULL DEFAULT 'UNPAID',
    order_status     ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    notes            TEXT,
    created_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- ============================================================
-- 10. ORDER_ITEMS
-- ============================================================
CREATE TABLE order_items (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id        BIGINT          NOT NULL,
    product_id      BIGINT,
    product_name    VARCHAR(255)    NOT NULL,   -- Snapshot tại thời điểm đặt hàng
    product_thumb   VARCHAR(500),
    price           DECIMAL(15, 0)  NOT NULL,
    quantity        INT             NOT NULL,
    total_price     DECIMAL(15, 0)  NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- ============================================================
-- 11. PAYMENTS
-- ============================================================
CREATE TABLE payments (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id        BIGINT          NOT NULL UNIQUE,
    amount          DECIMAL(15, 0)  NOT NULL,
    payment_method  ENUM('COD', 'BANK_TRANSFER', 'VNPAY', 'MOMO') NOT NULL,
    transaction_id  VARCHAR(255),   -- Mã giao dịch từ cổng thanh toán
    status          ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    paid_at         TIMESTAMP       NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ============================================================
-- INDEXES (Tối ưu truy vấn)
-- ============================================================
CREATE INDEX idx_products_category  ON products(category_id);
CREATE INDEX idx_products_brand     ON products(brand_id);
CREATE INDEX idx_products_status    ON products(status);
CREATE INDEX idx_products_name      ON products(name);
CREATE INDEX idx_orders_user        ON orders(user_id);
CREATE INDEX idx_orders_status      ON orders(order_status);
CREATE INDEX idx_orders_code        ON orders(order_code);
CREATE INDEX idx_cart_items_cart    ON cart_items(cart_id);
CREATE INDEX idx_product_specs_prod ON product_specs(product_id);
