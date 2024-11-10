import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async userWelcome(email: string, name: string) {
    try {
      if (!email || !name) {
        throw new Error('Missing email or name for userWelcome.');
      }

      await this.mailerService.sendMail({
        to: email,
        subject: `Welcome ${name} to SGI Platform`,
        template: 'welcome',
        context: {
          name,
          ctaLink: 'http://localhost:3000',
        },
      });

      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send welcome email to ${email}`,
        error.stack,
      );
      throw new Error(`Could not send email: ${error.message}`);
    }
  }

  async sendLoginNotification(email: string, name: string) {
    try {
      if (!email || !name) {
        throw new Error('Missing email or name for sendLoginNotification.');
      }

      await this.mailerService.sendMail({
        to: email,
        subject: `Welcome ${name} to SGI Platform`,
        template: 'login',
        context: {
          name,
          ctaLink: 'http://localhost:3000',
        },
      });
      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send welcome email to ${email}`,
        error.stack,
      );
      throw error;
    }
  }
}
