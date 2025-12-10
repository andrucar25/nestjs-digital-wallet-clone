import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PaymentEntity } from '../entities/payment.entity';
import { PaymentInfrastructure } from '../payment.infrastructure';
import { PaymentRepository } from '../../domain/repositories/payment.repository';
import { PaymentsApplication } from '../../application/payments.application';
import { PaymentsController } from './payment.controller';
import { PaymentsKafkaProducer } from './kafka.producer';
import { PaymentsKafkaConsumer } from './kafka.consumer';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity]),
    ConfigModule,
    HttpModule,
    ClientsModule.registerAsync([
      {
        name: 'PAYMENTS_KAFKA_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId:
              // 'payments-service-producer-client',
                config.get<string>('KAFKA_CLIENT_ID'),
              brokers: [config.get<string>('KAFKA_BROKER')!],
            },
            producerOnlyMode: true,
          },
        }),
      },
    ]),
  ],
  controllers: [PaymentsController, PaymentsKafkaConsumer],
  providers: [
    PaymentInfrastructure,
    PaymentsApplication,
    PaymentsKafkaProducer,
    {
      provide: PaymentRepository,
      useExisting: PaymentInfrastructure,
    },
  ],
  exports: [PaymentsApplication, PaymentRepository],
})
export class PaymentsModule {}