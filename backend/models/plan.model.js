import mongoose, { mongo } from "mongoose";

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    currentCost: {
        type: Number,
        required: true
    },
    prevCost: {
        type: Number,
        required: true
    },
    overview: {
        type: String,
        required: true,
    },
    planDiscount: {
        type: Number,
    },
    lvl: {
        type: Number,
        default: 0,
    }
}, { timestamps: true })

const Plan = mongoose.model("Plan", planSchema)

export default Plan