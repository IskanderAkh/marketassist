import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    innOrOgrnip: {
        type: String,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    allowedNumberOfBarcodes: {
        type: Number,
        default: 0,
    },
    barcodes: [{
        barcode: String,
        costPrice: Number
    }],
    companyName: {
        type: String,
        default: ""
    },
    bankAccount: {
        type: String,
        default: ""
    },
    bic: {
        type: String,
        default: ""
    },
    subscribtionLvl: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    verificationTokenRequestedAt: { type: Date },
    currentPlans: [{
        plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plan",
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        endDate: {
            type: Date,
            required: true
        },
        subscribtionLvl: Number,
        name: String,

    }]
}, { timestamps: true })


const User = mongoose.model("User", userSchema)

export default User