import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  Category,
  Goal,
  IncomeSource,
  Transaction,
  User,
  WorkDay,
} from "./entities";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST || "localhost",
      port: Number(process.env.DATABASE_PORT || 5432),
      username: process.env.DATABASE_USER || "hint",
      password: process.env.DATABASE_PASSWORD || "123456",
      database: process.env.DATABASE_NAME || "finance_bot",
      entities: [User, Category, IncomeSource, Transaction, WorkDay, Goal],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
