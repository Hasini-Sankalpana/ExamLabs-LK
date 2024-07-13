import mongoose from "mongoose";

export const connectDB = async() => {
    (await mongoose.connect('mongodb+srv://examlabslk:examlabslk@examlabs-lk.fi5mljf.mongodb.net/examlabs-lk').then(() =>console.log("DB connected!")));
}