import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { response } from "express";

//login user

const loginUser = async (req,res) => {
    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({email});

        if (!user) {
           return res.json({success:false,message:"User Doesn't Exist"});
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if (!isMatch) {
            return res.json({success:false,message:"Invalid Credentials!"});
        }

        const token = createToken(user._id);
        res.json({success:true,token});

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET);
}

//register user

const registerUser = async (req,res) => {
    const {name,password,email,defaultphoto} = req.body;
    try {
        //checking if user already exists
        const exists = await userModel.findOne({email});
        if (exists) {
            return res.json({success:false,message:"User already exists!"});
        }

        //validating emailformat and strong password

        if (!validator.isEmail(email)) {
            return response.json({success:false,message:"Please enter valid email"});
        }

        if (password.length < 8) {
            return response.json({success:false,message:"Please enter a strong password"});
        }
         
        //hashing user password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);


        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
            profilePicture:defaultphoto
        })

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({success:true,token});


    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

export const googleAuth = async (req, res) => {
    const { email, name, photo } = req.body;
    try {
      let user = await userModel.findOne({ email });
  
      if (user) {
        const token = createToken(user._id);
        return res.json({ success: true, token });
      }
  
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
  
      user = new userModel({
        name,
        email,
        password: hashedPassword,
        profilePicture: photo 
      });
  
      await user.save();
  
      const token = createToken(user._id);
      res.json({ success: true, token });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" });
    }
  };

  export const updateUserScore = async (req, res) => {
    const { examName, score } = req.body;
  
    try {
      // Verify and decode the token to get user ID
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      // Find the user by ID and update the exam score
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Check if the exam score already exists, update if it does, otherwise add new score
      const existingScoreIndex = user.examScores.findIndex((scoreObj) => scoreObj.examName === examName);
  
      if (existingScoreIndex !== -1) {
        user.examScores[existingScoreIndex].score = score;
      } else {
        user.examScores.push({ examName, score });
      }
  
      await user.save();
  
      res.json({ success: true, message: "Exam score updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

export const getUserExamScores = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, examScores: user.examScores });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const userInfo = async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || config.jwtSecret);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  const { name, email} = req.body;

  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findByIdAndDelete(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const changePassword = async (req, res) => {
  const { existingPassword, newPassword } = req.body;

  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the existing password is correct
    const isMatch = await bcrypt.compare(existingPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Existing password is incorrect' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getUserProfilePicture = async (req, res) => {
  try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || config.jwtSecret);
      const user = await userModel.findById(decoded.id);

      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({
          success: true,
          profilePicture: user.profilePicture
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {loginUser,registerUser};