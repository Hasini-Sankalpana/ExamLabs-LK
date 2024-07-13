import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paperId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paper',
        required: true
    },
    paperName: {
        type: String,
        required: true
    },
    file: 
    { type: String, 
        required: true }
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;
