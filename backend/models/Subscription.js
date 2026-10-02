import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plan",
            required: true
        },

        status: {
            type: String,
            enum: ["active", "paused", "cancelled"],
            default: "active"
        },

        startDate: {
            type: Date,
            default: Date.now
        },

        deliveryFrequency: {
            type: String,
            default: "monthly"
        }
    },
    {
        timestamps: true
    }
);

const Subscription = mongoose.model(
    "Subscription",
    subscriptionSchema
);

export default Subscription;