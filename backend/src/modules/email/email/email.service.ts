import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(addressEmail: string) {
    await this.mailerService.sendMail({
      to: addressEmail,
      subject: 'Email de teste',
      text: 'Email de teste',
      html: '<b>Email de teste</b>',
    });
  }

  async sendPriceDropNotification(
    email: string,
    roomName: string,
    oldPrice: number,
    newPrice: number,
    userName: string,
  ) {
    const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: #fff; margin: 0;">🎉 Preço Reduzido!</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
          <p style="font-size: 16px; color: #333;">Olá! ${userName}</p>
          <p style="font-size: 16px; color: #333;">
            Uma sala que você favoritou teve uma <strong>redução de preço</strong>!
          </p>
          <div style="background: #fff; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h2 style="color: #333; margin-top: 0;">${roomName}</h2>
            <p style="margin: 5px 0;">
              <span style="text-decoration: line-through; color: #999; font-size: 18px;">R$ ${oldPrice.toFixed(2)}</span>
            </p>
            <p style="margin: 5px 0;">
              <span style="color: #27ae60; font-size: 24px; font-weight: bold;">R$ ${newPrice.toFixed(2)}</span>
              <span style="background: #27ae60; color: #fff; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 8px;">-${discount}%</span>
            </p>
          </div>
          <p style="font-size: 14px; color: #666;">Aproveite essa oportunidade antes que o preço mude novamente!</p>
          <p style="font-size: 12px; color: #999; margin-top: 30px;">— Equipe Loca Space</p>
        </div>
      </div>
    `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `💰 Preço reduzido: ${roomName} agora por R$ ${newPrice.toFixed(2)}!`,
        html,
      });
      this.logger.log(`Price drop email sent to ${email} for room "${roomName}"`);
    } catch (err) {
      this.logger.warn(`Failed to send price drop email to ${email}: ${err?.message}`);
    }
  }
}

