import { fileURLToPath } from 'node:url';
import ejs from 'ejs';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';
import { EMAIL_FROM, EMAIL_HOST, EMAIL_PASSWORD, EMAIL_PORT, EMAIL_USER } from '../config/config.ts';
import type { IEmailPayload } from './email.interface.ts';

const smtpOptions: SMTPTransport.Options = {
  host: EMAIL_HOST,
  port: Number(EMAIL_PORT),
  secure: Number(EMAIL_PORT) === 465,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
};

export const transporter = nodemailer.createTransport(smtpOptions);

export const sendEmail = async (payload: IEmailPayload): Promise<void> => {
  const templatePath = fileURLToPath(
    new URL(`./templates/${payload.template}.ejs`, import.meta.url),
  );
  const html = await ejs.renderFile(templatePath, payload.data);

  await transporter.sendMail({
    from: `"PlainB" <${EMAIL_FROM}>`,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    html,
  });
};
