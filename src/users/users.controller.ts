import { Controller, Param, ParseIntPipe, Post, Body } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateTelegramUserDto } from "./dto/create-telegram-user.dto";
import { UsersService } from "./users.service";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post("telegram/:telegramId")
  @ApiOperation({ summary: "Create or retrieve a Telegram user" })
  @ApiCreatedResponse({ description: "User profile, creating default expense categories when new." })
  findOrCreate(@Param("telegramId", ParseIntPipe) telegramId: number, @Body() body: CreateTelegramUserDto) {
    return this.users.findOrCreate(telegramId, body.username, body.firstName);
  }
}
