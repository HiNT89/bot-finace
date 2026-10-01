import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transaction } from "../database/entities";
import { TransactionType } from "../common/enums";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactions: Repository<Transaction>,
  ) {}
  create(
    userId: string,
    type: TransactionType,
    amount: number,
    description?: string,
    transactionDate = new Date().toISOString().slice(0, 10),
  ) {
    if (!Number.isSafeInteger(amount) || amount <= 0)
      throw new BadRequestException("Số tiền phải là số nguyên dương.");
    return this.transactions.save(
      this.transactions.create({
        userId,
        type,
        amount: String(amount),
        description,
        transactionDate,
      }),
    );
  }
  listForDay(userId: string, date: string) {
    return this.transactions.find({
      where: { userId, transactionDate: date },
      order: { createdAt: "ASC" },
    });
  }
  async update(id: string, amount?: number, description?: string) {
    const transaction = await this.transactions.findOneBy({ id });
    if (!transaction) throw new NotFoundException("Không tìm thấy giao dịch.");
    if (amount !== undefined && (!Number.isSafeInteger(amount) || amount <= 0)) throw new BadRequestException("Số tiền phải là số nguyên dương.");
    return this.transactions.save({ ...transaction, ...(amount !== undefined ? { amount: String(amount) } : {}), ...(description !== undefined ? { description } : {}) });
  }
  async remove(id: string) { const result = await this.transactions.delete(id); if (!result.affected) throw new NotFoundException("Không tìm thấy giao dịch."); }
  async totals(userId: string, from: string, to: string) {
    const rows = await this.transactions
      .createQueryBuilder("t")
      .select("t.type", "type")
      .addSelect("COALESCE(SUM(t.amount), 0)", "amount")
      .where("t.userId = :userId AND t.transactionDate BETWEEN :from AND :to", {
        userId,
        from,
        to,
      })
      .groupBy("t.type")
      .getRawMany<{ type: TransactionType; amount: string }>();
    const income = Number(
      rows.find((r) => r.type === TransactionType.INCOME)?.amount ?? 0,
    );
    const expense = Number(
      rows.find((r) => r.type === TransactionType.EXPENSE)?.amount ?? 0,
    );
    return { income, expense, saving: income - expense };
  }
}
