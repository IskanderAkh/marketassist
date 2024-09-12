import Plan from "../models/plan.model.js";

export const getAllPlans = async (req, res) => {
    try {
        const plans = await Plan.find()
        res.status(200).json(plans)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching plans' });
    }
}