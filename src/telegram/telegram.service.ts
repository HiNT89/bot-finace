import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { Bot, Context } from "grammy";
import { TransactionType } from "../common/enums";
import { ReportsService } from "../reports/reports.service";
import { TransactionsService } from "../transactions/transactions.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);
  private bot?: Bot;
  constructor(
    private readonly users: UsersService,
    private readonly transactions: TransactionsService,
    private readonly reports: ReportsService,
  ) {}
  async onModuleInit() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      this.logger.warn(
        "TELEGRAM_BOT_TOKEN is not set; bot polling is disabled.",
      );
      return;
    }
    this.bot = new Bot(token);
    this.bot.command("start", (ctx) => this.start(ctx));
    this.bot.command("today", (ctx) => this.today(ctx));
    this.bot.command("income", (ctx) =>
      this.transaction(ctx, TransactionType.INCOME),
    );
    this.bot.command("expense", (ctx) =>
      this.transaction(ctx, TransactionType.EXPENSE),
    );
    this.bot.catch((err) => this.logger.error(err.message));
    void this.bot.start({
      onStart: () => this.logger.log("Telegram polling started"),
    });
  }
  async onModuleDestroy() {
    await this.bot?.stop();
  }
  private async user(ctx: Context) {
    if (!ctx.from) throw new Error("Missing Telegram user");
    return this.users.findOrCreate(
      ctx.from.id,
      ctx.from.username,
      ctx.from.first_name,
    );
  }
  private async start(ctx: Context) {
    await this.user(ctx);
    await ctx.reply(
      "Chào bạn! Dùng /income 500000 freelance, /expense 50000 ăn sáng, hoặc /today.",
    );
  }
  private async today(ctx: Context) {
    const u = await this.user(ctx);
    await ctx.reply(await this.reports.daily(u.id));
  }
  private async transaction(ctx: Context, type: TransactionType) {
    const u = await this.user(ctx);
    const [amountText, ...rest] = (ctx.match as string).trim().split(/\s+/);
    const amount = Number(amountText);
    if (!amountText || !Number.isSafeInteger(amount) || amount <= 0)
      return ctx.reply(
        `Cú pháp: /${type === TransactionType.INCOME ? "income" : "expense"} 50000 mô tả`,
      );
    await this.transactions.create(
      u.id,
      type,
      amount,
      rest.join(" ") || undefined,
    );
    await ctx.reply(
      `${type === TransactionType.INCOME ? "💰 Đã thêm thu nhập" : "💸 Đã thêm chi tiêu"}: ${new Intl.NumberFormat("vi-VN").format(amount)}đ`,
    );
  }
}
