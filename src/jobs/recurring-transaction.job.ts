import { Injectable } from "@nestjs/common"; import { Cron, CronExpression } from "@nestjs/schedule"; import { RecurringService } from "../recurring-transactions/recurring.service";
@Injectable() export class RecurringTransactionJob { constructor(private readonly recurring: RecurringService) {} @Cron(CronExpression.EVERY_HOUR) async run() { await this.recurring.processDue(); } }
