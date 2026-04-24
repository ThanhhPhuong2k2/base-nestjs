import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class CustomLogger {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {}

  info(message: string, data?: any) {
    this.logger?.log(message, { data });
  }

  warn(message: string, data?: any) {
    this.logger?.warn(message, { data });
  }

  error(message: string, data?: any) {
    this.logger?.error(message, { data });
  }

  debug(message: string, data?: any) {
    this.logger?.debug(message, { data });
  }
}
