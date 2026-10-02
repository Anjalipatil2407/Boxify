import express from "express";

import {
    getShipments,
    getAllShipmentsAdmin,
    getShipmentById,
    updateShipmentStatus
} from "../controllers/shipmentController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/roleMiddleware.js";


const router =
    express.Router();


// =====================================================
// CUSTOMER
// Get logged-in customer's shipments
// =====================================================

router.get(
    "/",
    protect,
    getShipments
);


// =====================================================
// ADMIN
// Get ALL customer shipments
// IMPORTANT: Must stay ABOVE /:id
// =====================================================

router.get(
    "/admin/all",
    protect,
    adminOnly,
    getAllShipmentsAdmin
);


// =====================================================
// ADMIN
// Update shipment status
// =====================================================

router.put(
    "/:id/status",
    protect,
    adminOnly,
    updateShipmentStatus
);


// =====================================================
// CUSTOMER
// Get one shipment
// =====================================================

router.get(
    "/:id",
    protect,
    getShipmentById
);


export default router;