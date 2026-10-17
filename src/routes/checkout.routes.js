import express from "express";
import { sell } from "../controllers/checkout.controllers.js";

const router = express.Router();

router.post("/sell", sell);

export default router;