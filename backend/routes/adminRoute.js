import express from "express";
import { getUserProfilePicture, googleAuth, loginAdmin, registerAdmin } from "../controllers/adminController.js";
import { getStatistics } from "../controllers/statisticsController.js";


const adminRouter = express.Router();

adminRouter.post("/register",registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/google", googleAuth);
adminRouter.get("/profile-picture", getUserProfilePicture);
adminRouter.get("/statistics", getStatistics);

export default adminRouter;