import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import config from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import DataSource from './config/database';
import { AcceptLanguageResolver, I18nMiddleware, I18nModule, QueryResolver } from 'nestjs-i18n';
import { extname, join } from 'path';
import { ClsMiddleware, ClsModule } from 'nestjs-cls';
import { AboutModule } from './modules/content/content.module';
import { LanguageMiddleware } from './middleware/i18n.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { FileModule } from './modules/upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    TypeOrmModule.forRoot(DataSource.options),
    JwtModule.register({
      global: true,
      secret: config.jwtSecret,
      signOptions: {
        expiresIn: '1d',
      }
    }),
    JwtModule.register({
      secret: config.jwtSecret
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
        global: true
      },
      resolvers: [
        new QueryResolver(['lang', 'language']),
        new AcceptLanguageResolver(),
      ],
      typesOutputPath: join(__dirname, '../src/generated/i18n.generated.ts'),
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
      guard: { mount: true },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AboutModule,
    AuthModule,
    FileModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    return consumer.apply(ClsMiddleware, I18nMiddleware, LanguageMiddleware).forRoutes('*');
  }
}