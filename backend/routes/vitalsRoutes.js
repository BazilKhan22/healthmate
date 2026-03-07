import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
    addVitals, 
    getVitals, 
    getVitalsById,
    deleteVitals 
} from '../controllers/vitalsController.js';

const router = express.Router();

router.post('/', protect, addVitals);
router.get('/', protect, getVitals);
router.get('/:id', protect, getVitalsById);
router.delete('/:id', protect, deleteVitals);

export default router;