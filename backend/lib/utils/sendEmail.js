import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.mail.ru",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: "ais1uz@mail.ru", 
    pass: "Vihadi3CLb7Dn62rdGf3", 
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Your Name" <ais1uz@mail.ru>', // use the authenticated email address
    to: "iskanderakhmedov05@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
}

main().catch(console.error);
