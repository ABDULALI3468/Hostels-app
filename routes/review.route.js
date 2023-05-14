import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createReview, getReviews, deleteReview } from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", verifyToken, createReview);
router.get("/:hostelId", getReviews);
router.delete("/:id", deleteReview);

export default router;
