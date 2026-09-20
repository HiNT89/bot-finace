import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { GoalType, TargetType, TransactionType, WorkDayType } from '../common/enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ type: 'bigint', unique: true }) telegramId!: string;
  @Column({ nullable: true }) username?: string;
  @Column({ nullable: true }) firstName?: string;
  @Column({ length: 3, default: 'VND' }) currency!: string;
  @Column({ default: 'Asia/Ho_Chi_Minh' }) timezone!: string;
  @CreateDateColumn() createdAt!: Date; @UpdateDateColumn() updatedAt!: Date;
}

@Entity('categories') @Unique(['userId', 'name', 'type'])
export class Category {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ type: 'uuid', nullable: true }) userId?: string;
  @Column() name!: string;
  @Column({ type: 'enum', enum: TransactionType }) type!: TransactionType;
  @Column({ nullable: true }) icon?: string;
  @CreateDateColumn() createdAt!: Date; @UpdateDateColumn() updatedAt!: Date;
}

@Entity('income_sources') @Unique(['userId', 'name'])
export class IncomeSource {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ type: 'uuid' }) userId!: string; @Column() name!: string;
  @CreateDateColumn() createdAt!: Date; @UpdateDateColumn() updatedAt!: Date;
}

@Entity('transactions') @Index(['userId', 'transactionDate']) @Index(['userId', 'type', 'transactionDate'])
export class Transaction {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ type: 'uuid' }) userId!: string;
  @Column({ type: 'uuid', nullable: true }) categoryId?: string;
  @Column({ type: 'uuid', nullable: true }) incomeSourceId?: string;
  @Column({ type: 'enum', enum: TransactionType }) type!: TransactionType;
  @Column({ type: 'bigint' }) amount!: string;
  @Column({ nullable: true }) description?: string;
  @Column({ type: 'date' }) transactionDate!: string;
  @CreateDateColumn() createdAt!: Date; @UpdateDateColumn() updatedAt!: Date;
}

@Entity('work_days') @Unique(['userId', 'date']) @Index(['userId', 'date'])
export class WorkDay {
  @PrimaryGeneratedColumn('uuid') id!: string; @Column({ type: 'uuid' }) userId!: string;
  @Column({ type: 'date' }) date!: string; @Column({ type: 'enum', enum: WorkDayType }) type!: WorkDayType;
  @Column({ nullable: true }) note?: string; @CreateDateColumn() createdAt!: Date; @UpdateDateColumn() updatedAt!: Date;
}

@Entity('goals') @Index(['userId', 'startDate', 'endDate'])
export class Goal {
  @PrimaryGeneratedColumn('uuid') id!: string; @Column({ type: 'uuid' }) userId!: string;
  @Column() name!: string; @Column({ type: 'enum', enum: GoalType }) type!: GoalType;
  @Column({ type: 'enum', enum: TargetType }) targetType!: TargetType;
  @Column({ type: 'bigint' }) targetValue!: string; @Column({ type: 'date' }) startDate!: string; @Column({ type: 'date' }) endDate!: string;
  @CreateDateColumn() createdAt!: Date; @UpdateDateColumn() updatedAt!: Date;
}
