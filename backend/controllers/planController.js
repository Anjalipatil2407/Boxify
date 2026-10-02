import Plan from "../models/Plan.js";


// ==============================
// GET ALL PLANS
// ==============================
const getPlans = async (req, res) => {
    try {
        const plans = await Plan.find();

        res.status(200).json(plans);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==============================
// GET ONE PLAN BY ID
// ==============================
const getPlanById = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({
                message: "Plan not found"
            });
        }

        res.status(200).json(plan);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==============================
// CREATE PLAN
// ==============================
const createPlan = async (req, res) => {
    try {
        const {
            name,
            price,
            description,
            productCount,
            deliveryFrequency
        } = req.body;

        const plan = await Plan.create({
            name,
            price,
            description,
            productCount,
            deliveryFrequency
        });

        res.status(201).json({
            message: "Plan created successfully",
            plan: plan
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==============================
// UPDATE PLAN
// ==============================
const updatePlan = async (req, res) => {
    try {
        const plan = await Plan.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!plan) {
            return res.status(404).json({
                message: "Plan not found"
            });
        }

        res.status(200).json({
            message: "Plan updated successfully",
            plan: plan
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==============================
// EXPORT
// ==============================
export {
    getPlans,
    getPlanById,
    createPlan,
    updatePlan
};