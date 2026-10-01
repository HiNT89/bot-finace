# Phase 2 — Automation & Smart Tracking

## 1. Mục tiêu

Phase 2 mở rộng Telegram Personal Finance Bot từ công cụ ghi nhận dữ liệu thành trợ lý tài chính chủ động.

### Mục tiêu
- Theo dõi ngân sách theo danh mục.
- Tự động tạo giao dịch định kỳ.
- Gửi notification chủ động.
- Theo dõi tiến độ mục tiêu và cảnh báo khi chậm.
- Cung cấp báo cáo tuần/tháng nâng cao.
- Xem báo cáo của các ngày trước và khoảng thời gian.
- Xem lịch sử giao dịch.
- Có `/help` để tra cứu cú pháp.
- Giữ tương thích với Phase 1.

---

# 2. Budget

Cho phép đặt ngân sách theo category, mặc định theo tháng.

### Commands

```text
/budget
/budget <category> <amount>
```

Ví dụ:

```text
/budget food 3000000
/budget transport 1500000
```

### Response

```text
💰 BUDGET — 10/2026

🍔 Ăn uống
1.850.000 / 3.000.000
████████████░░░░ 62%

🛍 Mua sắm
1.900.000 / 2.000.000
███████████████░ 95% ⚠️
```

### Business rules

```text
used = SUM(expense.amount)
remaining = budget.amount - used
usage_percent = used / budget.amount * 100
```

Threshold:
- `< 80%`: Normal
- `>= 80%`: Warning
- `>= 100%`: Exceeded

---

# 3. Recurring Transactions

Cho phép tạo giao dịch tự động lặp lại.

### Frequency
- DAILY
- WEEKLY
- MONTHLY
- YEARLY

### Commands

```text
/recurring
/recurring income 15000000 lương monthly
/recurring expense 5000000 tiền nhà monthly
/recurring expense 260000 Netflix monthly
```

### Database

```text
recurring_transactions
├── id
├── user_id
├── type
├── amount
├── description
├── category_id
├── income_source_id
├── frequency
├── next_run_at
├── start_date
├── end_date
├── is_active
├── created_at
└── updated_at
```

### Flow

```text
Scheduler
    |
    v
Find active recurring transactions
    |
    v
Check next_run_at
    |
    +-- Not due --> Skip
    |
    +-- Due -----> Create transaction
                         |
                         v
                    Update next_run_at
```

### Rules
- Chỉ xử lý `is_active = true`.
- Không tạo trước `next_run_at`.
- Sau khi tạo thành công phải cập nhật `next_run_at`.
- Hết `end_date` thì deactivate.
- Scheduler phải idempotent, không tạo duplicate.

---

# 4. Notification System

Bot chủ động gửi:

- Daily check-in.
- Budget warning.
- Budget exceeded.
- Goal progress / at-risk.
- Goal completed.
- Weekly report.
- Monthly report.

### Daily Check-in

```text
🌙 DAILY CHECK-IN

Hôm nay bạn đã ghi nhận:

💰 Thu: 500.000đ
💸 Chi: 230.000đ

Bạn đã đi làm hôm nay chưa?

[💼 Office] [🏠 Remote] [🏖 Nghỉ]
```

### Budget warning

```text
⚠️ BUDGET WARNING

Ăn uống đã sử dụng 82%.

Đã chi: 2.460.000đ
Ngân sách: 3.000.000đ
Còn lại: 540.000đ
```

### Goal completed

```text
🎉 GOAL COMPLETED

🎯 Tiết kiệm tháng 10

10.000.000 / 10.000.000đ
```

---

# 5. Notification Settings

Command:

```text
/settings
```

Cấu hình:
- Timezone.
- Currency.
- Daily reminder.
- Daily reminder time.
- Weekly report.
- Weekly report time.
- Monthly report.
- Monthly report time.
- Goal notification.
- Budget notification.
- Budget warning threshold.

### Database

```text
notification_settings
├── id
├── user_id
├── daily_checkin_enabled
├── daily_checkin_time
├── weekly_report_enabled
├── weekly_report_time
├── monthly_report_enabled
├── monthly_report_time
├── goal_alert_enabled
├── budget_alert_enabled
├── budget_warning_percent
├── created_at
└── updated_at
```

---

# 6. Notification Logs

Dùng để tránh duplicate notification.

