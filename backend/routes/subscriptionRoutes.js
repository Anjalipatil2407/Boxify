import express from "express";

import {
    createSubscription,
    getSubscriptions,
    getSubscriptionById,
    updateSubscription,
    deleteSubscription
} from "../controllers/SubscriptionController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Create subscription
router.post("/", protect, createSubscription);

// Get all subscriptions
router.get("/", protect, getSubscriptions);

// Get one subscription
router.get("/:id", protect, getSubscriptionById);

// Update subscription
router.put("/:id", protect, updateSubscription);

// Delete subscription
router.delete("/:id", protect, deleteSubscription);

export default router;