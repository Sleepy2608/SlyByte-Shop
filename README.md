# SLYBYTE SHOP — Nền Tảng Thương Mại Điện Tử Thiết Bị Công Nghệ

> **SlyByte Shop (Slybyte)** là nền tảng thương mại điện tử chuyên sâu về thiết bị công nghệ chính hãng cao cấp (Laptop cao cấp, Ultrabook, Gaming Pro, Smartphone Flagship, Phụ kiện & Thiết bị âm thanh Hi-Res). Dự án được xây dựng với kiến trúc Client-Server hiện đại, đề cao hiệu năng, bảo mật và trải nghiệm người dùng theo triết lý *Technical Minimalism & Dark-First*.

---

## 📌 1. Tính Năng Chính Theo Phân Hệ

### 👤 1.1. Phân Hệ Người Dùng (Customer / User)
* **Xác thực & Tài khoản (Authentication)**:
  * Đăng ký tài khoản mới với kiểm tra ràng buộc mật khẩu (tối thiểu 8 ký tự), email và số điện thoại.
  * Đăng nhập an toàn với chuẩn JWT (JSON Web Token), tự động lưu trữ và đồng bộ phiên làm việc.
  * Giao diện Đăng nhập / Đăng ký hiện đại theo bố cục *Split Showcase Layout*.
  * Kiểm tra và hiển thị thông tin phiên hoạt động trực tiếp qua endpoint `/api/auth/me`.
* **Sản phẩm & Danh mục (Catalog & Specs)**:
  * Khám phá danh mục thiết bị: Apple, Asus, Dell, Samsung, Sony...
  * Tìm kiếm và lọc sản phẩm theo khoảng giá, thương hiệu, nhóm cấu hình.
  * Xem chi tiết sản phẩm với bảng thông số kỹ thuật (CPU, GPU, RAM, Ổ cứng, Màn hình, Pin).
* **Giỏ hàng & Đặt hàng (Cart & Checkout)**:
  * Quản lý giỏ hàng: Thêm, cập nhật số lượng, xóa sản phẩm.
  * Quy trình đặt hàng (Checkout) với thông tin giao nhận và phương thức thanh toán.
* **Lịch sử đơn hàng**:
  * Theo dõi trạng thái đơn hàng (Chờ xác nhận, Đang xử lý, Đang giao, Đã hoàn thành).

### 🛡️ 1.2. Phân Hệ Quản Trị (Admin Portal)
* **Quản lý Sản phẩm**: CRUD sản phẩm, cập nhật cấu hình thông số kỹ thuật (Specs), quản lý tồn kho và hình ảnh.
* **Quản lý Danh mục & Thương hiệu**: Phân loại thiết bị, quản lý hãng sản xuất.
* **Quản lý Đơn hàng**: Tiếp nhận đơn, cập nhật trạng thái vận chuyển và thanh toán.
* **Quản lý Người dùng**: Xem danh sách khách hàng, phân quyền tài khoản (USER / ADMIN).

---

## 🛠️ 2. Ngăn Xếp Công Nghệ (Technology Stack)

| Tầng kiến trúc | Công nghệ sử dụng | Phiên bản | Mô tả vai trò |
| :--- | :--- | :--- | :--- |
| **Backend Framework** | Spring Boot | `3.3.4` | RESTful API, Service Layer & Business Logic |
| **Language (Backend)** | Java | `17` | Ngôn ngữ lập trình phía máy chủ |
| **Security & Auth** | Spring Security + JWT | `6.x` | Xác thực Stateless JWT, mã hóa BCrypt, phân quyền role-based |
| **Database & ORM** | MySQL + Spring Data JPA | `8.0+` | Cơ sở dữ liệu quan hệ, Hibernate ORM |
| **Build Tool (Backend)**| Apache Maven | `3.8+` | Quản lý dependencies và build gói JAR |
| **Frontend Framework** | React | `18.3.1` | Thư viện xây dựng giao diện người dùng |
| **Language (Frontend)** | TypeScript | `5.6.3` | Định kiểu dữ liệu tĩnh nghiêm ngặt (Strict typing) |
| **Build Tool (Frontend)**| Vite | `5.4.9` | Development server siêu tốc & Bundle tối ưu |
| **Routing** | React Router DOM | `6.27.0` | Điều hướng SPA, Protected Route |
| **State Management** | Zustand | `5.0.0` | Quản lý state toàn cục (Auth, User Session) |
| **Async Data** | TanStack React Query | `5.59.0` | Quản lý server-state, caching dữ liệu |
| **HTTP Client** | Axios | `1.7.7` | Giao tiếp REST API kèm Interceptor xử lý Bearer Token |
| **Styling** | Vanilla CSS (CSS3 Variables) | Standard | Hệ thống Design Tokens Dark-First, không dùng Tailwind |

