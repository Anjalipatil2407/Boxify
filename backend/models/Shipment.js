import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
    {
        subscription: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subscription",
            required: true
        },

        trackingNumber: {
            type: String,
            required: true,
            unique: true
        },

        status: {
            type: String,
            enum: [
                "preparing",
                "packed",
                "shipped",
                "in transit",
                "delivered"
            ],
            default: "preparing"
        },

        estimatedDelivery: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Shipment = mongoose.model("Shipment", shipmentSchema);

export default Shipment;