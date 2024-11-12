import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { envs } from '@/config';

export const mailerConfig: MailerOptions = {
  transport: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: envs.email,
      pass: envs.password,
    },
  },
  defaults: {
    from: `"No Reply" <${envs.email}>`,
  },
  preview: false,
  template: {
    dir: process.cwd() + '/src/templates',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};