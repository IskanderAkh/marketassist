import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
  host: 'mail.hosting.reg.ru',
  port: 465, // или 587 для TLS
  secure: true, // true для 465, false для 587
  auth: {
    user: 'info@marketassist.ru', // ваш логин
    pass: 'dH5qP8aM5xjQ4fX3', // ваш пароль
  },
});

let mailOptions = {
  from: '"MarketAssist" <info@marketassist.ru>',
  to: 'iskanderakhmedov05@gmail.com', // получатель
  subject: 'Верификация аккаунта',
  text: 'Подтвердите вашу почту, перейдя по ссылке...',
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Ошибка при отправке:', error);
    }
    console.log('Письмо отправлено:', info);
    console.log('Ответ сервера:', info.response);
  });