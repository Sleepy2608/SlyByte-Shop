-- ============================================================
-- SLYBYTE SHOP - SEED DATA (PHASE 4: CATALOG & SPECS)
-- ============================================================

USE slybyte_shop;

-- Xóa dữ liệu cũ theo thứ tự ràng buộc khóa ngoại (để có thể chạy lại nhiều lần an toàn)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE payments;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE cart_items;
TRUNCATE TABLE carts;
TRUNCATE TABLE product_specs;
TRUNCATE TABLE product_images;
TRUNCATE TABLE products;
TRUNCATE TABLE brands;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 1. USERS (Mật khẩu mặc định: 'password123' - BCrypt hash)
-- ============================================================
INSERT INTO users (id, full_name, email, password_hash, phone, address, role, is_active) VALUES
(1, 'Admin SlyByte', 'admin@slybyte.vn', '', '0901000001', 'Tòa nhà Landmark 81, TP.HCM', 'ADMIN', TRUE),
(2, 'Nguyễn Văn An', 'an.nguyen@gmail.com', '', '0901000002', '123 Nguyễn Huệ, Quận 1, TP.HCM', 'USER', TRUE),
(3, 'Trần Thị Bình', 'binh.tran@gmail.com', '', '0901000003', '45 Lê Lợi, Hải Châu, Đà Nẵng', 'USER', TRUE);

-- ============================================================
-- 2. CATEGORIES (Danh mục phân cấp)
-- ============================================================
INSERT INTO categories (id, name, slug, description, parent_id) VALUES
(1, 'Laptop', 'laptop', 'Máy tính xách tay cấu hình cao', NULL),
(2, 'Điện thoại', 'dien-thoai', 'Smartphone thông minh cao cấp', NULL),
(3, 'Tai nghe & Âm thanh', 'tai-nghe-am-thanh', 'Tai nghe chống ồn, loa Bluetooth', NULL),
(4, 'Phụ kiện máy tính', 'phu-kien-may-tinh', 'Bàn phím cơ, chuột gaming & công thái học', NULL),
-- Danh mục con của Laptop
(5, 'Laptop Gaming', 'laptop-gaming', 'Laptop chuyên game, đồ họa nặng', 1),
(6, 'Laptop Doanh nhân', 'laptop-doanh-nhan', 'Laptop mỏng nhẹ, pin trâu, bảo mật cao', 1),
-- Danh mục con của Phụ kiện
(7, 'Chuột máy tính', 'chuot-may-tinh', 'Chuột không dây, chuột công thái học', 4),
(8, 'Bàn phím cơ', 'ban-phim-co', 'Bàn phím cơ custom, bàn phím văn phòng', 4);

