import mongoose from "mongoose";

const vitalsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    bloodPressure: {
        systolic: { type: Number },
        diastolic: { type: Number }
    },
    bloodSugar: {
        fasting: { type: Number },
        postMeal: { type: Number }
    },
    weight: {
        type: Number
    },
    height: {
        type: Number
    },
    heartRate: {
        type: Number
    },
    temperature: {
        type: Number
    },
    notes: {
        type: String,
        trim: true,
        maxlength: 500
    }
}, {
    timestamps: true
});

vitalsSchema.virtual('bmi').get(function() {
    if (this.height && this.weight) {
        const heightInMeters = this.height / 100;
        return (this.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return null;
});

const Vitals = mongoose.model('Vitals', vitalsSchema);
export default Vitals;