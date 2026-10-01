import { Module } from "@nestjs/common";
import { GoalsModule } from "../goals/goals.module";
import { BudgetsModule } from "../budgets/budgets.module";
import { CategoriesModule } from "../categories/categories.module";
import { ReportsModule } from "../reports/reports.module";
import { RecurringModule } from "../recurring-transactions/recurring.module";
import { TransactionsModule } from "../transactions/transactions.module";
import { UsersModule } from "../users/users.module";
import { WorkDaysModule } from "../work-days/work-days.module";
import { TelegramService } from "./telegram.service";
@Module({
  imports: [UsersModule, TransactionsModule, ReportsModule, WorkDaysModule, GoalsModule, BudgetsModule, CategoriesModule, RecurringModule],
  providers: [TelegramService],
})
export class TelegramModule {}
