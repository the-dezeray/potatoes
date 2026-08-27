import nodemailer from "nodemailer";

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  async sendMail({ to, subject, html, bcc }) {
    return await this.transporter.sendMail({
      from: `"Innovation Club" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
  }
}

export default new EmailService();