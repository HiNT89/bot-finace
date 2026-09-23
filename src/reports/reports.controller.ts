import { Controller, Get, Query } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ReportsService } from "./reports.service";

@ApiTags("reports")
@Controller("reports")
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}
  @Get("daily") @ApiOperation({ summary: "Get the formatted daily finance summary" }) @ApiQuery({ name: "userId", format: "uuid" }) @ApiQuery({ name: "date", required: false, example: "2026-09-23" }) @ApiOkResponse({ description: "Vietnamese formatted daily summary." })
  daily(@Query("userId") userId: string, @Query("date") date?: string) { return this.reports.daily(userId, date); }
}
