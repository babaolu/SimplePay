import express, { Router, json } from "express";
import authRoute from "./firebase_admin.js";
import createUser from "./createUser.js";
import getUser from "./getUser.js";
import getAccount from "./getAccount.js";
import linkAccount from "./linkAccount.js";
import unlinkAccount from "./unlinkAccount.js";
import cors from "cors";

const app = express();
const api = Router();

app.use(json())
api.use(authRoute);
api.post('/create', createUser);
api.post('/link_account', linkAccount);
api.get('/account', getAccount);
api.get('/user', getUser);
api.delete('/unlink', unlinkAccount);

const corsOptions = {
  origin: "http://localhost:3000", // replace with your frontend's origin
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"]
};
app.use(cors(corsOptions));
app.use('/api', api);
app.listen(8090, () => {
  console.log("Server running on localhost:8090");
});
