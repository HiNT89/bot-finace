import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { TransactionsService } from "./transactions.service";

@ApiTags("transactions")
@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactions: TransactionsService) {}
  @Post()
  @ApiOperation({ summary: "Record income or expense" })
  @ApiCreatedResponse({ description: "Transaction was recorded." })
  create(@Body() body: CreateTransactionDto) {
    return this.transactions.create(
      body.userId,
      body.type,
      body.amount,
      body.description,
      body.transactionDate,
    );
  }
  @Get()
  @ApiOperation({ summary: "List transactions for one date" })
  @ApiQuery({ name: "userId", format: "uuid" })
  @ApiQuery({ name: "date", example: "2026-09-23" })
  @ApiOkResponse({ description: "Transactions in chronological order." })
  listForDay(@Query("userId") userId: string, @Query("date") date: string) {
    return this.transactions.listForDay(userId, date);
  }
}
