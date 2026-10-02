import express from "express";

import {
    updateCustomization,
    getCustomizations
} from "../controllers/customizationController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Get logged-in user's customizations
router.get("/", protect, getCustomizations);

// Create or update customization
router.put("/:id", protect, updateCustomization);

export default router;