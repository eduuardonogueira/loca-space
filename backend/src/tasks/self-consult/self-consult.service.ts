import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import configuration from 'src/config/configuration';

@Injectable()
export class SelfConsultService {
  private readonly logger = new Logger(SelfConsultService.name);

  @Cron('*/30 * * * * *')
  async keepAlivePing() {
    try {
      const config = configuration();

      const baseUrl = config.backendUrl.replace(/\/api\/?$/, '');
      const url = `${baseUrl}/api`;
      const res = await fetch(url);
      this.logger.log(`Keep-alive ping sent to ${url} - status: ${res.status}`);
    } catch (err) {
      this.logger.warn('Keep-alive ping failed: ' + err?.message);
    }
  }
}
