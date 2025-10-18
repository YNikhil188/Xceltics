import express from 'express';
import { uploadFile, getUserFiles, getFile, deleteFile, getFileStats } from '../controllers/file.controller.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/upload', protect, upload.single('file'), uploadFile);
router.get('/', protect, getUserFiles);
router.get('/stats/summary', protect, getFileStats);
router.get('/:id', protect, getFile);
router.delete('/:id', protect, deleteFile);

export default router;
