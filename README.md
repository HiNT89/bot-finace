# Telegram Personal Finance Bot

MVP Phase 1 cho bot Telegram quản lý thu chi cá nhân. Hiện đã có nền tảng NestJS, PostgreSQL/TypeORM, Docker Compose và luồng Telegram đầu tiên: `/start`, `/income`, `/expense`, `/today`.

## Chạy bằng Docker

1. Mở Docker Desktop và chờ daemon ở trạng thái Running.
2. Sao chép `.env.example` thành `.env`, sau đó điền `TELEGRAM_BOT_TOKEN` nếu muốn bật bot thật.
3. Chạy `docker compose up --build -d`.
4. Xem trạng thái bằng `docker compose ps` và log ứng dụng bằng `docker compose logs -f app`.

PostgreSQL có dữ liệu bền vững trong volume `postgres_data`. Không đặt bot token thì app vẫn kết nối database nhưng không polling Telegram.

Swagger UI có tại `http://localhost:3000/api`. Hiện API HTTP chưa có endpoint nghiệp vụ vì Phase 1 ưu tiên Telegram; Swagger đã sẵn sàng để mô tả các endpoint quản trị/health khi chúng được thêm.

## Lệnh đang hỗ trợ

- `/start` — tạo hồ sơ từ Telegram ID.
- `/income 500000 freelance` — ghi thu nhập VND.
- `/expense 50000 ăn sáng` — ghi chi tiêu VND.
- `/today` — tổng thu, chi và dòng tiền trong ngày.

Số tiền phải là số nguyên dương (VND). Các phần kế tiếp theo đặc tả: categories/income sources, quick input, work days, goals và monthly report.