```text
notification_logs
├── id
├── user_id
├── type
├── reference_id
├── sent_at
└── status
```

Rules:
- Có identifier/reference cho notification.
- Log trạng thái sent/failed.
- Không gửi nếu user đã disable loại notification.
- Có thể retry notification failed.

---

# 7. Goal Tracking nâng cấp

Phase 1 có:
- Income.
- Expense.
- Saving.
- Work days.

Phase 2 thêm:
- Progress.
- Expected progress.
- Goal status.
- Goal alert.

### Progress

```text
🎯 SAVING

Target: 10.000.000đ
Current: 6.500.000đ

65%

█████████████░░░░░░░
```

### Expected progress

Ví dụ ngày 15/30:

```text
Target: 10.000.000đ
Expected: 5.000.000đ
Actual:   3.000.000đ

⚠️ Chậm tiến độ: 2.000.000đ
```

### Formula

```text
elapsed_days = current_date - start_date + 1
total_days = end_date - start_date + 1
expected = target_value * elapsed_days / total_days
```

### Status

```text
NOT_STARTED
IN_PROGRESS
AT_RISK
COMPLETED
FAILED
```

---

# 8. Weekly Report

Command:

```text
/week
```

### Response

```text
📊 WEEKLY REPORT
28/09 → 04/10

💰 INCOME
+5.200.000đ

💸 EXPENSE
-2.100.000đ

💵 SAVING
+3.100.000đ

💼 WORK
5 / 5 ngày

🎯 GOALS
2 / 3 completed
```

### Statistics
- Total income.
- Total expense.
- Total saving.
- Average daily income.
- Average daily expense.
- Average daily saving.
- Work days.
- Goal completion.
- Top expense categories.

---

# 9. Historical Reports

Cho phép xem dữ liệu của ngày trước.

## Daily report

```text
/day 30/09
```

```text
📅 DAILY REPORT
30/09/2026

💰 THU NHẬP
+500.000đ
  Freelance 500.000đ

💸 CHI TIÊU
-320.000đ
  🍔 Ăn uống 150.000đ
  🚗 Di chuyển 100.000đ
  🛍 Khác 70.000đ

💵 NET
+180.000đ

💼 WORK
Office ✅
```

## Relative date

```text
/day yesterday
/day 2days
```

## Date range

```text
/range 01/09 15/09
```

Response:

```text
📊 REPORT
01/09 → 15/09

💰 Income
8.500.000đ

💸 Expense
5.200.000đ

💵 Saving
3.300.000đ

💼 Work
11 / 11 ngày

📈 Daily average
Income:  566.667đ
Expense: 346.667đ
Saving:  220.000đ
```

---

# 10. Transaction History

Command:

```text
/history 30/09
```

Response:

```text
📋 TRANSACTIONS
30/09/2026

08:30
💰 +500.000đ
Freelance

12:15
💸 -50.000đ
Ăn trưa

18:20
💸 -100.000đ
Grab

────────────────
Income:  +500.000đ
Expense: -150.000đ
Net:      +350.000đ
```

Nếu nhiều record:
- Pagination.
- Sort theo thời gian.
- Giới hạn record mỗi response.

---

# 11. Timezone

Report phải sử dụng timezone của user.

Default:

```text
Asia/Ho_Chi_Minh
```

Ví dụ `/day 30/09` phải hiểu là:

```text
30/09 00:00
→
30/09 23:59
```

Không query ngày trực tiếp theo UTC nếu có thể gây lệch ngày.

---

# 12. Help System

### `/help`

Hiển thị toàn bộ command.

```text
💰 FINANCE
/in <amount> <description>
/ex <amount> <description>

📅 REPORTS
/td
/day <date>
/day yesterday
/history <date>
/range <from> <to>
/week
/month

💼 WORK
/work
/work remote
/leave

🎯 GOALS
/goal income|expense|saving|work <amount> [name]

💰 BUDGET
/budget
/budget <category> <amount>

🔄 RECURRING
/recurring
/recurring expense <amount> <description> monthly
/recurring income <amount> <description> monthly

⚙️ SETTINGS
/settings

/help
/help <command>
```

### Detailed help

```text
/help in
/help ex
/help day
/help goal
/help budget
/help recurring
```

---

# 13. Command Registry

Không hard-code help riêng với handler.

