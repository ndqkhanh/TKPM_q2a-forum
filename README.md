## Q2A Forum

### Mô tả:

Là một nền tảng để người dùng có thể hỏi và chia sẻ kinh nghiệm của bản thân bằng cách trả lời của người khác.

#### Người dùng: Có thể đăng câu hỏi, xóa sửa câu hỏi của mình. Có thể thêm, xóa, sửa câu trả lời cho 1 câu hỏi. Có thể downvote, upvote hay unvote 1 câu trả lời bất kỳ. Xem thông tin cá nhân, xem các câu hỏi của bản thân. Thống kê số câu hỏi và câu trả lời cho bản thân. Xem các câu hỏi mới nhất trên feed.

#### Người điều hành: Có các quyền của người dùng và quyền duyệt câu hỏi, cấm tài khoản người dùng, xem thống kê số câu hỏi và câu trả lời của toàn diễn đàn.

#### Người quản lý: Có các quyền của người điều hành và quyền thay đổi của diễn đàn, thay đổi số câu hỏi xuất hiện trên bảng feed.

### Cách tạo schema và dữ liệu giả

1. Mở terminal đền thư mục backend.
2. Chạy lệnh npx prisma db push ở backend.
3. Mở DBeaver và tạo file sql. Sau đó vào đường dẫn backend/prisma/seed sẽ thấy 4 file chứa đoạn lệnh sql. Sau đó chạy các lệnh sql từng file theo thứ tự users, configuration, questions, answers để tạo dữ liệu mẫu.

### Cách chạy ứng dụng

1. Copy file .env.example ở folder backend và đổi tên thành .env.
2. Copy file .env.example ở folder mobile và đổi tên thành .env và đổi địa chỉ ip thành địa chỉ ip trên máy.
3. Mở 2 terminal đến 2 folder backend và mobile.
4. Chạy yarn ở cả 2 terminal.
5. Chạy yarn dev ở backend.
6. Chạy yarn android ở mobile.
