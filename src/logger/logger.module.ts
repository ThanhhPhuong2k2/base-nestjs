import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { ConfigService } from 'src/config';
import { CustomLogger } from './logger';

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const loggerConfig = configService.getLogger();

        const consoleFormat = format.printf(
          ({ service, level, message, timestamp, data }) => {
            const dataStr = data ? ` ${JSON.stringify(data)}` : '';
            return `${timestamp} [${level}][${service}] ${message}${dataStr}`;
          },
        );

        const logTransports: any[] = [
          new transports.Console({
            format: format.combine(
              format.colorize(),
              format.timestamp(),
              consoleFormat,
            ),
          }),
        ];

        if (loggerConfig.dirpath) {
          logTransports.push(
            new transports.DailyRotateFile({
              filename: `${loggerConfig.serviceName}-%DATE%.log`,
              dirname: loggerConfig.dirpath,
              datePattern: 'YYYY-MM-DD',
              zippedArchive: true,
              maxSize: loggerConfig.maxSize,
              maxFiles: loggerConfig.maxRotate,
              format: format.combine(format.timestamp(), format.json()),
            }),
          );
        }

        return {
          level: loggerConfig.level,
          defaultMeta: { service: loggerConfig.serviceName },
          transports: logTransports,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [CustomLogger],
  exports: [CustomLogger],
})
export class LoggerModule {}
