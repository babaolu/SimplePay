import express, { Router } from "express";
import authRoute from "./firebase_admin";

const app = express();

const api = Router();

api.use(authRoute);
api.post('create', createUser);

app.use('/api', api);
