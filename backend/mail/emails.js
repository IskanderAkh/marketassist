import nodemailer from "nodemailer";
import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
	WELCOMING_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import dotenv from "dotenv"
dotenv.config()

// Setup nodemailer transporter using Mail.ru
const transporter = nodemailer.createTransport({
	host: "smtp.mail.ru",
	port: 465,
	secure: true, // true for port 465, false for other ports
	auth: {
		user: `${process.env.EMAIL_USER}`, // your mail.ru email
		pass: `${process.env.EMAIL_PASS}`, // your mail.ru password
	},
});

// Common send email function
const sendEmail = async ({ from, to, subject, html }) => {
	try {
		const info = await transporter.sendMail({
			from,
			to,
			subject,
			html,
		});
	} catch (error) {
		console.error("Error sending email", error);
		throw new Error(`Error sending email: ${error}`);
	}
};

// Send verification email
export const sendVerificationEmail = async (email, verificationToken) => {
	const html = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken);
	await sendEmail({
		from: '"Prodavetc.ru" <ais1uz@mail.ru>', // Change to your Mail.ru email
		to: email,
		subject: "Проверьте свою электронную почту",
		html,
	});
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
	const html = WELCOMING_EMAIL_TEMPLATE;
	await sendEmail({
		from: '"Prodavetc.ru" <ais1uz@mail.ru>',
		to: email,
		subject: "Добро пожаловать в Prodavetc.ru!",
		html,
	});
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetURL) => {
	const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);
	await sendEmail({
		from: '"Prodavetc.ru" <ais1uz@mail.ru>',
		to: email,
		subject: "Сбросить свой пароль",
		html,
	});
};

// Send password reset success email
export const sendResetSuccessEmail = async (email) => {
	const html = PASSWORD_RESET_SUCCESS_TEMPLATE;
	await sendEmail({
		from: '"Prodavetc.ru" <ais1uz@mail.ru>',
		to: email,
		subject: "Password Reset Successful",
		html,
	});
};
