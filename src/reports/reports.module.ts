import { Module } from '@nestjs/common'; import { TransactionsModule } from '../transactions/transactions.module'; import { ReportsService } from './reports.service';
@Module({ imports: [TransactionsModule], providers: [ReportsService], exports: [ReportsService] }) export class ReportsModule {}
