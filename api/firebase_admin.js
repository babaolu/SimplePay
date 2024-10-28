import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const app = initializeApp({
  credential: applicationDefault()
});


// Verify request token and return uid
export default function authRoute(req, res, next) {
  const idToken = req.headers['authorization'];
  idToken && getAuth().verifyIdToken(idToken)
    .then((decodedToken) => {
      if (decodedToken) {
        req['uid'] = decodedToken.uid;
      }
    }).catch((error) => {
      // Handle error
    });
  next();
}