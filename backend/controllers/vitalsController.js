import Vitals from '../models/Vitals.js';

// Add vitals
const addVitals = async (req, res) => {
    try {
        const {
            date,
            bloodPressure,
            bloodSugar,
            weight,
            height,
            heartRate,
            temperature,
            notes
        } = req.body;

        const vitals = await Vitals.create({
            user: req.user._id,
            date: date || new Date(),
            bloodPressure,
            bloodSugar,
            weight,
            height,
            heartRate,
            temperature,
            notes
        });

        res.status(201).json({
            message: 'Vitals added successfully',
            vitals: {
                ...vitals.toObject(),
                bmi: vitals.bmi
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all vitals for user
const getVitals = async (req, res) => {
    try {
        const vitals = await Vitals.find({ user: req.user._id })
            .sort({ date: -1 });
        
        const vitalsWithBMI = vitals.map(vital => ({
            ...vital.toObject(),
            bmi: vital.bmi
        }));
        
        res.json(vitalsWithBMI);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single vitals entry
const getVitalsById = async (req, res) => {
    try {
        const vitals = await Vitals.findOne({ 
            _id: req.params.id, 
            user: req.user._id 
        });
        
        if (!vitals) {
            return res.status(404).json({ message: 'Vitals not found' });
        }
        
        res.json({
            ...vitals.toObject(),
            bmi: vitals.bmi
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete vitals
const deleteVitals = async (req, res) => {
    try {
        const vitals = await Vitals.findOne({ 
            _id: req.params.id, 
            user: req.user._id 
        });
        
        if (!vitals) {
            return res.status(404).json({ message: 'Vitals not found' });
        }
        
        await Vitals.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Vitals deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { addVitals, getVitals, getVitalsById, deleteVitals };