import Plan from "../models/plan.model.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import crypto from 'crypto';

export const getUserBarcodes = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        res.json(user.barcodes);
    } catch (error) {
        console.error('Ошибка извлечения пользовательских баркодов:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const changeUserInformation = async (req, res) => {
    try {
        const { firstName, lastName, innOrOgrnip, phoneNumber, email, companyName, currentPassword, newPassword, bankAccount, bic } = req.body;

        const userId = req.user._id;

        try {
            let user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "Пользователь не найден" });

            if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
                return res.status(400).json({ error: "Пожалуйста, предоставьте как текущий, так и новый пароль" });
            }
            if (innOrOgrnip) {
                const existingInnOrOgrnip = await User.findOne({ innOrOgrnip });
                if (existingInnOrOgrnip) {
                    return res.status(400).json({ error: 'Такой ИНН или ОГРНИП уже зарегистрирован' })
                }
            }

            if (bankAccount) {
                const existingBankAccount = await User.findOne({ bankAccount });
                if (existingBankAccount) {
                    return res.status(400).json({ error: 'Такой счет уже зарегистрирован' })
                }
            }

            if (currentPassword && newPassword) {
                const isMatch = await bcrypt.compare(currentPassword, user.password);
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
                let passwordResult = passwordRegex.test(newPassword);
                if (!isMatch) return res.status(400).json({ error: "Текущий пароль неверен" });
                if (newPassword.length < 6) {
                    return res.status(400).json({ error: "Пароль должен быть не менее 6 символов длиной" });
                }
                if (!passwordResult) {
                    return res.status(400).json({
                        error: 'Пароль должен содержать не менее 6 символов, включая заглавные и строчные буквы, цифры и специальные символы.'
                    });
                }
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(newPassword, salt);
            }
            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.email = email || user.email;
            user.phoneNumber = phoneNumber || user.phoneNumber;
            user.innOrOgrnip = innOrOgrnip || user.innOrOgrnip;
            user.companyName = companyName || user.companyName;
            user.bankAccount = bankAccount || user.bankAccount;
            user.bic = bic || user.bic;

            user = await user.save();

            user.password = null;

            return res.status(200).json(user);
        } catch (error) {
            console.error('Error in changeUserInformation:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
    catch (error) {
        console.log("Ошибка в UpdateUser: ", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const cancelSubscription = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        if (!user.currentPlans || user.currentPlans.length === 0) {

            return res.status(400).json({ message: "У вас нет активной подписки для отмены" });
        }

        user.currentPlans = [];

        await user.save();

        return res.status(200).json({ message: "Подписка успешно отменена" });
    } catch (error) {
        console.error("Ошибка отмены плана пользователя:", error);
        return res.status(500).json({ error: "Ошибка отмены плана пользователя" });
    }
};


export const checkCalcPlanAccess = async (req, res) => {
    try {
        const requiredPlans = ['66dfdcd64c02e37851cb52e9'];
        const userId = req.user._id;

        const user = await User.findById(userId);


        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }
        if (!user.currentPlans || user.currentPlans.length === 0) {
            return res.status(403).json({ message: 'У вас нет активного плана для доступа к этой функции' });
        }

        const hasAccess = user.currentPlans.some(({ plan }) =>
            requiredPlans.includes(plan._id.toString())
        );
        if (!hasAccess) {
            return res.status(403).json({ message: 'У вас нет доступа к этой функции. Обновите план подписки' });
        }
        return res.status(200).json({ hasAccess });
    } catch (error) {
        console.error('Ошибка проверки доступа к плану:', error);
        return res.status(500).json({ message: 'Ошибка сервера при проверке доступа к плану' });
    }
};

export const checkReviewPlanAccess = async (req, res) => {
    try {
        const requiredPlans = ['66dfdc354c02e37851cb52e7', '66dfdcd64c02e37851cb52e9'];
        const userId = req.user._id;
        console.log(requiredPlans);

        const user = await User.findById(userId);


        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }
        if (!user.currentPlans || user.currentPlans.length === 0) {
            return res.status(403).json({ message: 'У вас нет активного плана для доступа к этой функции' });
        }

        const hasAccess = user.currentPlans.some(({ plan }) =>
            requiredPlans.includes(plan._id.toString())
        );
        console.log(hasAccess);

        if (!hasAccess) {
            return res.status(403).json({ message: 'У вас нет доступа к этой функции. Обновите план подписки' });
        }
        return res.status(200).json({ hasAccess });
    } catch (error) {
        console.error('Ошибка проверки доступа к плану:', error);
        return res.status(500).json({ message: 'Ошибка сервера при проверке доступа к плану' });
    }
};


export const addOrUpdatePlanForUser = async (req, res) => {
    try {
        const { planId, subscriptionDurationInDays, barcodes } = req.body; // Added barcodes to request body
        const userId = req.user._id;
        const user = await User.findById(userId);
        const plan = await Plan.findById(planId);

        if (!user || !plan) {
            throw new Error("Пользователь или план не найден");
        }

        const now = new Date();
        const specialPlanId = "66dfdc354c02e37851cb52e7";
        const upgradePlanId = "66dfdcd64c02e37851cb52e9";
        const hasSpecialPlan = user.currentPlans.some(p => p.plan.toString() === specialPlanId);
        const hasUpgradePlan = user.currentPlans.some(p => p.plan.toString() === upgradePlanId);

        // Remove special plan if upgrading
        if (planId === upgradePlanId && hasSpecialPlan) {
            user.currentPlans = user.currentPlans.filter(p => p.plan.toString() !== specialPlanId);
        }

        const existingPlanIndex = user.currentPlans.findIndex(p => p.plan.toString() === planId);

        // Update or add new plan for the user
        if (existingPlanIndex !== -1) {
            user.currentPlans[existingPlanIndex].startDate = now;
            if (planId === specialPlanId) {
                user.currentPlans[existingPlanIndex].endDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
            } else {
                user.currentPlans[existingPlanIndex].endDate = new Date(now.getTime() + subscriptionDurationInDays * 24 * 60 * 60 * 1000);
            }
        } else {
            let endDate = null;
            if (planId === specialPlanId) {
                endDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
            } else {
                endDate = new Date(now.getTime() + subscriptionDurationInDays * 24 * 60 * 60 * 1000);
            }
            user.currentPlans.push({
                plan: plan._id,
                startDate: now,
                endDate: endDate,
                subscribtionLvl: plan.lvl,
                name: plan.name
            });
        }

        if (plan.lvl === 2 && barcodes) {
            user.allowedNumberOfBarcodes = barcodes;
        }

        await user.save();

        return res.status(202).json({ message: "План успешно добавлен или обновлен для пользователя" });
    } catch (error) {
        console.error("Ошибка добавления или обновления плана пользователю:", error);
        return res.status(500).json({ error: "Ошибка добавления или обновления плана пользователю" });
    }
};




export const getUserPlan = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('currentPlans.plan');
        if (!user) {
            throw new Error("Пользователь не найден");
        }
        return res.status(200).json(user.currentPlans);
    } catch (error) {
        console.error("Ошибка getUserPlan:", error);
        return res.status(500).json({ error: "Ошибка подгрузки плана пользователя" });
    }
}