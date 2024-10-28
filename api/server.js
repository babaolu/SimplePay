import express, { Router } from "express";
import authRoute from "./firebase_admin.js";
import createUser from "./createUser.js";

const app = express();

const api = Router();

api.use(authRoute);
api.post('create', createUser);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use('/api', api);
app.listen(8080);
