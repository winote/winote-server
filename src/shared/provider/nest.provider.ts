import { INestApplication } from '@nestjs/common';

export class NestApplicationContextProvider {
  private static instance: NestApplicationContextProvider =
    new NestApplicationContextProvider();
  private nestApplicationContext: INestApplication;

  private constructor() {}

  setApplicationContext(nestApplicationContext: INestApplication) {
    this.nestApplicationContext = nestApplicationContext;
  }

  getApplicationContext(): INestApplication {
    return this.nestApplicationContext;
  }

  public static getInstance(): NestApplicationContextProvider {
    if (!NestApplicationContextProvider.instance) {
      NestApplicationContextProvider.instance =
        new NestApplicationContextProvider();
    }
    return NestApplicationContextProvider.instance;
  }
}
