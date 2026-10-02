import { firebaseAuth } from "../config/firebase.js";

const firebaseAuthMiddleware = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        // Check Firebase token exists
        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({
                message: "Firebase token not provided"
            });

        }


        // Get token
        const token =
            authHeader.split(" ")[1];


        // Verify token using Firebase
        const decodedToken =
            await firebaseAuth.verifyIdToken(token);


        // Store Firebase user information
        req.firebaseUser = decodedToken;


        // Continue to next middleware/controller
        next();


    } catch (error) {

        console.log(
            "Firebase authentication error:",
            error.message
        );


        return res.status(401).json({
            message: "Invalid Firebase token"
        });

    }

};

export default firebaseAuthMiddleware;