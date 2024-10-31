import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import dotenv from "dotenv";

dotenv.config();
const app = initializeApp({
  credential: applicationDefault()
});


// Verify request token and return uid
export default function authRoute(req, res, next) {
  const idToken = req.header('Authorization').replace('Bearer ', '');
  console.log("Entered first middleware!", req.headers);
  const auth = getAuth(app);
  if (idToken) {
    auth.verifyIdToken(idToken)
    .then((decodedToken) => {
      if (decodedToken) {
        req['uid'] = decodedToken.uid;
        console.log("Authed User ID", req['uid']);
        console.log("Proceeding to next middleware...")
	      next();
      } else {
        console.log("User not authenticated");
      }
    }).catch((error) => {
      console.error("Error Token:", error);
      // Handle error
    });
  } else {
    console.log("Got no idToken!:", idToken);
  }
}
