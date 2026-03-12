# Website Cá Nhân với Next.js & Sanity — Tài liệu tiếng Việt<!-- omit in toc -->

Tài liệu này giải thích **cấu trúc dự án**, **nguyên lí hoạt động**, và **cách nhập thông tin (nội dung)** vào hệ thống.

## Mục lục

- [Giới thiệu tổng quan](#giới-thiệu-tổng-quan)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
  - [Các file và thư mục quan trọng](#các-file-và-thư-mục-quan-trọng)
- [Nguyên lí hoạt động](#nguyên-lí-hoạt-động)
  - [Luồng dữ liệu](#luồng-dữ-liệu)
  - [Chế độ hiển thị nội dung](#chế-độ-hiển-thị-nội-dung)
  - [Cập nhật nội dung trực tiếp (Live Revalidation)](#cập-nhật-nội-dung-trực-tiếp-live-revalidation)
- [Cách nhập thông tin vào hệ thống](#cách-nhập-thông-tin-vào-hệ-thống)
  - [1. Truy cập Sanity Studio](#1-truy-cập-sanity-studio)
  - [2. Các loại tài liệu (Document Types)](#2-các-loại-tài-liệu-document-types)
  - [3. Tạo và chỉnh sửa nội dung](#3-tạo-và-chỉnh-sửa-nội-dung)
  - [4. Nhập dữ liệu phong phú (Rich Content)](#4-nhập-dữ-liệu-phong-phú-rich-content)
  - [5. Xuất bản nội dung](#5-xuất-bản-nội-dung)
- [Khởi động dự án (Cài đặt cục bộ)](#khởi-động-dự-án-cài-đặt-cục-bộ)
- [Câu hỏi thường gặp](#câu-hỏi-thường-gặp)

---

## Giới thiệu tổng quan

Đây là template **website cá nhân** được xây dựng với Next.js và Sanity.io. Dự án bao gồm:

- **Frontend**: Trang web hiển thị nội dung cho người dùng (danh sách dự án, trang chi tiết dự án, các trang tĩnh).
- **CMS (Hệ thống quản lý nội dung)**: Sanity Studio — giao diện trực quan để nhập và quản lý nội dung, truy cập tại đường dẫn `/studio`.

---

## Công nghệ sử dụng

| Công nghệ | Mục đích |
|---|---|
| **Next.js 16** | Framework React cho frontend, hỗ trợ Static Generation và Server Components |
| **React 19** | Thư viện UI |
| **TypeScript** | Ngôn ngữ lập trình với kiểm tra kiểu dữ liệu tĩnh |
| **Sanity.io v4** | Headless CMS — lưu trữ và quản lý nội dung trên đám mây |
| **Tailwind CSS** | Framework CSS tiện ích cho styling |
| **Portable Text** | Định dạng văn bản phong phú của Sanity |
| **Vercel / Netlify** | Nền tảng triển khai ứng dụng |

---

## Cấu trúc thư mục

```
/
├── app/                          # Next.js App Router — định nghĩa các trang
│   ├── (personal)/               # Nhóm route cho website cá nhân
│   │   ├── page.tsx              # Trang chủ (homepage)
│   │   ├── layout.tsx            # Layout bao quanh toàn bộ trang cá nhân
│   │   └── projects/[slug]/
│   │       └── page.tsx          # Trang chi tiết từng dự án (dynamic route)
│   ├── api/
│   │   └── draft-mode/enable/    # API route bật chế độ Draft Mode (xem thử nội dung)
│   ├── studio/[[...index]]/      # Nơi Sanity Studio được nhúng vào app
│   ├── layout.tsx                # Root layout (fonts, thẻ HTML gốc)
│   └── globals.css               # CSS toàn cục
│
├── components/                   # React components tái sử dụng
│   ├── Header.tsx                # Tiêu đề trang với mô tả
│   ├── Navbar.tsx                # Thanh điều hướng
│   ├── Footer.tsx                # Chân trang
│   ├── CustomPortableText.tsx    # Renderer nội dung rich text từ Sanity
│   ├── ProjectListItem.tsx       # Hiển thị một dự án trong danh sách
│   ├── TimelineSection.tsx       # Hiển thị danh sách timeline
│   ├── TimelineItem.tsx          # Hiển thị một mốc thời gian (milestone)
│   ├── ImageBox.tsx              # Component hiển thị ảnh tối ưu hoá
│   └── OptimisticSortOrder/      # Component cho phép kéo thả sắp xếp lại
│
├── sanity/                       # Cấu hình và schema của Sanity
│   ├── lib/
│   │   ├── client.ts             # Khởi tạo Sanity client
│   │   ├── queries.ts            # Các câu truy vấn GROQ lấy dữ liệu
│   │   ├── live.ts               # Cấu hình live preview và revalidation
│   │   └── utils.ts              # Tiện ích tạo URL ảnh, xử lý href
│   └── schemas/
│       ├── documents/
│       │   ├── project.ts        # Schema kiểu tài liệu "Project"
│       │   └── page.ts           # Schema kiểu tài liệu "Page"
│       ├── singletons/
│       │   ├── home.ts           # Schema tài liệu đơn "Home" (trang chủ)
│       │   └── settings.ts       # Schema tài liệu đơn "Settings" (cài đặt chung)
│       └── objects/
│           ├── timeline.ts       # Schema object Timeline
│           ├── milestone.ts      # Schema object Milestone
│           └── duration/         # Schema object Duration (ngày bắt đầu/kết thúc)
│
├── types/                        # Định nghĩa TypeScript types
├── styles/                       # File CSS bổ sung
├── sanity.config.ts              # Cấu hình Sanity Studio
├── sanity.cli.ts                 # Cấu hình Sanity CLI
├── next.config.ts                # Cấu hình Next.js
├── tailwind.config.js            # Cấu hình Tailwind CSS
├── .env.local.example            # Mẫu biến môi trường
└── README.md                     # Tài liệu tiếng Anh
```

### Các file và thư mục quan trọng

| File/Thư mục | Vai trò |
|---|---|
| `sanity.config.ts` | Cấu hình chính của Sanity Studio (schema, plugins) |
| `sanity/schemas/` | Định nghĩa cấu trúc dữ liệu (các loại tài liệu và trường nhập liệu) |
| `sanity/lib/queries.ts` | Các câu truy vấn GROQ để lấy nội dung từ Sanity |
| `sanity/lib/client.ts` | Kết nối tới Sanity Content Lake |
| `app/(personal)/page.tsx` | Trang chủ hiển thị danh sách dự án nổi bật |
| `app/(personal)/projects/[slug]/page.tsx` | Trang chi tiết mỗi dự án |
| `app/studio/[[...index]]/` | Nơi nhúng giao diện quản trị Sanity Studio |
| `.env.local.example` | Mẫu các biến môi trường cần thiết để chạy dự án |

---

## Nguyên lí hoạt động

### Luồng dữ liệu

Nội dung được lưu trữ trên **Sanity Content Lake** (đám mây), và được truy xuất về bởi Next.js thông qua các câu truy vấn GROQ. Sau đó React hiển thị nội dung đó ra trình duyệt người dùng:

```
 Người quản trị nhập nội dung
          │
          ▼
  Sanity Studio (/studio)
          │  lưu lên đám mây
          ▼
  Sanity Content Lake (API)
          │  câu truy vấn GROQ
          ▼
  Next.js Server Components
          │  render HTML
          ▼
  React Components (UI)
          │
          ▼
  Trình duyệt người dùng
```

### Chế độ hiển thị nội dung

Hệ thống có **ba chế độ** hiển thị nội dung:

| Chế độ | Mô tả |
|---|---|
| **Published** (mặc định) | Hiển thị nội dung đã được xuất bản công khai |
| **Drafts** (Draft Mode) | Hiển thị bản nháp (chưa xuất bản), dùng để xem thử |
| **Presentation** | Xem trực tiếp trong Studio với overlay chỉnh sửa ngay trên trang web |

Chế độ Draft được bật qua API route `/api/draft-mode/enable`.

### Cập nhật nội dung trực tiếp (Live Revalidation)

Khi nội dung được xuất bản trên Sanity Studio:
1. Sanity gửi tín hiệu tới Next.js qua **SanityLive** (WebSocket / long-polling).
2. Next.js **tự động cập nhật** trang mà không cần rebuild lại toàn bộ ứng dụng.
3. Người dùng truy cập sẽ thấy nội dung mới ngay lập tức.

---

## Cách nhập thông tin vào hệ thống

Toàn bộ nội dung được nhập qua giao diện **Sanity Studio** — không cần viết code hay trực tiếp chỉnh sửa file.

### 1. Truy cập Sanity Studio

- **Khi chạy cục bộ**: mở trình duyệt tại [http://localhost:3000/studio](http://localhost:3000/studio)
- **Khi đã triển khai lên Vercel**: truy cập `https://your-domain.com/studio`

Đăng nhập bằng tài khoản Google, GitHub hoặc email đã dùng khi tạo Sanity project.

### 2. Các loại tài liệu (Document Types)

Hệ thống có **4 loại tài liệu** để nhập nội dung:

#### 🏠 Home (Tài liệu đơn — Singleton)
Là trang chủ duy nhất của website. Nhấp vào "Home" trong sidebar của Studio để chỉnh sửa.

| Trường | Loại | Mô tả |
|---|---|---|
| `Title` | Văn bản | Tiêu đề website hiển thị trên trang chủ |
| `Overview` | Rich text | Đoạn mô tả ngắn trên trang chủ |
| `Showcase Projects` | Danh sách tham chiếu | Các dự án nổi bật hiển thị trên trang chủ |

#### ⚙️ Settings (Tài liệu đơn — Singleton)
Cài đặt chung cho toàn bộ website. Nhấp vào "Settings" trong sidebar.

| Trường | Loại | Mô tả |
|---|---|---|
| `Menu Items` | Danh sách tham chiếu | Các liên kết trên thanh điều hướng |
| `Footer` | Rich text | Nội dung phần chân trang |
| `OG Image` | Ảnh | Ảnh hiển thị khi chia sẻ link lên mạng xã hội |

#### 📁 Project (Tài liệu — có thể tạo nhiều)
Mỗi dự án trong portfolio. Tạo mới bằng cách nhấn **"+ Create" → "Project"**.

| Trường | Loại | Mô tả |
|---|---|---|
| `Title` *(bắt buộc)* | Văn bản | Tên dự án |
| `Slug` *(bắt buộc)* | Slug | URL của trang dự án, tự tạo từ title |
| `Overview` *(bắt buộc)* | Rich text (tối đa 155 ký tự) | Mô tả ngắn dùng cho SEO và danh sách |
| `Cover Image` *(bắt buộc)* | Ảnh | Ảnh bìa của dự án |
| `Duration` | Thời gian | Ngày bắt đầu và kết thúc dự án |
| `Client` | Văn bản | Tên khách hàng |
| `Site` | URL | Đường dẫn website của dự án |
| `Tags` | Danh sách nhãn | Các thẻ phân loại dự án |
| `Description` | Rich text (với ảnh & timeline) | Nội dung chi tiết của dự án |

#### 📄 Page (Tài liệu — có thể tạo nhiều)
Trang nội dung tĩnh (ví dụ: trang "Về tôi"). Tạo mới bằng cách nhấn **"+ Create" → "Page"**.

| Trường | Loại | Mô tả |
|---|---|---|
| `Title` *(bắt buộc)* | Văn bản | Tiêu đề trang |
| `Slug` *(bắt buộc)* | Slug | URL của trang |
| `Overview` *(bắt buộc)* | Rich text | Mô tả ngắn |
| `Body` | Rich text (với ảnh & timeline) | Nội dung chính của trang |

### 3. Tạo và chỉnh sửa nội dung

#### Tạo tài liệu mới (Project hoặc Page)
1. Trong Sanity Studio, nhấn nút **"+ Create"** ở góc trên bên trái.
2. Chọn loại tài liệu: **Project** hoặc **Page**.
3. Điền thông tin vào các trường (fields).
4. Nhấn **"Publish"** để xuất bản.

#### Chỉnh sửa tài liệu đơn (Home hoặc Settings)
1. Nhấp trực tiếp vào **"Home"** hoặc **"Settings"** trong sidebar.
2. Cập nhật các trường cần thiết.
3. Nhấn **"Publish"** để lưu thay đổi.

### 4. Nhập dữ liệu phong phú (Rich Content)

Các trường **Overview**, **Description**, và **Body** sử dụng định dạng **Portable Text** cho phép:

#### Văn bản và định dạng
- Nhập văn bản thường, in đậm, in nghiêng
- Tạo liên kết (hyperlink)
- Xuống dòng tạo đoạn văn mới

#### Chèn ảnh
1. Trong trường Description/Body, nhấn nút **"+"** hoặc nhấn Enter để xuống dòng.
2. Chọn **"Image"** từ menu thêm nội dung.
3. Tải ảnh lên hoặc chọn từ Unsplash (tích hợp sẵn).
4. (Tuỳ chọn) Thêm caption cho ảnh.

#### Chèn Timeline
Timeline là khối nội dung đặc biệt để hiển thị dòng thời gian các sự kiện.

1. Trong trường Description/Body, thêm khối **"Timeline"**.
2. Mỗi Timeline gồm:
   - **Title**: Tiêu đề của timeline
   - **Items**: Danh sách tối đa 2 nhóm mốc thời gian
3. Mỗi **Milestone** trong nhóm có:
   - `Title` *(bắt buộc)*: Tên mốc thời gian
   - `Description`: Mô tả chi tiết
   - `Image`: Ảnh minh hoạ
   - `Tags`: Nhãn phân loại
   - `Duration` *(bắt buộc)*: Thời gian diễn ra

### 5. Xuất bản nội dung

Sau khi nhập xong thông tin:

1. **Xem thử**: Nhấp tab **"Presentation"** trong Studio để xem trang web với nội dung đang soạn (bao gồm cả bản nháp).
2. **Xuất bản**: Nhấn nút **"Publish"** (màu xanh lá) để đưa nội dung lên website công khai.
3. **Nội dung cập nhật ngay**: Nhờ cơ chế **Live Revalidation**, website sẽ tự cập nhật mà không cần rebuild lại.

---

## Khởi động dự án (Cài đặt cục bộ)

### Bước 1 — Khởi tạo bằng Sanity CLI

```bash
npm create sanity@latest -- --template sanity-io/template-nextjs-personal-website
```

### Bước 2 — Cài đặt biến môi trường

Sao chép file `.env.local.example` thành `.env.local` và điền giá trị:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=   # ID Sanity project của bạn
NEXT_PUBLIC_SANITY_DATASET=      # Tên dataset (thường là "production")
SANITY_API_READ_TOKEN=           # Token API để đọc nội dung
```

### Bước 3 — Chạy ứng dụng

```bash
npm run dev
```

Mở trình duyệt:
- **Website**: [http://localhost:3000](http://localhost:3000)
- **Studio (CMS)**: [http://localhost:3000/studio](http://localhost:3000/studio)

---

## Câu hỏi thường gặp

**Q: Tôi muốn thêm một loại nội dung mới, tôi phải làm gì?**

A: Tạo file schema mới trong thư mục `sanity/schemas/documents/` hoặc `sanity/schemas/objects/`, sau đó đăng ký schema đó trong `sanity.config.ts`. Tham khảo [tài liệu Sanity Schema Types](https://www.sanity.io/docs/schema-types).

**Q: Làm sao để thêm trang mới vào menu điều hướng?**

A: Vào **Settings** trong Studio → trường `Menu Items` → thêm tham chiếu tới trang hoặc dự án bạn muốn hiển thị.

**Q: Thay đổi trong Studio có xuất hiện ngay trên website không?**

A: Có — sau khi nhấn **"Publish"**, website sẽ tự cập nhật nhờ cơ chế **Live Revalidation** mà không cần rebuild.

**Q: Tôi có thể xem thử nội dung chưa xuất bản không?**

A: Có — dùng tab **"Presentation"** trong Studio để xem preview bao gồm cả bản nháp. Bạn cũng có thể bật **Draft Mode** bằng cách truy cập `/api/draft-mode/enable`.

**Q: Có thể mời người khác cùng quản lý nội dung không?**

A: Có — vào [Sanity Manage](https://www.sanity.io/manage), chọn project và nhấn **"Invite project members"** để thêm cộng tác viên.