---

## 📂 3. Cấu Trúc Thư Mục Dự Án

```text
SlyByte-Shop/
├── Docs/                                    # Tài liệu đặc tả yêu cầu và MVP
│   └── MVP_SPEC.md                          # Đặc tả MVP chi tiết của hệ thống
├── .plan/                                   # Kế hoạch phát triển và chuẩn mực kiến trúc
│   ├── PLAN.md                              # Lộ trình tổng quan dự án
│   ├── PHASE_3_AUTH_PLAN.md                 # Kế hoạch triển khai Authentication
│   ├── FRONTEND_UI_PLAN.md                  # Kế hoạch thiết kế Frontend UI
│   └── format/
│       └── format-frontend/
│           └── ui-rules.md                  # Toàn bộ quy chuẩn UI, Design System & Tokens
├── Code/
│   ├── backend/                             # Mã nguồn Backend (Spring Boot)
│   │   ├── pom.xml                          # File cấu hình Maven
│   │   └── src/main/java/com/example/ecommerce/
│   │       ├── config/                      # Cấu hình Security, JWT, CORS, App beans
│   │       ├── controller/                  # REST Controllers (AuthController, ...)
│   │       ├── service/                     # Business Logic (AuthService, ...)
│   │       ├── repository/                  # Spring Data JPA Repositories
│   │       ├── entity/                      # JPA Entities (User, Role, Product, ...)
│   │       ├── dto/                         # Data Transfer Objects (Request/Response)
│   │       └── exception/                   # Xử lý ngoại lệ toàn cục (Global Exception)
│   ├── frontend/                            # Mã nguồn Frontend (React + Vite + TS)
│   │   ├── package.json                     # Cấu hình Dependencies & Scripts
│   │   ├── vite.config.ts                   # Cấu hình Vite & Proxy /api sang port 8080
│   │   ├── eslint.config.js                 # Cấu hình ESLint 9 Flat Config
│   │   └── src/
│   │       ├── assets/                      # Tài nguyên tĩnh (ảnh, icons)
│   │       ├── components/                  # UI Components (Navbar, Footer, AuthLayout, ...)
│   │       ├── pages/                       # Trang chính (HomePage, LoginPage, RegisterPage)
│   │       ├── services/                    # Axios API client & Interceptors
│   │       ├── store/                       # Zustand Stores (useAuthStore)
│   │       ├── types/                       # TypeScript interfaces & types
│   │       ├── index.css                    # Design Tokens & Global CSS System
│   │       ├── App.tsx                      # App Routing & Auth Bootstrapping
│   │       └── main.tsx                     # Entry point ReactDOM
│   └── database/                            # Kịch bản cơ sở dữ liệu
│       └── schema.sql                       # DDL tạo bảng và dữ liệu khởi tạo
└── README.md                                # Tài liệu hướng dẫn dự án
```

---

## 🚀 4. Lộ Trình Phát Triển (Project Roadmap)

