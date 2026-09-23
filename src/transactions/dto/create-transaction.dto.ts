import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from "class-validator";
import { TransactionType } from "../../common/enums";

export class CreateTransactionDto {
  @ApiProperty({ format: "uuid" }) @IsUUID() userId!: string;
  @ApiProperty({ enum: TransactionType, example: TransactionType.EXPENSE }) @IsEnum(TransactionType) type!: TransactionType;
  @ApiProperty({ example: 50000, description: "Positive integer amount in VND" }) @Type(() => Number) @IsInt() @Min(1) amount!: number;
  @ApiPropertyOptional({ example: "Ăn sáng" }) @IsOptional() @IsString() @MaxLength(255) description?: string;
  @ApiPropertyOptional({ example: "2026-09-23", format: "date" }) @IsOptional() @IsDateString() transactionDate?: string;
}
