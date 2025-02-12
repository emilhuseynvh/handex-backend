import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import config from './config';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: config.jwtSecret,
      signOptions: {
        expiresIn: '1d',
      }
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
