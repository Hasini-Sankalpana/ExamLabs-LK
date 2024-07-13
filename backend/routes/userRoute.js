import express from "express";
import {  changePassword, deleteUser, getUserExamScores, getUserProfilePicture, googleAuth, loginUser, registerUser, updateUser, updateUserScore,userInfo } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/google", googleAuth);
userRouter.get("/profile-picture", getUserProfilePicture);
userRouter.post("/score", updateUserScore);
userRouter.get("/exam-scores", getUserExamScores);
userRouter.put('/update',updateUser);
userRouter.delete('/delete',deleteUser);
userRouter.put('/change-password', changePassword);
userRouter.get('/info',userInfo);




export default userRouter;

