import mongoose from "mongoose";

const customizationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        subscription: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subscription",
            required: true
        },

        mood: {
            type: String,
            enum: ["RESET", "GLOW", "COZY", "FOCUS"],
            default: "RESET"
        },

        categories: {
            type: [String],
            default: []
        },

        fragrance: {
            type: String,
            default: "None"
        }
    },
    {
        timestamps: true
    }
);

const Customization = mongoose.model(
    "Customization",
    customizationSchema
);

export default Customization;