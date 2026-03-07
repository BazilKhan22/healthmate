import Report from '../models/Report.js';
import { sendReportEmail } from '../config/emailService.js';

// AI analysis based on report type - HELPER FUNCTION
const getAIAnalysisForReportType = (reportType) => {
    const analyses = {
        blood_test: {
            english: "Your blood test results show all parameters within normal range. Continue with regular monitoring and maintain a balanced diet.",
            urdu: "Ap ke blood test ke tamam parameters normal hain. Regular monitoring jari rakhein aur mutawazan diet ka khayal rakhein.",
            doctorQuestions: [
                "What is my cholesterol level and is it within normal range?",
                "Should I repeat this test after 3 months?",
                "Are there any specific vitamins I should supplement?",
                "How is my kidney function based on these results?",
                "Do I need to fast before the next test?"
            ],
            dietaryAdvice: {
                avoid: ["Processed foods high in sodium", "Sugary beverages", "Trans fats", "Excessive red meat"],
                recommended: ["Leafy green vegetables", "Lean proteins like chicken and fish", "Whole grains", "Fresh fruits", "Nuts and seeds"]
            },
            homeRemedies: [
                "Drink 8-10 glasses of water daily",
                "Include turmeric milk at night",
                "Practice deep breathing exercises"
            ]
        },
        xray: {
            english: "Your X-ray shows normal findings with no signs of fractures or abnormalities. The bone density appears healthy.",
            urdu: "Ap ki X-ray report mein koi fracture ya abnormality nahi hai. Bone density healthy hai.",
            doctorQuestions: [
                "Are there any signs of arthritis or joint issues?",
                "How is my bone density for my age?",
                "Should I take calcium supplements?",
                "When should I get my next X-ray?",
                "Are there any preventive exercises I should do?"
            ],
            dietaryAdvice: {
                avoid: ["Excessive caffeine", "Carbonated drinks", "High sodium foods", "Alcohol"],
                recommended: ["Calcium-rich foods like milk and yogurt", "Vitamin D sources like eggs", "Almonds", "Green vegetables", "Fish like salmon"]
            },
            homeRemedies: [
                "Do gentle stretching exercises daily",
                "Apply warm compress if you feel stiffness",
                "Maintain good posture while sitting"
            ]
        },
        mri: {
            english: "Your MRI scan shows normal brain structure with no significant abnormalities. All soft tissues appear healthy.",
            urdu: "Ap ki MRI scan mein brain ki structure normal hai. Tamam soft tissues healthy hain.",
            doctorQuestions: [
                "Are there any signs of inflammation?",
                "How is my brain health compared to last scan?",
                "Should I be concerned about any specific symptoms?",
                "How often should I get follow-up scans?",
                "Are there any lifestyle changes I should make?"
            ],
            dietaryAdvice: {
                avoid: ["High sugar foods", "Processed snacks", "Trans fats", "Excessive salt"],
                recommended: ["Omega-3 rich foods like fish", "Berries and antioxidants", "Nuts and seeds", "Green tea", "Dark chocolate in moderation"]
            },
            homeRemedies: [
                "Practice meditation for mental clarity",
                "Get 7-8 hours of quality sleep",
                "Stay mentally active with puzzles and reading"
            ]
        },
        ultrasound: {
            english: "Your ultrasound shows normal organ structure with no cysts or abnormalities detected. All measurements are within normal range.",
            urdu: "Ap ki ultrasound mein organs ki structure normal hai. Koi cyst ya abnormality nahi milli.",
            doctorQuestions: [
                "Are all organs functioning normally?",
                "Is there any sign of inflammation?",
                "Should I repeat this ultrasound?",
                "Are there any dietary changes needed?",
                "How is my organ health compared to last time?"
            ],
            dietaryAdvice: {
                avoid: ["Fried and fatty foods", "Carbonated drinks", "Excessive spicy food", "Alcohol"],
                recommended: ["Fresh vegetables and fruits", "Lean proteins", "Whole grains", "Herbal teas", "Low-fat dairy"]
            },
            homeRemedies: [
                "Stay hydrated throughout the day",
                "Avoid lying down immediately after meals",
                "Practice gentle abdominal exercises"
            ]
        },
        ecg: {
            english: "Your ECG shows normal heart rhythm with no signs of arrhythmia or abnormalities. Heart rate is within normal range.",
            urdu: "Ap ki ECG mein heart rhythm normal hai. Koi arrhythmia ya abnormality nahi hai.",
            doctorQuestions: [
                "Is my heart rhythm completely normal?",
                "Should I be concerned about my heart rate?",
                "How often should I get ECG done?",
                "Are there any lifestyle changes for heart health?",
                "Do I need any further cardiac tests?"
            ],
            dietaryAdvice: {
                avoid: ["Excessive caffeine", "High cholesterol foods", "Processed meats", "Excessive salt"],
                recommended: ["Heart-healthy oats", "Avocados", "Berries", "Dark chocolate", "Green leafy vegetables"]
            },
            homeRemedies: [
                "Practice cardio exercises like walking",
                "Manage stress through meditation",
                "Monitor blood pressure regularly"
            ]
        },
        other: {
            english: "Your medical report has been uploaded successfully. Our AI will analyze it shortly.",
            urdu: "Ap ki medical report upload ho gayi hai. AI jald is ka analysis karega.",
            doctorQuestions: [
                "What are the key findings in this report?",
                "Should I be concerned about any values?",
                "Do I need follow-up tests?",
                "Are there any lifestyle changes needed?",
                "When should I schedule my next appointment?"
            ],
            dietaryAdvice: {
                avoid: ["Processed foods", "Sugary drinks", "Excessive salt", "Fried items"],
                recommended: ["Fresh fruits and vegetables", "Lean proteins", "Whole grains", "Plenty of water"]
            },
            homeRemedies: [
                "Maintain a healthy lifestyle",
                "Exercise regularly",
                "Get adequate sleep"
            ]
        }
    };
    
    return analyses[reportType] || analyses.other;
};

