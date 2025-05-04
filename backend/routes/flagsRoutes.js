import express from "express";
import { processFlag, getTotalReports, getpendingflags, reportItem } from "./flagsController.js";

const router = express.Router();

// process flag
router.put('/process/:id', processFlag);

// get total reports
router.get("/reports", getTotalReports);

// get pending flags
router.get("/pending", getpendingflags);

// report item
router.post("/report", reportItem);

export default router;

