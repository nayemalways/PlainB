import { fileURLToPath } from 'node:url';
import ejs from 'ejs';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';
import type { IEmailPayload } from './email.interface.ts';
import { env } from '../config/config.ts';

const smtpOptions: SMTPTransport.Options = {
  host: env.EMAIL_HOST,
  port: Number(env.EMAIL_PORT),
  secure: Number(env.EMAIL_PORT) === 465,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
};

export const transporter = nodemailer.createTransport(smtpOptions);

export const sendEmail = async (payload: IEmailPayload): Promise<void> => {
  const templatePath = fileURLToPath(
    new URL(`./templates/${payload.template}.ejs`, import.meta.url),
  );
  const html = await ejs.renderFile(templatePath, payload.data);

  await transporter.sendMail({
    from: `"PlainB" <${env.EMAIL_FROM}>`,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    html,
  });
};
