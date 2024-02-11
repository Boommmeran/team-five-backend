import nodemailer from 'nodemailer';
import 'dotenv/config';

const { UKR_NET_PASSWORD, UKR_NET_EMAIL, UKR_NET_EMAIL_SUPPORT } = process.env;

const nodemailerConfig = {
  host: 'smtp.ukr.net',
  port: 2525,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = data =>
  transport.sendMail({
    ...data,
    from: UKR_NET_EMAIL,
    to: UKR_NET_EMAIL_SUPPORT,
  });

export default sendEmail;
