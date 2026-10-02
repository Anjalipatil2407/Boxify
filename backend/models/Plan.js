import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        productCount: {
            type: Number,
            required: true
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

const Plan = mongoose.model("Plan", planSchema);

export default Plan;