import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category, User } from '../database/entities';
import { TransactionType } from '../common/enums';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>, @InjectRepository(Category) private readonly categories: Repository<Category>) {}
  async findOrCreate(telegramId: number, username?: string, firstName?: string): Promise<User> {
    const existing = await this.users.findOneBy({ telegramId: String(telegramId) });
    if (existing) return existing;
    const user = await this.users.save(this.users.create({ telegramId: String(telegramId), username, firstName }));
    await this.categories.save(['Ăn uống', 'Di chuyển', 'Mua sắm', 'Hóa đơn', 'Khác'].map((name) => this.categories.create({ userId: user.id, name, type: TransactionType.EXPENSE })));
    return user;
  }
}
