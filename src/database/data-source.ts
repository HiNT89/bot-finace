import "dotenv/config";
import { DataSource } from "typeorm";
import {
  Category,
  Budget,
  Goal,
  IncomeSource,
  NotificationLog,
  NotificationSettings,
  RecurringTransaction,
  Transaction,
  User,
  WorkDay,
} from "./entities";

export default new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT || 5432),
  username: process.env.DATABASE_USER || "finance",
  password: process.env.DATABASE_PASSWORD || "finance",
  database: process.env.DATABASE_NAME || "finance_bot",
  entities: [User, Category, IncomeSource, Transaction, WorkDay, Goal, Budget, RecurringTransaction, NotificationSettings, NotificationLog],
});
