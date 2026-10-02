import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getMessaging } from "firebase-admin/messaging";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount;

// Render / Production
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT
    );
}

// Local development
else {
    const serviceAccountPath = path.join(
        __dirname,
        "../firebase-service-account.json"
    );

    serviceAccount = JSON.parse(
        fs.readFileSync(serviceAccountPath, "utf8")
    );
}

const firebaseApp = initializeApp({
    credential: cert(serviceAccount)
});

const firebaseAuth = getAuth(firebaseApp);
const firebaseMessaging = getMessaging(firebaseApp);

export {
    firebaseAuth,
    firebaseMessaging
};