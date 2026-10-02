import express from "express";

import {
    sendNotification
} from "../controllers/notificationController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", protect, sendNotification);

export default router;