```ts
interface BotCommand {
  command: string;
  description: string;
  usage: string;
  examples?: string[];
}
```

Ví dụ:

```ts
const commands: BotCommand[] = [
  {
    command: 'in',
    description: 'Ghi nhận thu nhập',
    usage: '/in <amount> <description>',
    examples: [
      '/in 15000000 lương',
      '/in 500000 freelance',
    ],
  },
];
```

`/help` và `/help <command>` dùng chung registry.

---

# 14. Quick Input

Tiếp tục hỗ trợ:

```text
+500k freelance
50k ăn sáng
+15tr lương
100k grab
```

Parser:
- `+` → INCOME.
- Không có `+` → EXPENSE.
- Parse `k`, `tr`, `nghìn`, `triệu`.
- Parse description/source.
- Nếu không chắc chắn → yêu cầu confirmation.

Ví dụ:

```text
🤔 Tôi chưa chắc bạn muốn ghi:

💸 Chi tiêu
50.000đ
Nội dung: abc

[✅ Xác nhận] [❌ Hủy]
```

---

# 15. REST API

## Budget

```http
GET    /api/budgets
POST   /api/budgets
PATCH  /api/budgets/:id
DELETE /api/budgets/:id
```

## Recurring

```http
GET    /api/recurring-transactions
POST   /api/recurring-transactions
PATCH  /api/recurring-transactions/:id
DELETE /api/recurring-transactions/:id
```

## Notification Settings

```http
GET   /api/notification-settings
PATCH /api/notification-settings
```

## Reports

```http
GET /api/reports/daily?date=2026-09-30
GET /api/reports/weekly
GET /api/reports/monthly
GET /api/reports/range?from=2026-09-01&to=2026-09-15
```

## Transactions

Giữ API Phase 1:

```http
GET    /api/transactions
PATCH  /api/transactions/:id
DELETE /api/transactions/:id
```

---

# 16. Database Phase 2

Phase 1:

```text
users
categories
income_sources
transactions
work_days
goals
```

Phase 2:

```text
budgets
recurring_transactions
notification_settings
notification_logs
```

## budgets

```text
budgets
├── id
├── user_id
├── category_id
├── amount
├── start_date
├── end_date
├── warning_percent
├── created_at
└── updated_at
```

## recurring_transactions

```text
recurring_transactions
├── id
├── user_id
├── type
├── amount
├── description
├── category_id
├── income_source_id
├── frequency
├── next_run_at
├── start_date
├── end_date
├── is_active
├── created_at
└── updated_at
```

## notification_settings

```text
notification_settings
├── id
├── user_id
├── daily_checkin_enabled
├── daily_checkin_time
├── weekly_report_enabled
├── weekly_report_time
├── monthly_report_enabled
├── monthly_report_time
├── goal_alert_enabled
├── budget_alert_enabled
├── budget_warning_percent
├── created_at
└── updated_at
```

## notification_logs

```text
notification_logs
├── id
├── user_id
├── type
├── reference_id
├── sent_at
└── status
```

---

# 17. Scheduler

```text
NestJS
   |
   +-- Telegram
   +-- REST API
   +-- Scheduler
          |
          +-- Daily Check-in
          +-- Recurring Transaction
          +-- Budget Alert
          +-- Goal Alert
          +-- Weekly Report
          +-- Monthly Report
```

Giai đoạn đầu dùng:

```text
@nestjs/schedule
```

Chưa bắt buộc Redis/BullMQ.

Khi job tăng hoặc cần retry/queue:

```text
NestJS
   |
   v
Redis
   |
   v
BullMQ
   |
   +-- notification queue
   +-- recurring transaction queue
   +-- report queue
```

---

# 18. Project Structure

```text
src/
├── modules/
│   ├── users/
│   ├── transactions/
│   ├── categories/
│   ├── income-sources/
│   ├── work-days/
│   ├── goals/
│   ├── budgets/
│   ├── recurring-transactions/
│   ├── notifications/
│   └── reports/
│
├── jobs/
│   ├── daily-checkin.job.ts
│   ├── recurring-transaction.job.ts
│   ├── budget-alert.job.ts
│   ├── goal-alert.job.ts
│   ├── weekly-report.job.ts
│   └── monthly-report.job.ts
│
├── telegram/
│   ├── commands/
│   ├── handlers/
│   ├── keyboards/
│   ├── formatters/
│   └── command-registry.ts
│
└── common/
    ├── enums/
    ├── errors/
    └── utils/
```

