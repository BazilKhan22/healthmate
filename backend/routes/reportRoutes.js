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

// Configure multer for file upload - ALLOW ALL IMAGES AND PDFS
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { 
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // ALLOW images (jpg, jpeg, png, gif, webp) AND PDFs
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only images (JPG, PNG) and PDF files are allowed!'), false);
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