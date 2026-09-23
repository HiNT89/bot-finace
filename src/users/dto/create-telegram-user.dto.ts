import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateTelegramUserDto {
  @ApiPropertyOptional({ example: "minhnguyen" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  username?: string;

  @ApiPropertyOptional({ example: "Minh" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  firstName?: string;
}