---

# 19. Service Layer

## BudgetService

```text
createBudget()
updateBudget()
deleteBudget()
getBudgets()
getBudgetUsage()
checkBudgetStatus()
```

## RecurringTransactionService

```text
createRecurring()
updateRecurring()
deleteRecurring()
getRecurring()
processDueTransactions()
calculateNextRun()
```

## NotificationService

```text
sendNotification()
sendDailyCheckin()
sendBudgetAlert()
sendGoalAlert()
sendWeeklyReport()
sendMonthlyReport()
```

## ReportService

```text
getDailyReport()
getWeeklyReport()
getMonthlyReport()
getRangeReport()
getTransactionHistory()
```

## GoalService

```text
getGoalProgress()
calculateExpectedProgress()
calculateGoalStatus()
checkGoalAlerts()
```

---

# 20. Development Order

## M1 — Budget
- Entity.
- CRUD.
- Calculation.
- Warning.
- Exceeded.
- API.
- Telegram `/budget`.

## M2 — Recurring Transactions
- Entity.
- CRUD.
- Frequency calculation.
- Scheduler.
- Auto-create transaction.
- Telegram `/recurring`.

## M3 — Notification
- Notification settings.
- Notification service.
- Notification logs.
- Daily check-in.
- Settings API.

## M4 — Goal Automation
- Goal progress.
- Expected progress.
- Goal status.
- Goal alert.
- Goal completed notification.

## M5 — Reports
- `/week`.
- `/day`.
- `/history`.
- `/range`.
- Monthly report enhancement.
- Historical report API.

## M6 — Help & Quality
- `/help`.
- `/help <command>`.
- Command registry.
- Validation.
- Error handling.
- Unit tests.
- Integration tests.
- Swagger documentation.

---

# 21. Definition of Done

- [ ] Budget theo category.
- [ ] Budget warning theo ngưỡng.
- [ ] Budget exceeded alert.
- [ ] Recurring income.
- [ ] Recurring expense.
- [ ] Scheduler tự tạo transaction.
- [ ] Daily check-in.
- [ ] Notification settings.
- [ ] Goal progress.
- [ ] Expected goal progress.
- [ ] Goal alert.
- [ ] Weekly report.
- [ ] Monthly report nâng cấp.
- [ ] Historical daily report.
- [ ] Range report.
- [ ] Transaction history.
- [ ] `/help`.
- [ ] `/help <command>`.
- [ ] REST API + Swagger.
- [ ] Unit tests.
- [ ] Integration tests.
- [ ] Scheduler idempotent.

---

# 22. Chưa làm trong Phase 2

Để Phase 3:

- AI / Natural Language nâng cao.
- OpenAI integration.
- OCR hóa đơn.
- Bank integration.
- Next.js dashboard.
- Investment tracking.
- Net worth.
- Family/shared wallet.
- Advanced financial recommendations.

---

# 23. Architecture

```text
                         Telegram
                            |
                            v
                    +---------------+
                    |  Bot / Parser |
                    +-------+-------+
                            |
                            v
                         NestJS
                            |
        +-------------------+-------------------+
        |                   |                   |
        v                   v                   v
   Transactions          Goals              Reports
        |                   |                   |
        +-------------------+-------------------+
                            |
                    +-------+-------+
                    |               |
                    v               v
                 Budget        Recurring Tx
                    |               |
                    +-------+-------+
                            |
                            v
                        Scheduler
                            |
                            v
                      Notification
                            |
                            v
                        Telegram

                            |
                            v
                       PostgreSQL
```

---

# 24. Nguyên tắc thiết kế

1. Không phá vỡ API/database contract của Phase 1.
2. Business logic nằm trong service, không nằm trong Telegram handler.
3. Report được tính từ dữ liệu gốc.
4. Không cần lưu daily/weekly/monthly report thành dữ liệu chính.
5. Dùng timezone của user khi xử lý ngày.
6. Dùng integer cho tiền VND, không dùng float.
7. Scheduler phải idempotent.
8. Notification phải có log để kiểm soát duplicate/retry.
9. Telegram commands dùng Command Registry.
10. Module có unit test cho business rules quan trọng.
