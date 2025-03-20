import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import config from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import DataSource from './config/database';
import { AcceptLanguageResolver, I18nMiddleware, I18nModule, QueryResolver } from 'nestjs-i18n';
import path, { join } from 'path';
import { ClsMiddleware, ClsModule } from 'nestjs-cls';
import { AboutModule } from './modules/content/content.module';
import { LanguageMiddleware } from './middleware/i18n.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MetaModule } from './modules/meta/meta.module';
import { ConsultationModule } from './modules/consultation/consultation.module';
import { StatisticModule } from './modules/statistics/statistic.module';
import { NewsModule } from './modules/news/news.module';
import { CourseModule } from './modules/course/course.module';
import { GeneralModule } from './modules/general/general.module';

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
    FileModule,
    MetaModule,
    ConsultationModule,
    StatisticModule,
    NewsModule,
    CourseModule,
    GeneralModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    return consumer.apply(ClsMiddleware, I18nMiddleware, LanguageMiddleware).forRoutes('*');
  }
}