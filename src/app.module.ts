import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { ReportsModule } from "./reports/reports.module";
import { TelegramModule } from "./telegram/telegram.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { UsersModule } from "./users/users.module";
@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    TransactionsModule,
    ReportsModule,
    TelegramModule,
  ],
})
export class AppModule {}
