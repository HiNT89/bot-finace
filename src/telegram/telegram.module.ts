import { Module } from "@nestjs/common";
import { ReportsModule } from "../reports/reports.module";
import { TransactionsModule } from "../transactions/transactions.module";
import { UsersModule } from "../users/users.module";
import { TelegramService } from "./telegram.service";
@Module({
  imports: [UsersModule, TransactionsModule, ReportsModule],
  providers: [TelegramService],
})
export class TelegramModule {}
