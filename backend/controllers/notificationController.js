import { firebaseMessaging } from "../config/firebase.js";

const sendNotification = async (req, res) => {
    try {
        const { token, title, body } = req.body;

        if (!token || !title || !body) {
            return res.status(400).json({
                message: "Token, title and body are required"
            });
        }

        const message = {
            notification: {
                title: title,
                body: body
            },
            token: token
        };

        const response = await firebaseMessaging.send(message);

        res.status(200).json({
            message: "Notification sent successfully",
            response: response
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to send notification",
            error: error.message
        });
    }
};

export { sendNotification };