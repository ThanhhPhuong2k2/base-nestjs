export interface IPrismaSettings {
  prismaUri: string;
  prismaDatabase: string;
  prismaUsername: string;
  prismaPassword: string;
}

export interface ILoggerSettings {
  level: string;
  serviceName: string;
  dirpath: string;
  maxSize: number;
  maxRotate: string;
}

export interface IHttpServer {
  port: number;
  timeout: number;
}

export interface IRedisSettings {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

export interface IConfig {
  httpServer: IHttpServer;
  prismaSettings: IPrismaSettings;
  loggerSettings: ILoggerSettings;
  redisSettings: IRedisSettings;
}
