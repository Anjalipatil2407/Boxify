import Shipment from "../models/Shipment.js";
import Subscription from "../models/Subscription.js";


// =====================================================
// GET LOGGED-IN USER'S SHIPMENTS
// Customer route
// =====================================================

const getShipments = async (req, res) => {

    try {

        const subscriptions =
            await Subscription.find({
                user: req.user._id
            }).select("_id");


        const subscriptionIds =
            subscriptions.map(
                (subscription) =>
                    subscription._id
            );


        const shipments =
            await Shipment.find({
                subscription: {
                    $in: subscriptionIds
                }
            })
            .populate({
                path: "subscription",
                populate: {
                    path: "plan"
                }
            })
            .sort({
                createdAt: 1
            });


        res.status(200).json(
            shipments
        );


    } catch (error) {

        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }

};


// =====================================================
// GET ALL SHIPMENTS
// Admin route
// =====================================================

const getAllShipmentsAdmin = async (req, res) => {

    try {

        const shipments =
            await Shipment.find()
            .populate({
                path: "subscription",

                populate: [
                    {
                        path: "plan"
                    },
                    {
                        path: "user",
                        select: "name email"
                    }
                ]
            })
            .sort({
                createdAt: -1
            });


        res.status(200).json(
            shipments
        );


    } catch (error) {

        res.status(500).json({

            message:
                "Server error",

            error:
                error.message

        });

    }

};


// =====================================================
// GET ONE SHIPMENT
// Customer route
// =====================================================

const getShipmentById = async (req, res) => {

    try {

        const shipment =
            await Shipment.findById(
                req.params.id
            )
            .populate({
                path: "subscription",
                populate: {
                    path: "plan"
                }
            });


        if (!shipment) {

            return res.status(404).json({

                message:
                    "Shipment not found"

            });

        }


        // Customer can only view
        // their own shipment
        if (
            shipment.subscription.user.toString()
            !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                message:
                    "You are not allowed to view this shipment"

            });

        }


        res.status(200).json(
            shipment
        );


    } catch (error) {

        res.status(500).json({

            message:
                "Server error",

            error:
                error.message

        });

    }

};


// =====================================================
// UPDATE SHIPMENT STATUS
// Admin route
// =====================================================

const updateShipmentStatus = async (req, res) => {

    try {

        const { status } =
            req.body;


        const allowedStatuses = [

            "preparing",

            "packed",

            "shipped",

            "in transit",

            "delivered"

        ];


        // Status required
        if (!status) {

            return res.status(400).json({

                message:
                    "Shipment status is required"

            });

        }


        // Validate status
        if (
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                message:
                    "Invalid shipment status"

            });

        }


        // Update shipment
        const shipment =
            await Shipment.findByIdAndUpdate(

                req.params.id,

                {
                    status: status
                },

                {
                    returnDocument: "after",
                    runValidators: true
                }

            )
            .populate({
                path: "subscription",

                populate: [
                    {
                        path: "plan"
                    },
                    {
                        path: "user",
                        select: "name email"
                    }
                ]
            });


        if (!shipment) {

            return res.status(404).json({

                message:
                    "Shipment not found"

            });

        }


        // =================================================
        // SOCKET.IO
        // =================================================

        const io =
            req.app.get("io");


        io.emit(
            "shipmentStatusUpdated",
            shipment
        );


        console.log(
            "Admin updated shipment:",
            shipment.trackingNumber,
            "→",
            shipment.status
        );


        // =================================================
        // RESPONSE
        // =================================================

        res.status(200).json({

            message:
                "Shipment status updated successfully",

            shipment:
                shipment

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Server error",

            error:
                error.message

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

export {

    getShipments,

    getAllShipmentsAdmin,

    getShipmentById,

    updateShipmentStatus

};