import { Controller, Get, Query } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ReportsService } from "./reports.service";

@ApiTags("reports")
@Controller("reports")
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}
  @Get("daily") @ApiOperation({ summary: "Get the formatted daily finance summary" }) @ApiQuery({ name: "userId", format: "uuid" }) @ApiQuery({ name: "date", required: false, example: "2026-09-23" }) @ApiOkResponse({ description: "Vietnamese formatted daily summary." })
  daily(@Query("userId") userId: string, @Query("date") date?: string) { return this.reports.daily(userId, date); }
  @Get("monthly") @ApiOperation({ summary: "Get current month report and goal progress" }) @ApiQuery({ name: "userId", format: "uuid" }) @ApiQuery({ name: "date", required: false, example: "2026-09-23" })
  monthly(@Query("userId") userId: string, @Query("date") date?: string) { return this.reports.monthly(userId, date); }
  @Get("weekly") weekly(@Query("userId") userId: string, @Query("date") date?: string) { return this.reports.weekly(userId, date); }
  @Get("range") range(@Query("userId") userId: string, @Query("from") from: string, @Query("to") to: string) { return this.reports.range(userId, from, to); }
}
