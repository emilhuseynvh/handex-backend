import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import config from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import DataSource from './config/database';
import { AcceptLanguageResolver, I18nMiddleware, I18nModule, QueryResolver } from 'nestjs-i18n';
import path, { join } from 'path';
import { ClsMiddleware, ClsModule } from 'nestjs-cls';
import { LanguageMiddleware } from './middleware/i18n.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MetaModule } from './modules/meta/meta.module';
import { ConsultationModule } from './modules/consultation/consultation.module';
import { NewsModule } from './modules/news/news.module';
import { CourseModule } from './modules/course/course.module';
import { GeneralModule } from './modules/general/general.module';
import { ContentModule } from './modules/content/content.module';
import { UserModule } from './modules/user/user.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { StudyAreaModule } from './modules/studyArea/studyArea.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { ProjectModule } from './modules/project/project.module';
import { ServiceModule } from './modules/service/service.module';
import { FaqModule } from './modules/faq/faq.module';
import { ProgramModule } from './modules/program/program.module';
import { AboutModule } from './modules/about/about.module';
import { SectionModule } from './modules/section/section.module';
import { ContactModule } from './modules/contact/contact.module';
import { RedirectModule } from './modules/redirect/redirect.module';

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
      rootPath: join(__dirname, 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    ContentModule,
    FileModule,
    MetaModule,
    ConsultationModule,
    CourseModule,
    GeneralModule,
    UserModule,
    CustomersModule,
    ProfilesModule,
    StudyAreaModule,
    FaqModule,
    ProgramModule,
    NewsModule,
    BlogsModule,
    ProjectModule,
    ServiceModule,
    AboutModule,
    SectionModule,
    ContactModule,
    RedirectModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    return consumer.apply(ClsMiddleware, I18nMiddleware, LanguageMiddleware).forRoutes('*');
  }
}