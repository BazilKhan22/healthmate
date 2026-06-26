import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
    uploadReport, 
    getReports, 
    getReportById,
    deleteReport,
    updateReport,
    shareReport,
    getPublicReport
} from '../controllers/reportController.js';
import multer from 'multer';

const router = express.Router();

// 🔥 IMPROVED MULTER CONFIGURATION
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { 
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        console.log('📁 File type received:', file.mimetype);
        
        // ✅ Allow all images (jpg, jpeg, png, gif, webp, svg) AND PDFs
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } 
        else if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new Error(`File type not allowed: ${file.mimetype}`), false);
        }
    }
});

// Public route - No authentication required
router.get('/public/:id', getPublicReport);

// Protected routes - Authentication required
router.post('/upload', protect, upload.single('file'), uploadReport);
router.post('/share', protect, shareReport);
router.get('/', protect, getReports);
router.get('/:id', protect, getReportById);
router.put('/:id', protect, updateReport);
router.delete('/:id', protect, deleteReport);

export default router;