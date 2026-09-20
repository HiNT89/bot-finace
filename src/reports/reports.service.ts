import { Injectable } from '@nestjs/common'; import { TransactionsService } from '../transactions/transactions.service';
const fmt = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`;
@Injectable()
export class ReportsService {
  constructor(private readonly transactions: TransactionsService) {}
  async daily(userId: string, date = new Date().toISOString().slice(0, 10)) { const t = await this.transactions.totals(userId, date, date); return `📋 DAILY SUMMARY\n${date}\n\n💰 Thu nhập: +${fmt(t.income)}\n💸 Chi tiêu: -${fmt(t.expense)}\n💵 Net: ${t.saving >= 0 ? '+' : ''}${fmt(t.saving)}`; }
}
