import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAILADMIN,
    pass: process.env.EMAILPASSWORD,
  },
});
@Injectable()
export class ConsumeEmailService {
  constructor() {}

  @RabbitSubscribe({
    routingKey: "mineracao",
    queue: "emails",
  })
  async sendEmail(email) {
    const mailOptions = {
      from: email.from,
      to: email.to,
      subject: email.subject,
      text: email.text,
      html: "",
    };
    if (email.html) {
      mailOptions.html = email.html;
    }
    await transporter.sendMail(mailOptions);
  }
}