-- ============================================================
-- 3. BRANDS (Thương hiệu công nghệ hàng đầu)
-- ============================================================
INSERT INTO brands (id, name, slug, logo_url) VALUES
(1, 'Apple', 'apple', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100&auto=format&fit=crop&q=80'),
(2, 'ASUS', 'asus', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=100&auto=format&fit=crop&q=80'),
(3, 'Dell', 'dell', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100&auto=format&fit=crop&q=80'),
(4, 'Lenovo', 'lenovo', 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=100&auto=format&fit=crop&q=80'),
(5, 'Samsung', 'samsung', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&auto=format&fit=crop&q=80'),
(6, 'Sony', 'sony', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80'),
(7, 'Logitech', 'logitech', 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=100&auto=format&fit=crop&q=80');

-- ============================================================
-- 4. PRODUCTS (Sản phẩm công nghệ nổi bật)
-- ============================================================
INSERT INTO products (id, category_id, brand_id, name, slug, description, original_price, sale_price, stock_quantity, thumbnail, status) VALUES
-- 1. MacBook Pro 14 M3 Pro
(1, 1, 1, 'MacBook Pro 14 inch M3 Pro (18GB/512GB)', 'macbook-pro-14-m3-pro',
 'MacBook Pro 14 inch 2023 trang bị chip Apple M3 Pro vượt trội về hiệu năng render và xử lý AI, màn hình Liquid Retina XDR 120Hz ProMotion và thời lượng pin ấn tượng lên đến 18 giờ liên tục.',
 49990000, 45990000, 15, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80', 'ACTIVE'),

-- 2. ASUS ROG Strix G16 2024
(2, 5, 2, 'ASUS ROG Strix G16 G614JVR (i9-14900HX / RTX 4080)', 'asus-rog-strix-g16-2024',
 'Cỗ máy chiến game tối thượng với CPU Intel Core i9 Gen 14th, GPU RTX 4080 12GB TGP 175W, hệ thống tản nhiệt 3 quạt thông minh kèm màn hình ROG Nebula 240Hz 2.5K chuẩn màu DCI-P3.',
 58990000, 54990000, 8, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80', 'ACTIVE'),

-- 3. Dell XPS 15 9530
(3, 6, 3, 'Dell XPS 15 9530 OLED (Core i7-13700H / 16GB / 1TB)', 'dell-xps-15-9530',
 'Tuyệt tác máy tính doanh nhân với khung nhôm CNC nguyên khối, chiếu nghỉ tay sợi carbon cao cấp, màn hình cảm ứng 3.5K OLED rực rỡ và loa vòm Waves Nx 3D.',
 47990000, 43500000, 10, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80', 'ACTIVE'),

-- 4. Lenovo ThinkPad X1 Carbon Gen 11
(4, 6, 4, 'Lenovo ThinkPad X1 Carbon Gen 11 (Core i7 / 16GB / 512GB)', 'thinkpad-x1-carbon-gen-11',
 'Biểu tượng laptop doanh nghiệp siêu mỏng nhẹ chỉ 1.12kg, chuẩn độ bền quân đội MIL-STD 810H, bàn phím huyền thoại gõ êm ái cùng hệ thống bảo mật vân tay & nhận diện gương mặt IR.',
 42500000, 38990000, 12, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80', 'ACTIVE'),

-- 5. iPhone 15 Pro Max 256GB
(5, 2, 1, 'iPhone 15 Pro Max 256GB Titan Tự Nhiên', 'iphone-15-pro-max-256gb',
 'Đỉnh cao smartphone Apple với khung viền Titanium chuẩn hàng không vũ trụ, nút tác vụ Action Button đa năng, chip A17 Pro tiến trình 3nm và camera telephoto tiềm vọng zoom quang học 5x.',
 34990000, 29890000, 30, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80', 'ACTIVE'),

-- 6. Samsung Galaxy S24 Ultra 256GB
(6, 2, 5, 'Samsung Galaxy S24 Ultra 5G (Galaxy AI / Snapdragon 8 Gen 3)', 'samsung-galaxy-s24-ultra',
 'Kỷ nguyên quyền năng AI mới với bút S Pen tích hợp, khung viền Titanium cứng cáp, camera mắt thần bóng đêm 200MP và vi xử lý Snapdragon 8 Gen 3 for Galaxy mạnh nhất.',
 33990000, 28490000, 25, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80', 'ACTIVE'),

-- 7. Sony WH-1000XM5
(7, 3, 6, 'Tai nghe chống ồn không dây Sony WH-1000XM5', 'sony-wh-1000xm5',
 'Tai nghe chống ồn chủ động đỉnh cao số 1 thế giới với bộ đôi chip V1 và QN1, 8 micro khử ồn thời gian thực, âm thanh Hi-Res Audio không dây LDAC và thời lượng pin 30 giờ.',
 8990000, 7490000, 20, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', 'ACTIVE'),

-- 8. Logitech MX Master 3S
(8, 7, 7, 'Chuột công thái học cao cấp Logitech MX Master 3S', 'logitech-mx-master-3s',
 'Chuột công thái học biểu tượng cho lập trình viên và sáng tạo nội dung, nút click tĩnh âm Quiet Clicks êm ái, cảm biến quang học 8000 DPI lướt trên mọi bề mặt kể cả kính.',
 2990000, 2450000, 40, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80', 'ACTIVE');

-- ============================================================
-- 5. PRODUCT_IMAGES (Thư viện hình ảnh Gallery)
-- ============================================================
INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
-- MacBook Pro 14 M3
(1, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80', TRUE, 0),
(1, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80', FALSE, 1),
(1, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80', FALSE, 2),

-- ASUS ROG Strix G16
(2, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80', TRUE, 0),
(2, 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&auto=format&fit=crop&q=80', FALSE, 1),

-- Dell XPS 15
(3, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80', TRUE, 0),
(3, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80', FALSE, 1),

-- ThinkPad X1
(4, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80', TRUE, 0),

-- iPhone 15 Pro Max
(5, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80', TRUE, 0),
(5, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80', FALSE, 1),

-- Galaxy S24 Ultra
(6, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80', TRUE, 0),

-- Sony WH-1000XM5
(7, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', TRUE, 0),
(7, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80', FALSE, 1),

-- Logitech MX Master 3S
(8, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80', TRUE, 0),
(8, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80', FALSE, 1);

-- ============================================================
-- 6. PRODUCT_SPECS (Thông số kỹ thuật phân nhóm chi tiết)
-- ============================================================

-- Specs: MacBook Pro 14 M3 Pro
INSERT INTO product_specs (product_id, spec_group, spec_key, spec_value, sort_order) VALUES
(1, 'Hiệu năng & Phần cứng', 'CPU', 'Apple M3 Pro (11-core CPU, 14-core GPU, 16-core Neural Engine)', 0),
(1, 'Hiệu năng & Phần cứng', 'RAM', '18GB Unified Memory băng thông 150GB/s', 1),
(1, 'Hiệu năng & Phần cứng', 'Ổ cứng lưu trữ', '512GB SSD tốc độ cao', 2),
(1, 'Màn hình', 'Kích thước & Công nghệ', '14.2 inch Liquid Retina XDR (3024 x 1964), 120Hz ProMotion', 3),
(1, 'Màn hình', 'Độ sáng', '1000 nits duy trì, 1600 nits đỉnh (HDR), 600 nits (SDR)', 4),
(1, 'Pin & Sạc', 'Dung lượng pin', '72.4 Wh Li-Po, sạc nhanh MagSafe 3 công suất 70W', 5),
(1, 'Kết nối & Tiện ích', 'Cổng giao tiếp', '3x Thunderbolt 4 (USB-C), HDMI, Khe cắm thẻ SDXC, Jack 3.5mm', 6),
(1, 'Kết nối & Tiện ích', 'Trọng lượng & Hệ điều hành', '1.61 kg - macOS Sonoma', 7);

-- Specs: ASUS ROG Strix G16
INSERT INTO product_specs (product_id, spec_group, spec_key, spec_value, sort_order) VALUES
(2, 'Hiệu năng & Phần cứng', 'CPU', 'Intel Core i9-14900HX (24 nhân, 32 luồng, xung nhịp lên đến 5.8 GHz)', 0),
(2, 'Hiệu năng & Phần cứng', 'Card đồ họa (GPU)', 'NVIDIA GeForce RTX 4080 12GB GDDR6 (TGP tối đa 175W with Dynamic Boost)', 1),
(2, 'Hiệu năng & Phần cứng', 'RAM', '32GB DDR5 5600MHz (Hỗ trợ nâng cấp tối đa 64GB)', 2),
(2, 'Hiệu năng & Phần cứng', 'Ổ cứng lưu trữ', '1TB PCIe 4.0 NVMe M.2 SSD (Còn 1 khe M.2 trống)', 3),
(2, 'Màn hình', 'Kích thước & Công nghệ', '16 inch QHD+ 2.5K (2560 x 1600), 240Hz, 3ms, 100% DCI-P3, G-Sync', 4),
(2, 'Pin & Sạc', 'Dung lượng pin', '90Wh Li-ion 4-cell, củ sạc 330W Adapter', 5),
(2, 'Kết nối & Tiện ích', 'Hệ thống tản nhiệt', 'Công nghệ tản nhiệt 3 quạt Tri-Fan, keo tản nhiệt kim loại lỏng Conductonaut Extreme', 6),
(2, 'Kết nối & Tiện ích', 'Trọng lượng & Hệ điều hành', '2.50 kg - Windows 11 Home bản quyền', 7);

-- Specs: Dell XPS 15 9530
INSERT INTO product_specs (product_id, spec_group, spec_key, spec_value, sort_order) VALUES
(3, 'Hiệu năng & Phần cứng', 'CPU', 'Intel Core i7-13700H (14 nhân, 20 luồng, Turbo 5.0 GHz)', 0),
(3, 'Hiệu năng & Phần cứng', 'Card đồ họa (GPU)', 'Intel Iris Xe Graphics + NVIDIA RTX 4050 6GB GDDR6', 1),
(3, 'Hiệu năng & Phần cứng', 'RAM', '16GB DDR5 4800MHz (2 khe có thể nâng cấp)', 2),
(3, 'Hiệu năng & Phần cứng', 'Ổ cứng lưu trữ', '1TB M.2 PCIe Gen 4 NVMe SSD', 3),
(3, 'Màn hình', 'Kích thước & Công nghệ', '15.6 inch 3.5K OLED (3456 x 2160) cảm ứng, 400 nits, 100% DCI-P3', 4),
(3, 'Pin & Sạc', 'Dung lượng pin', '86Wh, hỗ trợ sạc nhanh qua cổng USB-C 130W', 5),
(3, 'Kết nối & Tiện ích', 'Trọng lượng & Hệ điều hành', '1.92 kg - Vỏ nhôm nguyên khối cắt CNC & sợi carbon cao cấp', 6);

-- Specs: ThinkPad X1 Carbon Gen 11
INSERT INTO product_specs (product_id, spec_group, spec_key, spec_value, sort_order) VALUES
(4, 'Hiệu năng & Phần cứng', 'CPU', 'Intel Core i7-1355U (10 nhân, 12 luồng, Turbo 5.0 GHz)', 0),
(4, 'Hiệu năng & Phần cứng', 'RAM', '16GB LPDDR5 6400MHz Dual-channel', 1),
(4, 'Hiệu năng & Phần cứng', 'Ổ cứng lưu trữ', '512GB SSD M.2 2280 PCIe 4.0 Performance NVMe Opal 2.0', 2),
(4, 'Màn hình', 'Kích thước & Công nghệ', '14.0 inch WUXGA (1920 x 1200) IPS chống chói, 400 nits, 100% sRGB', 3),
(4, 'Pin & Sạc', 'Dung lượng pin', '57Wh sạc nhanh 80% trong 60 phút qua USB-C 65W', 4),
(4, 'Kết nối & Tiện ích', 'Trọng lượng & Hệ điều hành', '1.12 kg - Đạt chuẩn độ bền quân đội Mỹ MIL-STD-810H', 5);

-- Specs: iPhone 15 Pro Max
INSERT INTO product_specs (product_id, spec_group, spec_key, spec_value, sort_order) VALUES
(5, 'Hiệu năng & Phần cứng', 'Vi xử lý', 'Apple A17 Pro (6 nhân CPU, 6 nhân GPU hỗ trợ Ray Tracing phần cứng)', 0),
(5, 'Hiệu năng & Phần cứng', 'Bộ nhớ & Lưu trữ', '8GB RAM - 256GB bộ nhớ trong NVMe', 1),
(5, 'Màn hình', 'Kích thước & Tấm nền', '6.7 inch Super Retina XDR OLED (2796 x 1290), 120Hz ProMotion, Dynamic Island', 2),
(5, 'Camera', 'Hệ thống camera sau', 'Chính 48MP (f/1.78) + Siêu rộng 12MP + Tele tiềm vọng 12MP zoom 5x quang học', 3),
(5, 'Camera', 'Camera trước', '12MP TrueDepth tự động lấy nét, quay video 4K 60fps Dolby Vision', 4),
(5, 'Pin & Sạc', 'Dung lượng pin & sạc', '4422 mAh, sạc nhanh USB-C 20W (50% trong 30 phút), sạc MagSafe 15W', 5),
(5, 'Thiết kế & Kháng nước', 'Chất liệu & Chuẩn chống nước', 'Khung viền Titanium cấp 5 siêu nhẹ, kính Ceramic Shield, chống nước IP68', 6);

-- Specs: Samsung Galaxy S24 Ultra
INSERT INTO product_specs (product_id, spec_group, spec_key, spec_value, sort_order) VALUES
(6, 'Hiệu năng & Phần cứng', 'Vi xử lý', 'Snapdragon 8 Gen 3 for Galaxy (4nm, tối ưu hiệu năng AI độc quyền)', 0),
(6, 'Hiệu năng & Phần cứng', 'Bộ nhớ & Lưu trữ', '12GB RAM LPDDR5X - 256GB UFS 4.0', 1),
(6, 'Màn hình', 'Kích thước & Tấm nền', '6.8 inch Dynamic AMOLED 2X phẳng, QHD+ (3120 x 1440), 120Hz, 2600 nits, kính Gorilla Armor chống lóa', 2),
(6, 'Camera', 'Hệ thống camera sau', 'Mắt thần 200MP + Góc siêu rộng 12MP + Tele 50MP (5x) + Tele 10MP (3x), Zoom không gian 100x', 3),
(6, 'Tính năng thông minh', 'Galaxy AI', 'Khoanh tròn để tìm kiếm (Circle to Search), Dịch trực tiếp cuộc gọi hai chiều, Trợ lý Note AI', 4),
(6, 'Pin & Phụ kiện', 'Dung lượng & Bút cảm ứng', '5000 mAh sạc nhanh 45W, tích hợp sẵn bút S Pen độ trễ cực thấp 2.8ms trong thân máy', 5);

-- Specs: Sony WH-1000XM5
INSERT INTO product_specs (product_id, spec_group, spec_key, spec_value, sort_order) VALUES
(7, 'Âm thanh & Khử ồn', 'Công nghệ chống ồn', 'Công nghệ chống ồn đỉnh cao HD QN1 kết hợp vi xử lý V1, 8 micro khử ồn thời gian thực', 0),
(7, 'Âm thanh & Khử ồn', 'Màng loa & Định dạng', 'Màng loa 30mm vòm sợi carbon tổng hợp siêu nhẹ, hỗ trợ âm thanh Hi-Res Audio & LDAC', 1),
(7, 'Pin & Kết nối', 'Thời lượng pin & Sạc', 'Lên đến 30 giờ (bật ANC), sạc nhanh 3 phút nghe được 3 giờ qua cổng USB-C', 2),
(7, 'Pin & Kết nối', 'Chuẩn kết nối Bluetooth', 'Bluetooth 5.2 kết nối cùng lúc 2 thiết bị (Multipoint Connection), Google Fast Pair', 3),
(7, 'Tính năng thông minh', 'Tiện ích đàm thoại', 'Công nghệ Precise Voice Pickup nhận diện giọng nói chính xác, Speak-to-Chat tự dừng nhạc khi nói', 4);

-- Specs: Logitech MX Master 3S
INSERT INTO product_specs (product_id, spec_group, spec_key, spec_value, sort_order) VALUES
(8, 'Cảm biến & Điều khiển', 'Độ phân giải mắt đọc', 'Cảm biến Darkfield quang học siêu chính xác 8000 DPI, lướt mượt trên mọi bề mặt cả kính dày', 0),
(8, 'Cảm biến & Điều khiển', 'Con lăn cơ học', 'Con lăn MagSpeed siêu nhanh cuộn 1000 dòng/giây, chuyển đổi mượt mà giữa nấc và cuộn tự do', 1),
(8, 'Thiết kế & Nút bấm', 'Công thái học', 'Thiết kế ôm sát lòng bàn tay chuẩn công thái học, nút click Quiet Clicks giảm 90% tiếng ồn', 2),
(8, 'Pin & Kết nối', 'Kết nối đa thiết bị', 'Bluetooth Low Energy & đầu thu Logi Bolt USB, chuyển đổi nhanh giữa 3 thiết bị với Easy-Switch', 3),
(8, 'Pin & Kết nối', 'Thời lượng pin', 'Pin sạc Li-Po 500mAh dùng đến 70 ngày sau 1 lần sạc đầy, sạc nhanh 1 phút dùng 3 giờ', 4);
