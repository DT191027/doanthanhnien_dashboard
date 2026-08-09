# Hệ thống Quản lý Văn bản và Điều hành
## Đoàn TNCS Hồ Chí Minh — Xã Xuân Thới Sơn, Thành phố Hồ Chí Minh

---

## Giới thiệu Sản phẩm

Đây là nền tảng quản lý số tập trung được xây dựng riêng cho **Đoàn Thanh niên Cộng sản Hồ Chí Minh xã Xuân Thới Sơn** và **30 Chi đoàn Ấp trực thuộc**. Hệ thống ra đời nhằm thay thế quy trình quản lý văn bản và điều hành thủ công truyền thống, đưa công tác Đoàn bước vào giai đoạn chuyển đổi số hiện đại, phù hợp với mô hình quản lý hành chính 2 cấp giữa Xã và Thành phố theo định hướng cải cách hiện nay.

Sản phẩm cung cấp hai giao diện quản trị độc lập, được phân quyền chặt chẽ theo vai trò: giao diện dành cho **Đoàn xã** với đầy đủ quyền điều hành toàn bộ hệ thống, và giao diện dành cho từng **Chi đoàn Ấp** với phạm vi truy cập giới hạn trong phạm vi đơn vị mình.

Email tiếp nhận và phục vụ hệ thống chính thức của Đoàn xã: **`dtnxts2026@gmail.com`**.

---

## Công nghệ Sử dụng

Hệ thống được xây dựng trên nền tảng công nghệ hiện đại, phù hợp với tiêu chuẩn phát triển ứng dụng web chuyên nghiệp.

**Frontend:** React.js, Vite, Bootstrap 5, Lucide React Icons, Canvas Confetti

**Backend & Database:** Supabase — nền tảng Backend-as-a-Service hỗ trợ PostgreSQL, Realtime Subscriptions, Authentication và Storage với phân quyền Row Level Security (RLS) chuẩn enterprise.

**Hybrid Storage Backup:** Tự động giám sát hạn ngạch Supabase Storage và kích hoạt chuyển hướng ghi tệp PDF sang **Google Drive** của Đoàn xã (`dtnxts2026@gmail.com`) khi đạt mốc cảnh báo 80%.

**Deployment:** Vercel — nền tảng hosting tự động CI/CD, tích hợp GitHub, hỗ trợ Edge Network toàn cầu và Security Headers chuẩn quốc tế.

**Region Server:** Singapore (ap-southeast-1) — được lựa chọn để đảm bảo độ trễ phản hồi thấp nhất cho người dùng tại Thành phố Hồ Chí Minh.

---

## Tính năng Chính

**Quản lý Văn bản**

Hệ thống hỗ trợ toàn bộ vòng đời văn bản từ khi Đoàn xã ban hành đến khi Chi đoàn Ấp tiếp nhận và phản hồi. Đoàn xã có thể tạo và phân phối công văn, kế hoạch, thông báo tới toàn bộ 30 Ấp hoặc chỉ định từng đơn vị cụ thể. Mỗi Chi đoàn Ấp chỉ được xem các văn bản gửi đến đơn vị mình, đảm bảo phân quyền dữ liệu tuyệt đối.

**Nộp Báo cáo Trực tuyến**

Chi đoàn Ấp có thể nộp báo cáo định kỳ và văn bản phản hồi trực tiếp lên Đoàn xã thông qua hệ thống tải tệp tích hợp. Toàn bộ lịch sử nộp văn bản được ghi lại, theo dõi trạng thái và có thể truy xuất bất cứ lúc nào.

**Quản lý Hoạt động và Lịch công tác**

Đoàn xã có thể tạo và quản lý các chương trình, phong trào, sự kiện thanh niên trên toàn xã. Lịch công tác được hiển thị theo thời gian thực và đồng bộ tới tất cả Chi đoàn Ấp.

**Thông báo Điều hành**

