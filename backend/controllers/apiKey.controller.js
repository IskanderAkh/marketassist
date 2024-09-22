import User from "../models/user.model.js";

export const updateReviewsApiKey = async (req, res) => {
    try {
        const userId = req.user._id;
        const { apiKey } = req.body;

        if (!apiKey) {
            return res.status(400).json({ error: "Требуется ключ API" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }

        user.reviewsApiKey = apiKey;
        await user.save();

        res.status(200).json({ message: "Ключ API успешно обновлен" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};
