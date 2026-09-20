import { BadRequestException } from '@nestjs/common';
import { TransactionType } from '../common/enums';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  const repository = { create: jest.fn((value) => value), save: jest.fn(async (value) => value) };
  const service = new TransactionsService(repository as never);
  beforeEach(() => jest.clearAllMocks());
  it('creates a positive income transaction', async () => {
    await expect(service.create('user-1', TransactionType.INCOME, 500000, 'freelance', '2026-09-20')).resolves.toMatchObject({ amount: '500000', type: TransactionType.INCOME });
  });
  it('rejects a zero amount', () => expect(() => service.create('user-1', TransactionType.EXPENSE, 0)).toThrow(BadRequestException));
});
