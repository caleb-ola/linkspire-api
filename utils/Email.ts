import config from "../config";
import nodemailer from "nodemailer";
import pug from "pug";
import { convert } from "html-to-text";

export default class Email {
  public to: string;
  public from: string;
  public firstname: string;
  public url: string;

  constructor(user: any, url: string) {
    this.to = user.email;
    this.from = `Linkspire <${config.APP_EMAIL_FROM}>`;
    this.firstname = user.name.split(" ")[0];
    this.url = url;
  }

  newTransport() {
    if (config.NODE_ENV === "production") {
      return nodemailer.createTransport({
        host: config.BREVO_HOST,
        port: config.BREVO_PORT,
        auth: {
          user: config.BREVO_USERNAME,
          pass: config.BREVO_KEY,
        },
      });
    } else {
      return nodemailer.createTransport({
        host: config.EMAIL_HOST,
        port: config.EMAIL_PORT,
        auth: {
          user: config.EMAIL_USERNAME,
          pass: config.EMAIL_PASSWORD,
        },
      });
    }
  }

  async send(template: string, subject: string) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        url: this.url,
        firstname: this.firstname,
        subject,
      }
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendEmailVerification() {
    await this.send(
      "verify",
      "🚀 Welcome to LinkSpire! Please Verify Your Email 📧"
    );
  }

  async welcome() {
    await this.send("welcome", "🚀 Welcome to LinkSpire! Let's Dive In! 📚");
  }

  async welcomeBack() {
    await this.send(
      "welcomeBack",
      "🎊 Welcome Back to LinkSpire! Let's Explore Together! 🚀"
    );
  }

  async sendForgotPassword() {
    await this.send(
      "forgotPassword",
      "🤔 Forgot Your Password? Let's Get You Back In! 🔐"
    );
  }

  async sendPasswordResetSuccess() {
    await this.send(
      "passwordResetSuccess",
      "🎉 Your LinkSpire Password Has Been Successfully Reset! 🔑"
    );
  }
}
