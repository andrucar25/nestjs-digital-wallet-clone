import {
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common';

import { WalletApplication } from '../../application/wallet.application';
import {
  WalletNotFoundException,
} from '../../../../core/exceptions/wallet.exception';
import { WalletResponseDto } from './dtos/wallet-response.dto';

@Controller('wallet')
export class WalletController {
  constructor(
    @Inject(WalletApplication)
    private readonly application: WalletApplication,
  ) {}

  @Get(':userId')
  async getByUserId(@Param('userId') userId: string) {
    const result = await this.application.getByUserId(userId);

    if (result.isErr()) {
      const error = result.error;

      if (error instanceof WalletNotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw new InternalServerErrorException(error.message, {
          description: error.stack,
        });
    }

    return WalletResponseDto.fromDomain(result.value);
  }
}
