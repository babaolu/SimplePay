import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import dotenv from "dotenv";

dotenv.config();
const app = initializeApp({
  credential: applicationDefault()
});


// Verify request token and return uid
export default function authRoute(req, res, next) {
  const idToken = req.headers['authorization'];
  console.log('No ID Token', idToken);
  console.log("App Name:", app.name);
  const auth = getAuth(app);
  if (idToken) {
    auth.verifyIdToken(idToken)
    .then((decodedToken) => {
      if (decodedToken) {
        req['uid'] = decodedToken.uid;
        console.log("User ID", req['uid']);
      } else {
        console.log("User not authenticated");
      }
    }).catch((error) => {
      console.error("Error Token:", error);
      // Handle error
    });
  }
  next();
}