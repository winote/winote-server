import { convertInt, safeDeserialize } from '../shared/functions';
import { config as dotenv } from 'dotenv-safe';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { version } from './version';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AppOptions } from 'firebase-admin/lib/firebase-namespace-api';
import * as FirebaseAdmin from 'firebase-admin';
import { FirebaseOptions } from '@firebase/app';

const DEVELOPMENT_ENV = 'development';
const isDevelopment =
  (process.env.NODE_ENV || DEVELOPMENT_ENV) === DEVELOPMENT_ENV;
if (isDevelopment) {
  dotenv({ allowEmptyValues: true, example: '.env.dev', path: './.env.dev' });
}

export interface IAuthConfig {
  defaultPassword: string;
  firebaseAdmin: AppOptions;
  firebaseClient: FirebaseOptions;
}

export interface IAccessTriesLimitConfig {
  tries: number;
  blockTime: number;
}

export interface IConfig {
  typeorm: TypeOrmModuleOptions;
  helmet: any;
  cors: CorsOptions;
  auth: IAuthConfig;
  accessTriesLimit: IAccessTriesLimitConfig;
  httpPort: number;
  version: string;
}

let firebaseAdminOptions: AppOptions = undefined;
try {
  if (process.env.FIREBASE_ADMIN_CREDENTIAL) {
    const credentialData = safeDeserialize(
      process.env.FIREBASE_ADMIN_CREDENTIAL
    );
    if (credentialData) {
      firebaseAdminOptions = {
        credential: FirebaseAdmin.credential.cert(credentialData),
        databaseURL: process.env.FIREBASE_ADMIN_DATABASE_URL,
        storageBucket: `${process.env.BUCKET_NAME}`,
      };
    }
  }
} catch (e) {
  console.error(e);
}

let firebaseClientOptions: FirebaseOptions = undefined;
try {
  if (process.env.FIREBASE_CLIENT) {
    firebaseClientOptions = JSON.parse(process.env.FIREBASE_CLIENT);
  }
} catch (e) {
  console.error(e);
}

export const Config: IConfig = {
  typeorm: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: convertInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['**/*.entity.js'],
    synchronize: false,
    logging: false,
    maxQueryExecutionTime: 10000,
    migrationsTableName: 'migrations',
    migrations: ['dist/migrations/*.js'],
    migrationsRun: true,
    cli: {
      migrationsDir: 'src/migrations',
    },
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
  helmet: {
    contentSecurityPolicy: false,
    // contentSecurityPolicy: {
    //     directives: {
    //         'script-src': process.env.CSS_SCRIPT_SRC,
    //         'connect-src': process.env.CSS_CONNECTION_SRC,
    //         'img-src': process.env.CSS_IMAGE_SRC,
    //         'default-src': process.env.CSS_DEFAULT_SRC,
    //         'frame-ancestors': process.env.CSS_FRAME_ANCESTORS,
    //     },
    // },
    noSniff: false,
  },
  cors: {
    origin: process.env.CORS_ORIGIN,
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS,
    credentials: true,
  },
  auth: {
    firebaseAdmin: firebaseAdminOptions,
    firebaseClient: firebaseClientOptions,
    defaultPassword: 'senhapadrao',
  },
  accessTriesLimit: {
    tries: convertInt(process.env.ACCESS_DENIED_TRIES),
    blockTime: convertInt(process.env.ACCESS_DENIED_BLOCK_TIME_MILLISECONDS),
  },

  httpPort: convertInt(process.env.APP_PORT, 3000),
  version,
};
