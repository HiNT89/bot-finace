import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { BudgetsModule } from "./budgets/budgets.module";
import { DatabaseModule } from "./database/database.module";
import { CategoriesModule } from "./categories/categories.module";
import { GoalsModule } from "./goals/goals.module";
import { IncomeSourcesModule } from "./income-sources/income-sources.module";
import { JobsModule } from "./jobs/jobs.module";
import { RecurringModule } from "./recurring-transactions/recurring.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { ReportsModule } from "./reports/reports.module";
import { TelegramModule } from "./telegram/telegram.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { UsersModule } from "./users/users.module";
import { WorkDaysModule } from "./work-days/work-days.module";
@Module({
  imports: [
    ScheduleModule.forRoot(),
    BudgetsModule,
    DatabaseModule,
    CategoriesModule,
    GoalsModule,
    IncomeSourcesModule,
    RecurringModule,
    NotificationsModule,
    JobsModule,
    UsersModule,
    WorkDaysModule,
    TransactionsModule,
    ReportsModule,
    TelegramModule,
  ],
})
export class AppModule {}
