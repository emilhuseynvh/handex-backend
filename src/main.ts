import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // If needed for authentication
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({ detailedErrors: false }),
  );


  const config = new DocumentBuilder()
    .setTitle('Handex api')
    .setDescription('This is the swagger for handex')
    .setVersion('1.0')
    .addTag('handex')
    .addBearerAuth()
    .addGlobalParameters({ name: 'lang', description: 'language', allowEmptyValue: true, in: 'query' })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    swaggerOptions: { persistAuthorization: true }
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
