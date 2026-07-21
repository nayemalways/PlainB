import nodemailer from 'nodemailer';
import { EMAIL_HOST, EMAIL_PASSWORD, EMAIL_PORT, EMAIL_USER } from '../config/config.ts';
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';


interface EmailPayload {
  emailTo: string;
  emailSubject: string;
  emailText: string;
  emailHTMLBody: string;
}

export const EmailSend = async (payload: EmailPayload) => {
  const smtpOptions: SMTPTransport.Options = {
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  }
  const transporter = nodemailer.createTransport(smtpOptions);

  const MailOptions = {
    from: EMAIL_USER,
    to: payload.emailTo,
    subject: payload.emailSubject,
    text: payload.emailText,
    html: payload.emailHTMLBody,
  };

  // SEND EMAIL
  try {
    await transporter.sendMail(MailOptions);
    return true;
  } catch (error) {
    console.log(error?.message);
    return false;
  }
};
