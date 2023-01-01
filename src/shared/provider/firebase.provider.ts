import * as FirebaseAdmin from 'firebase-admin';
import * as FirebaseClient from 'firebase/app';
import * as FirebaseAuthClient from 'firebase/auth';
import { Config } from '../../config/config';
import { UnauthorizedException } from '@nestjs/common';

export class FirebaseProvider {
  private static instance: FirebaseProvider = new FirebaseProvider();

  public admin: FirebaseAdmin.app.App;
  public client: FirebaseClient.FirebaseApp;

  private initialized = false;

  private constructor() {}

  public static async authAdmin(
    handler: (auth: FirebaseAdmin.auth.Auth) => Promise<void>,
  ): Promise<boolean> {
    await this.instance.init();

    if (this.instance.admin && this.instance.admin) {
      return new Promise((resolve, reject) => {
        handler(this.instance.admin.auth())
          .then(() => resolve(true))
          .catch((e) => reject(e));
      });
    }
    return new Promise((resolve) => resolve(false));
  }

  public static async authClient(
    handler: (auth: FirebaseAuthClient.Auth) => Promise<void>,
  ): Promise<boolean> {
    await this.instance.init();

    await handler(FirebaseAuthClient.getAuth(this.instance.client));

    return new Promise((resolve) => resolve(false));
  }

  public static async init(): Promise<void> {
    await this.instance.init();
  }

  public static isClientUp(): boolean {
    return Boolean(this.instance.client);
  }

  public async init(): Promise<void> {
    if (!this.initialized) {
      this.initialized = true;
      if (Config.auth.firebaseAdmin) {
        this.admin = FirebaseAdmin.initializeApp(Config.auth.firebaseAdmin);
      }

      if (Config.auth.firebaseClient) {
        this.client = FirebaseClient.initializeApp(Config.auth.firebaseClient);
      }
    }
  }
}

export class FirebaseUserNotFound extends UnauthorizedException {
  constructor(private readonly email) {
    super();
  }

  get message(): string {
    return `User with e-mail ${this.email} not found`;
  }
}

export class FirebaseNotConfigured extends Error {}
