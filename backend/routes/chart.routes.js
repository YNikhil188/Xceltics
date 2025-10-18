import express from 'express';
import { generateChart, getUserCharts, getChart, deleteChart } from '../controllers/chart.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', protect, generateChart);
router.get('/', protect, getUserCharts);
router.get('/:id', protect, getChart);
router.delete('/:id', protect, deleteChart);

export default router;
