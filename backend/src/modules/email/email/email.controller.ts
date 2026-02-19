import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { SendEmailDto } from './email.dto';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send a test email' })
  @ApiBody({ type: SendEmailDto })
  async send(@Body() sendEmailDto: SendEmailDto) {
    await this.emailService.sendEmail(sendEmailDto.email);
    return { message: 'Email sent successfully' };
  }
}
