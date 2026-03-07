import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        default: "user" 
    },
    // 👇 YEH FIELDS ADD KARO (Settings page ke liye zaroori hain)
    phone: { 
        type: String, 
        default: '' 
    },
    dateOfBirth: { 
        type: Date, 
        default: null 
    },
    gender: { 
        type: String, 
        enum: ['male', 'female', 'other'], 
        default: 'male' 
    },
    bloodGroup: { 
        type: String, 
        default: '' 
    },
    height: { 
        type: Number, 
        default: null 
    },
    weight: { 
        type: Number, 
        default: null 
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;