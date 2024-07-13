import express from 'express';
import {  addFavoritePaper, getFavorites, removeFavorite } from '../controllers/favoriteController.js';

const favRouter = express.Router();

favRouter.post('/add', addFavoritePaper);
favRouter.get('/', getFavorites);
favRouter.delete('/:paperId', removeFavorite);

export default favRouter;
