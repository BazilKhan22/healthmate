import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// 👇 YEH LINE CHANGE KI - CORS FIX
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

// Import routes
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import vitalsRoutes from './routes/vitalsRoutes.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/vitals', vitalsRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ 
        message: 'HealthMate Backend API is running!',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            reports: '/api/reports',
            vitals: '/api/vitals'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`HealthMate server running on port ${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}`);
});