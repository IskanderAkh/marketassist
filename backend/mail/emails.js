import nodemailer from "nodemailer";
import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
	WELCOMING_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
	host: 'mail.hosting.reg.ru',
	port: 465,
	secure: true,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

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

export const sendVerificationEmail = async (email, verificationToken) => {
	const html = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken);
	await sendEmail({
		from: `"Marketassist.ru" <${process.env.EMAIL_USER}>`,
		to: email,
		subject: "Проверьте свою электронную почту",
		html,
	});
};

export const sendWelcomeEmail = async (email, name) => {
	const html = WELCOMING_EMAIL_TEMPLATE;
	await sendEmail({
		from: `"Marketassist.ru"  <${process.env.EMAIL_USER}>`,
		to: email,
		subject: "Добро пожаловать в Marketassist!",
		html,
	});
};

export const sendPasswordResetEmail = async (email, resetURL) => {
	const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);
	await sendEmail({
		from: `"Marketassist.ru"  <${process.env.EMAIL_USER}>`,
		to: email,
		subject: "Сбросить свой пароль",
		html,
	});
};

export const sendResetSuccessEmail = async (email) => {
	const html = PASSWORD_RESET_SUCCESS_TEMPLATE;
	await sendEmail({
		from: `"Marketassist.ru" <${process.env.EMAIL_USER}>`,
		to: email,
		subject: "Сброс пароля проведен успешно ",
		html,
	});
};