// Upload report with file
const uploadReport = async (req, res) => {
    try {
        const { title, reportDate, reportType } = req.body;
        
        console.log('Upload request received:', { title, reportDate, reportType });
        console.log('File received:', req.file ? 'Yes' : 'No');

        // Validate required fields
        if (!title) {
            return res.status(400).json({ message: 'Report title is required' });
        }

        // Handle file upload or URL
        let fileUrl = '';
        let fileType = 'image';
        let fileName = '';

        if (req.file) {
            // Convert file to base64 for storage
            fileUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            fileType = req.file.mimetype.split('/')[1];
            fileName = req.file.originalname;
        } else if (req.body.fileUrl) {
            // Use provided URL
            fileUrl = req.body.fileUrl;
        } else {
            return res.status(400).json({ message: 'Please provide a file or file URL' });
        }

        // Get AI analysis based on report type
        const analysis = getAIAnalysisForReportType(reportType || 'other');

        // Create report in database
        const report = await Report.create({
            user: req.user._id,
            title,
            fileUrl,
            fileName,
            fileType,
            reportDate: reportDate || new Date(),
            reportType: reportType || 'other',
            aiSummary: {
                english: analysis.english,
                urdu: analysis.urdu
            },
            abnormalValues: analysis.abnormalValues || [],
            doctorQuestions: analysis.doctorQuestions || [],
            dietaryAdvice: analysis.dietaryAdvice || { avoid: [], recommended: [] },
            homeRemedies: analysis.homeRemedies || [],
            riskLevel: analysis.riskLevel || "low"
        });

        console.log('Report created successfully:', report._id);

        res.status(201).json({
            message: 'Report uploaded successfully',
            report
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update report
const updateReport = async (req, res) => {
    try {
        const { title, reportDate, reportType } = req.body;
        
        const report = await Report.findOne({ 
            _id: req.params.id, 
            user: req.user._id 
        });
        
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Update report fields
        if (title) report.title = title;
        if (reportDate) report.reportDate = reportDate;
        
        // If report type changed, update AI analysis
        if (reportType && reportType !== report.reportType) {
            report.reportType = reportType;
            const analysis = getAIAnalysisForReportType(reportType);
            report.aiSummary = {
                english: analysis.english,
                urdu: analysis.urdu
            };
            report.doctorQuestions = analysis.doctorQuestions || [];
            report.dietaryAdvice = analysis.dietaryAdvice || { avoid: [], recommended: [] };
            report.homeRemedies = analysis.homeRemedies || [];
        } else if (reportType) {
            report.reportType = reportType;
        }

        await report.save();

        res.json({
            message: 'Report updated successfully',
            report
        });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get all reports for user
const getReports = async (req, res) => {
    try {
        const reports = await Report.find({ user: req.user._id })
            .sort({ reportDate: -1 });
        
        res.json(reports);
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get single report
const getReportById = async (req, res) => {
    try {
        const report = await Report.findOne({ 
            _id: req.params.id, 
            user: req.user._id 
        });
        
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        
        res.json(report);
    } catch (error) {
        console.error('Get report error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Delete report
const deleteReport = async (req, res) => {
    try {
        const report = await Report.findOne({ 
            _id: req.params.id, 
            user: req.user._id 
        });
        
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        
        await Report.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Share report via email
const shareReport = async (req, res) => {
    try {
        const { email, reportId } = req.body;
        
        if (!email || !reportId) {
            return res.status(400).json({ message: 'Email and report ID are required' });
        }

        const report = await Report.findOne({ 
            _id: reportId, 
            user: req.user._id 
        });

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Send email
        await sendReportEmail(email, report.title, report);

        res.json({ 
            success: true, 
            message: `Report shared successfully with ${email}` 
        });

    } catch (error) {
        console.error('Share error:', error);
        res.status(500).json({ message: 'Failed to share report. Please try again.' });
    }
};

export { 
    uploadReport, 
    getReports, 
    getReportById, 
    deleteReport, 
    updateReport, 
    shareReport 
};