import express from 'express';
import { addReview, getRatings, trainModel } from '../controllers/review.controller.js';

const router = express.Router();

router.post("/add", addReview);
router.post("/review", addReview);
router.get("/review/:investorId", getRatings);
router.post("/review/train", trainModel);

export default router;