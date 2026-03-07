import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        default: ''
    },
    fileType: {
        type: String,
        enum: ['pdf', 'image', 'text'],
        required: true
    },
    reportDate: {
        type: Date,
        required: true
    },
    reportType: {
        type: String,
        required: true,
        trim: true
    },
    aiSummary: {
        english: { type: String, default: '' },
        urdu: { type: String, default: '' }
    },
    abnormalValues: [{
        parameter: String,
        value: String,
        normalRange: String,
        significance: String
    }],
    doctorQuestions: [String],
    dietaryAdvice: {
        avoid: [String],
        recommended: [String]
    },
    homeRemedies: [String],
    riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    }
}, {
    timestamps: true
});

const Report = mongoose.model('Report', reportSchema);
export default Report;