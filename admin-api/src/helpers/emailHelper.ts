//src/helpers/emailHelper.ts
import Email from 'email-templates';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Derive the directory name from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const emailConfig = (viewPath: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'default_host',
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER_NAME ?? 'default_user',
      pass: process.env.SMTP_APP_PASSWORD ?? 'default_password',
    },
  });

  return new Email({
    views: { root: viewPath, options: { extension: 'ejs' } },
    message: {
      from: process.env.SMTP_USER_NAME ?? 'default_user',
    },
    send: true,
    preview: false,
    transport: transporter,
    juice: true,
    juiceSettings: {
      tableElements: ['TABLE'],
    },
    juiceResources: {
      preserveImportant: true,
      webResources: {
        relativeTo: join(__dirname, '../', '/dist/assets/css/email'),
      },
    },
  });
};
