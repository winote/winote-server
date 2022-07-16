import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestApplicationContextProvider } from './shared/provider/nest.provider';
import { Config } from './config/config';
import helmet from 'helmet';
import { useContainer } from 'class-validator';
import { ValidationPipe } from './shared/validation.pipe'
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';


async function bootstrap() {

    const app: INestApplication = await NestFactory.create(AppModule);

    app.use(helmet(Config.helmet));

    const container = app.select(AppModule);
    useContainer(container, { fallbackOnErrors: true });

    // Configure Pipes
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');

    app.enableCors(Config.cors);

    app.use(bodyParser.json({ limit: '256kb' }));
    app.use(bodyParser.urlencoded({ limit: '256kb', extended: true }));

    // Configure Swagger
    const options = new DocumentBuilder()
        .setTitle('Winote app')
        .setDescription('Winote app API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/api/docs', app, document);

    NestApplicationContextProvider.getInstance().setApplicationContext(app);
    await app.listen(Config.httpPort || 3000);
    Logger.log(`App runing on port ${Config.httpPort}`)
}


bootstrap();