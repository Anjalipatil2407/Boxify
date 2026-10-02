import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import connectDB from "./config/db.js";


// =====================================================
// MODELS
// =====================================================

import Shipment from "./models/Shipment.js";


// =====================================================
// ROUTES
// =====================================================

import authRoutes from "./routes/authRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import customizationRoutes from "./routes/customizationRoutes.js";
import shipmentRoutes from "./routes/shipmentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import firebaseRoutes from "./routes/firebaseRoutes.js";


// =====================================================
// ENVIRONMENT VARIABLES
// =====================================================

dotenv.config();


// =====================================================
// EXPRESS APP
// =====================================================

const app = express();


// =====================================================
// CORS
// =====================================================

app.use(
    cors({
        origin: "http://localhost:5173"
    })
);


// Allows Express to read JSON
app.use(express.json());


// =====================================================
// HTTP SERVER
// =====================================================

const server = http.createServer(app);


// =====================================================
// SOCKET.IO
// =====================================================

const io = new Server(server, {

    cors: {
        origin: "http://localhost:5173"
    }

});


// =====================================================
// MAKE SOCKET.IO AVAILABLE TO CONTROLLERS
// =====================================================

app.set("io", io);


// =====================================================
// DATABASE CONNECTION
// =====================================================

connectDB();


// =====================================================
// API ROUTES
// =====================================================

// Authentication
app.use(
    "/api/auth",
    authRoutes
);


// Plans
app.use(
    "/api/plans",
    planRoutes
);


// Subscriptions
app.use(
    "/api/subscriptions",
    subscriptionRoutes
);


// Customizations
app.use(
    "/api/customizations",
    customizationRoutes
);


// Shipments
app.use(
    "/api/shipments",
    shipmentRoutes
);


// Firebase Push Notifications
app.use(
    "/api/notifications",
    notificationRoutes
);


// Firebase Authentication Verification
app.use(
    "/api/firebase",
    firebaseRoutes
);


// =====================================================
// HOME TEST ROUTE
// =====================================================

app.get("/", (req, res) => {

    res.send(
        "Boxify server is running 📦"
    );

});


// =====================================================
// SOCKET.IO CONNECTION
// =====================================================

io.on("connection", (socket) => {

    console.log(
        "User connected:",
        socket.id
    );


    // =================================================
    // SOCKET TEST / DIRECT SOCKET UPDATE
    // =================================================

    socket.on(
        "updateShipmentStatus",
        async (data) => {

            try {

                const {
                    shipmentId,
                    status
                } = data;


                // Allowed shipment statuses
                const allowedStatuses = [
                    "preparing",
                    "packed",
                    "shipped",
                    "in transit",
                    "delivered"
                ];


                // Validate status
                if (
                    !allowedStatuses.includes(status)
                ) {

                    console.log(
                        "Invalid shipment status"
                    );

                    return;
                }


                // Update shipment in MongoDB
                const shipment =
                    await Shipment.findByIdAndUpdate(

                        shipmentId,

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
                        populate: {
                            path: "plan"
                        }
                    });


                // Shipment not found
                if (!shipment) {

                    console.log(
                        "Shipment not found"
                    );

                    return;
                }


                console.log(
                    "Shipment status updated:",
                    shipment.status
                );


                // Send update to connected frontend
                io.emit(
                    "shipmentStatusUpdated",
                    shipment
                );


            } catch (error) {

                console.log(
                    "Shipment update error:",
                    error.message
                );

            }

        }
    );


    // =================================================
    // DISCONNECT
    // =================================================

    socket.on(
        "disconnect",
        () => {

            console.log(
                "User disconnected:",
                socket.id
            );

        }
    );

});


// =====================================================
// START SERVER
// =====================================================

const PORT =
    process.env.PORT || 3000;


server.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);