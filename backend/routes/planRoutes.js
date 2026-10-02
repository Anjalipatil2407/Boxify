import express from "express";
import {
    getPlans,
    getPlanById,
    createPlan,
    updatePlan
} from "../controllers/planController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get all plans
router.get("/", getPlans);

// Get one plan by ID
router.get("/:id", getPlanById);

// Create new plan - Admin only
router.post("/", protect, adminOnly, createPlan);

// Update plan - Admin only
router.put("/:id", protect, adminOnly, updatePlan);

export default router;