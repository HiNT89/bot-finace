import { Module } from '@nestjs/common'; import { TypeOrmModule } from '@nestjs/typeorm'; import { Category, User } from '../database/entities'; import { UsersService } from './users.service';
@Module({ imports: [TypeOrmModule.forFeature([User, Category])], providers: [UsersService], exports: [UsersService] }) export class UsersModule {}
