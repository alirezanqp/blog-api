import { PORT } from '@config';
import nodemailer from 'nodemailer';

class EmailService {
  public smtpTransport: nodemailer.Transporter;
  public link: string;
  constructor() {
    this.smtpTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(email: string, subject: string, text: string) {
    try {
      const mailOptions = {
        from: 'blog api',
        to: email,
        subject,
        text,
      };
      await this.smtpTransport.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }

  async sendVerificationEmail(email: string, verificationToken: number) {
    try {
      const subject = 'تایید ایمیل';
      const text = `برای تایید ایمیل کلیک کنید: http://localhost:3000/verify-email/${verificationToken}`;
      await this.sendEmail(email, subject, text);
    } catch (error) {
      throw error;
    }
  }
}

export default EmailService;
