import User from "../models/user.model.js";

export const updateApiKey = async (req, res) => {
    try {
        const userId = req.user._id;
        const { apiKey } = req.body;

        if (!apiKey) {
            return res.status(400).json({ error: "API key is required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.apiKey = apiKey;
        await user.save();

        res.status(200).json({ message: "API key updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
