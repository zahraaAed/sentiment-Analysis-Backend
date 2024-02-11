import express from 'express';
import { addFeedback, deleteFeedback, getAllFeedback } from '../Controllers/feedbackController.js';

const router = express.Router();

// Public routes
router.get('/', getAllFeedback);
router.post('/',addFeedback);
router.delete('/:id',deleteFeedback);

export default router;