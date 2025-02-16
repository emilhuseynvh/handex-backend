import { Injectable, NestMiddleware } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  constructor(private cls: ClsService) { }
  use(req: any, res: any, next: (error?: any) => void) {
    console.log(I18nContext.current()?.lang);
    this.cls.set('lang', I18nContext.current()?.lang);
    
    next();
  }
}