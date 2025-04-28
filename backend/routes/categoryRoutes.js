import express from "express";
import { getCategories } from "./categoryController.js";

const router = express.Router();

// Good practice to version your API endpoints
router.get("/all", getCategories);

export default router;