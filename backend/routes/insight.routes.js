import express from 'express';
import { generateInsights, getInsight, getUserInsights } from '../controllers/insight.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/:fileId', protect, generateInsights);
router.get('/', protect, getUserInsights);
router.get('/:fileId', protect, getInsight);

export default router;
