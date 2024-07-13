import Favorite from '../models/favoriteModel.js';
import jwt from 'jsonwebtoken';

export const addFavoritePaper = async (req, res) => {
    const { paperId, paperName,file } = req.body;

    try {
        // Verify and decode the token to get user ID
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Check if the paper is already in the favorites list
        const existingFavorite = await Favorite.findOne({ userId, paperId });

        if (existingFavorite) {
            return res.status(400).json({ success: false, message: "Paper already in favorites" });
        }

        // Add new favorite
        const favorite = new Favorite({ userId, paperId, paperName,file });
        await favorite.save();

        res.status(201).json({ success: true, message: "Paper added to favorites successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export const getFavorites = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const favorites = await Favorite.find({ userId });
        res.status(200).json({ success: true, favorites });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const removeFavorite = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const favorite = await Favorite.findOneAndDelete({ userId, paperId: req.params.paperId });

        if (!favorite) {
            return res.status(404).json({ success: false, message: "Favorite not found" });
        }

        res.status(200).json({ success: true, message: "Favorite removed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
