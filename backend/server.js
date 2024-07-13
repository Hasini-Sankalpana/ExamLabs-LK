import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import itemRouter from './routes/itemRoute.js';
import 'dotenv/config';
import path from 'path';
import favRouter from "./routes/favoriteRoute.js";
import adminRouter from "./routes/adminRoute.js";



//app config

const app = express();
const port = process.env.PORT || 4000;

//middleware

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(path.resolve(), '/uploads')));


//db connection
 connectDB();

 //api endpoints
app.use("/api/user",userRouter);
app.use("/api/admin",adminRouter);
app.use('/api/items', itemRouter);
app.use('/api/favorites', favRouter);



app.get("/", (req,res) => {
    res.send("API Working");
})

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
})
