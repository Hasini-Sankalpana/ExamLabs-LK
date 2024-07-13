import adminModel from "../models/adminModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// login admin
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await adminModel.findOne({ email });

        // Fixed typo: 'user' should be 'admin'
        if (!admin) {
            return res.json({ success: false, message: "User Doesn't Exist" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials!" });
        }

        const token = createToken(admin._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// register admin
export const registerAdmin = async (req, res) => {
    const { name, password, email, defaultphoto } = req.body;
    try {
        // checking if user already exists
        const exists = await adminModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists!" });
        }

        // validating email format and strong password
        if (!validator.isEmail(email)) {
            // Fixed typo: 'response' should be 'res'
            return res.json({ success: false, message: "Please enter valid email" });
        }

        if (password.length < 8) {
            // Fixed typo: 'response' should be 'res'
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new adminModel({
            name: name,
            email: email,
            password: hashedPassword,
            profilePicture: defaultphoto
        });

        const admin = await newAdmin.save();
        const token = createToken(admin._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Google Auth
export const googleAuth = async (req, res) => {
    const { email, name, photo } = req.body;
    try {
        let admin = await adminModel.findOne({ email });

        if (admin) {
            const token = createToken(admin._id);
            return res.json({ success: true, token });
        }

        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        admin = new adminModel({
            name,
            email,
            password: hashedPassword,
            profilePicture: photo
        });

        await admin.save();

        const token = createToken(admin._id);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export const getUserProfilePicture = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || config.jwtSecret);
        const admin = await adminModel.findById(decoded.id);
  
        if (!admin) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
  
        res.json({
            success: true,
            profilePicture: admin.profilePicture
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
