import Subscription from "../models/Subscription.js";
import Plan from "../models/Plan.js";
import Shipment from "../models/Shipment.js";


// =====================================================
// CREATE SUBSCRIPTION
// =====================================================

const createSubscription = async (req, res) => {

    try {

        const { plan } = req.body;


        // Plan is required
        if (!plan) {

            return res.status(400).json({

                message: "Plan is required"

            });

        }


        // Check whether plan exists
        const existingPlan =
            await Plan.findById(plan);


        if (!existingPlan) {

            return res.status(404).json({

                message: "Plan not found"

            });

        }


        // Create subscription
        const subscription =
            await Subscription.create({

                user: req.user._id,

                plan: plan,

                status: "active"

            });


        // =================================================
        // AUTOMATICALLY CREATE SHIPMENT
        // =================================================

        const trackingNumber =
            `BOX${Date.now()}`;


        // Estimated delivery = 7 days from now
        const estimatedDelivery =
            new Date();

        estimatedDelivery.setDate(
            estimatedDelivery.getDate() + 7
        );


        const shipment =
            await Shipment.create({

                subscription:
                    subscription._id,

                trackingNumber:
                    trackingNumber,

                status:
                    "preparing",

                estimatedDelivery:
                    estimatedDelivery

            });


        // Populate plan before sending response
        await subscription.populate("plan");


        res.status(201).json({

            message:
                "Subscription created successfully",

            subscription:
                subscription,

            shipment:
                shipment

        });


    } catch (error) {

        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }

};


// =====================================================
// GET LOGGED-IN USER'S SUBSCRIPTIONS
// =====================================================

const getSubscriptions = async (req, res) => {

    try {

        const subscriptions =
            await Subscription.find({

                user: req.user._id

            })
            .populate("plan")
            .sort({
                createdAt: 1
            });


        res.status(200).json(
            subscriptions
        );


    } catch (error) {

        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }

};


// =====================================================
// GET ONE SUBSCRIPTION
// =====================================================

const getSubscriptionById = async (
    req,
    res
) => {

    try {

        const subscription =
            await Subscription.findById(
                req.params.id
            )
            .populate("plan");


        // Subscription not found
        if (!subscription) {

            return res.status(404).json({

                message:
                    "Subscription not found"

            });

        }


        // Make sure subscription belongs
        // to logged-in user
        if (
            subscription.user.toString()
            !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                message:
                    "You are not allowed to access this subscription"

            });

        }


        res.status(200).json(
            subscription
        );


    } catch (error) {

        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }

};


// =====================================================
// UPDATE SUBSCRIPTION
// Pause / resume / change status
// =====================================================

const updateSubscription = async (
    req,
    res
) => {

    try {

        const subscription =
            await Subscription.findById(
                req.params.id
            );


        if (!subscription) {

            return res.status(404).json({

                message:
                    "Subscription not found"

            });

        }


        // Security check
        if (
            subscription.user.toString()
            !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                message:
                    "You are not allowed to update this subscription"

            });

        }


        // Update plan if provided
        if (req.body.plan) {

            const plan =
                await Plan.findById(
                    req.body.plan
                );


            if (!plan) {

                return res.status(404).json({

                    message:
                        "Plan not found"

                });

            }


            subscription.plan =
                req.body.plan;

        }


        // Update status if provided
        if (req.body.status) {

            const allowedStatuses = [

                "active",

                "paused",

                "cancelled"

            ];


            if (
                !allowedStatuses.includes(
                    req.body.status
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid subscription status"

                });

            }


            subscription.status =
                req.body.status;

        }


        await subscription.save();


        await subscription.populate(
            "plan"
        );


        res.status(200).json({

            message:
                "Subscription updated successfully",

            subscription:
                subscription

        });


    } catch (error) {

        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }

};


// =====================================================
// DELETE / CANCEL SUBSCRIPTION
// =====================================================

const deleteSubscription = async (
    req,
    res
) => {

    try {

        const subscription =
            await Subscription.findById(
                req.params.id
            );


        if (!subscription) {

            return res.status(404).json({

                message:
                    "Subscription not found"

            });

        }


        // Security check
        if (
            subscription.user.toString()
            !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                message:
                    "You are not allowed to delete this subscription"

            });

        }


        // Delete shipment connected
        // with this subscription
        await Shipment.deleteMany({

            subscription:
                subscription._id

        });


        // Delete subscription
        await subscription.deleteOne();


        res.status(200).json({

            message:
                "Subscription cancelled successfully"

        });


    } catch (error) {

        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }

};


// =====================================================
// EXPORT CONTROLLERS
// =====================================================

export {

    createSubscription,

    getSubscriptions,

    getSubscriptionById,

    updateSubscription,

    deleteSubscription

};