import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js"
import { sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail } from "../mail/emails.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import crypto from 'crypto';

const generateVerificationCode = () => {
    return crypto.randomBytes(3).toString('hex');
};


export const signUp = async (req, res) => {
    try {
        const { firstName, lastName, innOrOgrnip, phoneNumber, email, password, companyName } = req.body

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let emailResult = emailRegex.test(email);
        if (!emailResult) {
            return res.status(400).json({ error: `Неверный формат электронной почты` });
        }

        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            return res.status(400).json({ error: "Эта почта уже зарегистрирована. Пожалуйста, используйте другую почту или войдите в свою учетную запись." })
        }

        const existingPhone = await User.findOne({ phoneNumber })
        if (existingPhone) {
            return res.status(400).json({ error: "Номер телефона уже занят. Попробуйте другой номер." })
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
        let passwordResult = passwordRegex.test(password);
        if (!passwordResult) {
            return res.status(400).json({
                error: 'Пароль должен содержать не менее 6 символов, включая заглавные и строчные буквы, цифры и специальные символы.'
            });
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new User({
            firstName,
            lastName,
            innOrOgrnip,
            phoneNumber,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        })

        await newUser.save();

        generateTokenAndSetCookie(newUser._id, res)

        try {
            await sendVerificationEmail(newUser.email, verificationToken);
        } catch (emailError) {
            console.error('Ошибка отправки электронной почты проверки:', emailError);
            return res.status(500).json({ error: 'Не удалось отправить письмо для подтверждения.' });
        }

        res.status(201).json({
            message: 'Пользователь успешно создан',
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            innOrOgrnip: newUser.innOrOgrnip,
            phoneNumber: newUser.phoneNumber,
            email: newUser.email,
            companyName: newUser.companyName,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Внутренняя ошибка сервера" })
    }
}

export const requestNewVerificationCode = async (req, res) => {
    const { email } = req.body;

    try {

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }


        const oneHourInMillis = 60 * 60 * 1000;
        const currentTime = Date.now();
        const lastRequestTime = user.verificationTokenRequestedAt || 0;

        const timeSinceLastRequest = currentTime - lastRequestTime;
        const remainingTime = oneHourInMillis - timeSinceLastRequest;

        if (remainingTime > 0) {
            const remainingSeconds = Math.floor(remainingTime / 1000);
            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;

            return res.status(429).json({
                success: false,
                message: `Вы можете запросить новый код только один раз в час. Подождите еще ${minutes} минут ${seconds} секунд`
            });
        }
        else {
            const newCode = generateVerificationCode();
            user.verificationToken = newCode;
            user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
            user.verificationTokenRequestedAt = Date.now();
            await user.save();


            await sendVerificationEmail(user.email, newCode);

            res.status(200).json({ success: true, message: 'Новый код проверки был отправлен!' });
        }
    } catch (error) {
        console.error('Error generating new verification code:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
};


export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Неверный или истекший код проверки" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Электронная почта проверена успешно",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log("error in verifyEmail ", error);
        res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            innOrOgrnip: user.innOrOgrnip,
            phoneNumber: user.phoneNumber,
            email: user.email,
            companyName: user.companyName,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const cancelRegistration = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "Регистрация отменена и аккаунт удален пользователем" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Ошибка внутреннего сервера при отмене регистрации" });
    }
};
export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Вы вышли из аккаута" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error in Logout" })
    }
}
export const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        const resetTokenExpire = Date.now() + 3600000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = resetTokenExpire;
        await user.save();

        const resetUrl =
            process.env.NODE_ENV === "production"
                ? `http://marketassist.ru/password-reset/${resetToken}` // Use domain in production
                : `${req.protocol}://localhost:3000/password-reset/${resetToken}`; // Use host and port in development

        await sendPasswordResetEmail(user.email, resetUrl);

        res.status(200).json({ message: "Ссылка для сброса пароля была отправлена на вашу почту." });

    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({ error: "Внутренняя ошибка сервера в сбросе пароля" });
    }
};
export const resetPasswordToken = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ error: "Неверный или истекший токен сброса пароля" });
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
        let passwordResult = passwordRegex.test(newPassword);
        if (!passwordResult) {
            return res.status(400).json({
                error: 'Пароль должен содержать не менее 6 символов, включая заглавные и строчные буквы, цифры и специальные символы.'
            });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ message: "Пароль был успешно изменен." });
    } catch (error) {
        console.error("Error in resetPasswordToken:", error);
        res.status(500).json({ error: "Внутренняя ошибка сервера в сбросе пароля" });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password")
        res.status(200).json(user)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error in getUser" })
    }

}


