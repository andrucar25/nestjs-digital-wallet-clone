import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { LoggingInterceptor } from './core/interceptor/logging.interceptor';

const logger = new Logger('PaymentsBootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 3030;

  // to listen events from wallet
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       brokers: [config.get<string>('KAFKA_BROKER')!],
  //       clientId: config.get<string>('KAFKA_CLIENT_ID')
  //     },
  //     consumer: {
  //       groupId: config.get<string>('KAFKA_GROUP_ID')!
  //     },
  //   },
  // });

  // await app.startAllMicroservices();
  await app.listen(port, () => {
    logger.log(
      `Payments Service running on http://localhost:${port}`,
      'Nest Listen',
    );
  });
}

bootstrap();