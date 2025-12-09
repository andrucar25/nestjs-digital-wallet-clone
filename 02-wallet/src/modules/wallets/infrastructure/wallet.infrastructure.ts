import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { err, ok } from 'neverthrow';

import { WalletRepository, WalletResult } from '../domain/repositories/wallet.repository';
import { Wallet } from '../domain/wallet';
import { WalletEntity } from './entities/wallet.entity';
import {
  WalletGetDatabaseException,
  WalletSaveDatabaseException,
  WalletNotFoundException,
} from '../../../core/exceptions/wallet.exception';

@Injectable()
export class WalletInfrastructure implements WalletRepository {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly repository: Repository<WalletEntity>,
  ) {}

  async createForUser(userId: string): WalletResult {
    try {
      const existing = await this.repository.findOne({ where: { userId } });
      if (existing) {
        const wallet = this.toDomain(existing);
        return ok(wallet);
      }

      const entity = this.repository.create({
        userId,
        balance: '0',
        currency: 'PEN',
      });

      const saved = await this.repository.save(entity);
      const wallet = this.toDomain(saved);
      return ok(wallet);
    } catch (error: any) {
      return err(new WalletSaveDatabaseException(error.message, error.stack));
    }
  }

  async findByUserId(userId: string): WalletResult {
    try {
      const entity = await this.repository.findOne({ where: { userId } });
      if (!entity) {
        return err(new WalletNotFoundException(userId));
      }

      return ok(this.toDomain(entity));
    } catch (error: any) {
      return err(new WalletGetDatabaseException(error.message, error.stack));
    }
  }

  private toDomain(entity: WalletEntity): Wallet {
    return new Wallet({
      id: entity.id,
      userId: entity.userId,
      balance: Number(entity.balance),
      currency: entity.currency,
    });
  }
}