Đoàn xã có thể gửi thông báo khẩn và chỉ đạo tức thời tới toàn bộ hoặc từng đơn vị Chi đoàn Ấp. Hệ thống hiển thị badge thông báo chưa đọc theo thời gian thực.

**Quản lý 30 Chi đoàn Ấp**

Toàn bộ 30 Chi đoàn Ấp chính thức của xã Xuân Thới Sơn được quản lý tập trung, bao gồm thông tin bí thư, số đoàn viên và trạng thái hoạt động.

---

## Bảo mật Hệ thống

Bảo mật được thiết kế theo nhiều lớp đồng thời.

Về phía ứng dụng, phiên làm việc được lưu giữ qua `sessionStorage` giúp người dùng thoải mái thao tác và tải lại trang (F5) trong phiên. Khi đóng Tab trình duyệt, phiên làm việc sẽ tự động xóa để ngăn ngừa việc cầm máy truy cập trái phép.

Về phía cơ sở dữ liệu, toàn bộ bảng dữ liệu được bảo vệ bởi Row Level Security (RLS) trên Supabase. Mỗi người dùng chỉ có thể truy xuất đúng phần dữ liệu phù hợp với vai trò và đơn vị của mình. Tệp văn bản PDF được lưu trữ trong Storage với chính sách phân quyền riêng.

Về phía hạ tầng, Vercel tích hợp sẵn DDoS Protection và Firewall tại Edge. Ứng dụng được cấu hình Security Headers chuẩn gồm X-Frame-Options, X-Content-Type-Options, X-XSS-Protection và Referrer-Policy để chống các dạng tấn công phía trình duyệt phổ biến.

---

## Cài đặt và Khởi chạy

Yêu cầu môi trường: Node.js v18 trở lên, tài khoản Supabase và tài khoản Vercel.

Sao chép mã nguồn về máy:

```
git clone https://github.com/DT191027/doanthanhnien_dashboard.git
cd doanthanhnien_dashboard
npm install
```

Tạo tệp cấu hình môi trường `.env` tại thư mục gốc với nội dung:

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-public-key>
```

Khởi tạo cơ sở dữ liệu bằng cách chạy toàn bộ nội dung tệp `supabase_schema.sql` trong SQL Editor của Supabase Dashboard.

Khởi chạy môi trường phát triển:

```
npm run dev
```

---

## Triển khai Sản xuất

Dự án hỗ trợ triển khai tự động qua Vercel. Sau khi import repository từ GitHub, khai báo hai biến môi trường `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` trong phần Environment Variables của Vercel Dashboard, sau đó nhấn Deploy. Toàn bộ quá trình build và phân phối sẽ được Vercel xử lý tự động.

---

## Cấu trúc Mã nguồn

```
src/
  components/        Toàn bộ các thành phần giao diện React
  lib/supabase.js    Cấu hình Supabase client và dữ liệu khởi tạo
  lib/storageStrategy.js  Bộ quản lý lưu trữ Hybrid & Google Drive Backup dtnxts2026@gmail.com
  App.jsx            Bộ điều khiển trạng thái và định tuyến giao diện
  index.css          Hệ thống thiết kế và định dạng toàn ứng dụng
public/              Tài nguyên tĩnh gồm logo và hình ảnh nền
supabase_schema.sql  Toàn bộ script khởi tạo cơ sở dữ liệu & RLS policies
vercel.json          Cấu hình Security Headers và routing cho Vercel
```

---

## Về Dự án

Hệ thống được thiết kế và phát triển phục vụ nhu cầu quản lý thực tế của Đoàn TNCS Hồ Chí Minh xã Xuân Thới Sơn, Thành phố Hồ Chí Minh. Đây là sản phẩm chuyển đổi số thực tiễn áp dụng trong hoạt động điều hành cấp cơ sở, thể hiện khả năng xây dựng hệ thống quản lý đa vai trò, phân quyền dữ liệu thực tế và triển khai trên hạ tầng đám mây hiện đại.

---

Phát triển bởi DT191027. Liên hệ qua email `dtnxts2026@gmail.com` để được hỗ trợ kỹ thuật.
