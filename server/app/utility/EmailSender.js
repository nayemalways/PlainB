import nodemailer from "nodemailer";
import {
  EMAIL_HOST,
  EMAIL_PASSWORD,
  EMAIL_PORT,
  EMAIL_SECURITY,
  EMAIL_USER,
} from "../config/config.js";

export const EmailSend = async (
  EmailTo,
  EmailSubject,
  EmailText,
  EmailHTMLBody,
) => {
  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  const MailOptions = {
    from: EMAIL_USER,
    to: EmailTo,
    subject: EmailSubject,
    text: EmailText,
    html: EmailHTMLBody,
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
