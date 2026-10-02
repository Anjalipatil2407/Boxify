import Customization from "../models/Customization.js";
import Subscription from "../models/Subscription.js";

const updateCustomization = async (req, res) => {
    try {
        const { categories, fragrance } = req.body;

        // Get subscription ID from URL
        const subscriptionId = req.params.id;

        // Check subscription belongs to logged-in user
        const userSubscription = await Subscription.findOne({
            _id: subscriptionId,
            user: req.user._id
        });

        if (!userSubscription) {
            return res.status(404).json({
                message: "Subscription not found"
            });
        }

        // Check if customization already exists
        let customization = await Customization.findOne({
            subscription: subscriptionId,
            user: req.user._id
        });

        // Update existing customization
        if (customization) {
            customization.categories = categories;
            customization.fragrance = fragrance;

            await customization.save();
        }

        // Create customization if it doesn't exist
        else {
            customization = await Customization.create({
                user: req.user._id,
                subscription: subscriptionId,
                categories: categories,
                fragrance: fragrance
            });
        }

        res.status(200).json({
            message: "Customization saved successfully",
            customization: customization
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
const getCustomizations = async (req, res) => {
    try {
        const customizations = await Customization.find({
            user: req.user._id
        }).populate("subscription");

        res.status(200).json(customizations);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

export {
    updateCustomization,
    getCustomizations
};