- [x] **Phase 1 — Khởi Tạo & Thiết Kế Kiến Trúc**: Định nghĩa MVP Spec, cấu trúc thư mục, thiết kế CSDL (`schema.sql`).
- [x] **Phase 2 — Nền Tảng Backend**: Khởi tạo Spring Boot 3, JPA Entities, Spring Security, cấu hình JWT Provider & Filters.
- [x] **Phase 3 — Hoàn Thiện Luồng Xác Thực (Authentication)**:
  - *Backend*: REST APIs `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, mã hóa BCrypt, kiểm tra trùng lặp email.
  - *Frontend*: Thiết lập Design Tokens (Dark-First), Navbar, Footer, AuthLayout (Split Showcase), trang Đăng nhập & Đăng ký, Zustand store đồng bộ token.
- [ ] **Phase 4 — Danh Mục Sản Phẩm & Chi Tiết Cấu Hình (Catalog & Specs)**: Danh sách sản phẩm, bộ lọc kỹ thuật, tìm kiếm nhanh, trang chi tiết specs.
- [ ] **Phase 5 — Giỏ Hàng & Thanh Toán (Cart & Checkout)**: Quản lý giỏ hàng bằng Zustand / LocalStorage, quy trình đặt hàng.
- [ ] **Phase 6 — Quản Trị Hệ Thống (Admin Dashboard)**: Trang quản lý sản phẩm, đơn hàng, người dùng cho quyền `ADMIN`.

---

## 💻 5. Hướng Dẫn Cài Đặt & Vận Hành (Getting Started)

### 5.1. Yêu cầu môi trường
* **Java Development Kit (JDK)**: Phiên bản 17 trở lên
* **Apache Maven**: Phiên bản 3.8+
* **Node.js**: Phiên bản 18+ (kèm npm)
* **MySQL Server**: Phiên bản 8.0+

---

### 5.2. Khởi tạo Cơ sở dữ liệu
1. Đăng nhập vào MySQL:
   ```bash
   mysql -u root -p
   ```
2. Chạy kịch bản khởi tạo từ thư mục `Code/database/`:
   ```sql
   SOURCE Code/database/schema.sql;
   ```
3. Kiểm tra file cấu hình kết nối tại `Code/backend/src/main/resources/application.properties` để đảm bảo đúng `username` và `password` MySQL của máy bạn:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db?createDatabaseIfNotExist=true&useSSL=false
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```

---

### 5.3. Khởi chạy Backend (Spring Boot)
1. Di chuyển vào thư mục backend:
   ```bash
   cd Code/backend
   ```
2. Biên dịch và tải dependencies:
   ```bash
   mvn clean compile
   ```
3. Khởi chạy máy chủ:
   ```bash
   mvn spring-boot:run
   ```
   *Máy chủ Backend sẽ lắng nghe tại:* `http://localhost:8080`

---

### 5.4. Khởi chạy Frontend (React + Vite)
1. Mở một terminal mới và di chuyển vào thư mục frontend:
   ```bash
   cd Code/frontend
   ```
2. Cài đặt các gói thư viện:
   ```bash
   npm install
   ```
3. Khởi chạy máy chủ phát triển (Dev server):
   ```bash
   npm run dev
   ```
   *Giao diện người dùng sẽ chạy tại:* `http://localhost:5173`

> **Lưu ý**: Vite đã được cấu hình Reverse Proxy sẵn trong `vite.config.ts`. Mọi request xuất phát từ client có tiền tố `/api` sẽ tự động được chuyển tiếp tới máy chủ Spring Boot tại `http://localhost:8080`.

---

### 5.5. Kiểm tra chất lượng mã nguồn (Quality Assurance)
Tại thư mục `Code/frontend`:
* Kiểm tra Linter:
  ```bash
  npm run lint
  ```
* Kiểm tra kiểu dữ liệu & Build:
  ```bash
  npm run build
  ```

---

## 📖 6. Tài Liệu Tham Chiếu & Quy Chuẩn

* [MVP Specification](Docs/MVP_SPEC.md) — Đặc tả chi tiết các phân hệ và yêu cầu chức năng MVP.
* [UI Rules & Design Standards](.plan/format/format-frontend/ui-rules.md) — Quy chuẩn giao diện, Design Tokens, CSS variables và chuẩn mực lập trình Frontend.
* [Frontend Implementation Plan](.plan/FRONTEND_UI_PLAN.md) — Kế hoạch chi tiết triển khai giao diện người dùng.
* [Phase 3 Auth Plan](.plan/PHASE_3_AUTH_PLAN.md) — Đặc tả kỹ thuật luồng Authentication (Backend + Frontend).

---

© 2026 **SlyByte Shop (Slybyte)**. All rights reserved.
