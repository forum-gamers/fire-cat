import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { readFile } from 'fs';
import { config } from 'dotenv';
import jwt, { type TokenValue } from '../helpers/jwt';

config();

@Injectable()
export class Mailer {
  private readonly confirmEmail = join(
    __dirname,
    '../../email/Fg-initial-Confirm-Email.html',
  );
  constructor(private readonly mailerService: MailerService) {}

  public async sendConfirmEmail(to: string, payload: TokenValue) {
    return new Promise((resolve, reject) => {
      readFile(this.confirmEmail, 'utf-8', (err, data) => {
        if (err) reject(err);
        data = data.replaceAll(
          '[TARGET_URL]',
          `${process.env.PUBLIC_APP_URL ?? 'http://localhost:3000'}/user/verify?token=${jwt.createToken(payload)}`,
        );

        this.mailerService.verifyAllTransporters().then(() => {
          this.mailerService
            .sendMail({
              html: data,
              to,
              from: `${process.env.MAILER_EMAIL} <no reply>`,
              subject: 'EMAIL VERIFICATION',
            })
            .then((val) => {
              resolve(val);
            })
            .catch((err) => {
              reject(err);
            });
        });
      });
    });
  }
}
