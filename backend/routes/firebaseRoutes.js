import express from "express";
import firebaseAuthMiddleware from "../middleware/firebaseAuthMiddleware.js";

const router = express.Router();

router.get(
    "/verify",
    firebaseAuthMiddleware,
    (req, res) => {

        res.status(200).json({
            message: "Firebase authentication successful",
            user: {
                uid: req.firebaseUser.uid,
                email: req.firebaseUser.email
            }
        });

    }
);

export default router;