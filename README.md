# Mộc Chi Telegram Finance Bot

Bot Telegram quản lý tài chính cá nhân, gồm Phase 1 (ghi nhận thu chi, work day, goal, báo cáo) và phần nền tảng Phase 2 (budget, recurring transaction, notification settings, scheduler và báo cáo tuần/khoảng thời gian).

## Chạy bằng Docker

1. Mở Docker Desktop và chờ daemon ở trạng thái Running.
2. Sao chép `.env.example` thành `.env`, sau đó điền `TELEGRAM_BOT_TOKEN` nếu muốn bật bot thật.
3. Chạy `docker compose up --build -d`.
4. Xem trạng thái bằng `docker compose ps` và log ứng dụng bằng `docker compose logs -f app`.

PostgreSQL có dữ liệu bền vững trong volume `postgres_data`. Không đặt bot token thì app vẫn kết nối database nhưng không polling Telegram.

Swagger UI có tại `http://localhost:3000/api`.

## Lệnh Telegram

- `/start` — tạo hồ sơ từ Telegram ID.
- `/in 500000 freelance` — ghi thu nhập VND.
- `/ex 50000 ăn sáng` — ghi chi tiêu VND.
- `/td` — tổng thu, chi và dòng tiền trong ngày.
- `/day <dd/mm|yyyy-mm-dd>` — báo cáo của một ngày trước.
- `/history <dd/mm|yyyy-mm-dd>` — danh sách giao dịch trong ngày.
- `/week` — báo cáo tuần hiện tại.
- `/month` — báo cáo tháng và tiến độ mục tiêu.
- `/work` hoặc `/work remote` — đánh dấu Office hoặc Remote.
- `/leave` — đánh dấu nghỉ.
- `/goal income|expense|saving|work <số> [tên]` — tạo mục tiêu cho tháng hiện tại.
- `/help` — hiển thị hướng dẫn trong bot.
- `/budget` — xem budget tháng; `/budget <category> <amount>` để tạo budget.
- `/recurring` — xem recurring transaction; dùng `/recurring income|expense <amount> <description> daily|weekly|monthly|yearly` để tạo.

Quick input cũng được hỗ trợ: `+500k freelance`, `50k ăn sáng`, `+15tr lương`, `100k grab`.

## REST API

Ngoài Swagger, các nhóm API hiện có gồm users, transactions, categories, income sources, work days, goals, reports, budgets, recurring transactions và notification settings.

- Reports: daily, weekly, monthly, range.
- Budgets: tạo, xem usage, cập nhật và xóa.
- Recurring transactions: tạo/xem qua Telegram hoặc API; scheduler xử lý giao dịch đến hạn mỗi giờ.
- Notification settings: lấy hoặc cập nhật cấu hình mỗi user.

Số tiền luôn là số nguyên dương VND. Bot polling chỉ hoạt động khi `TELEGRAM_BOT_TOKEN` được cấu hình.
