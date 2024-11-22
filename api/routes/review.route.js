import express from 'express';
import { addReview } from '../controllers/review.controller.js';

const router = express.Router();

router.post("/add", addReview);

export default router;