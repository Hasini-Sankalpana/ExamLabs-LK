import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  option: { type: String, required: true },
  file: { type: String, required: false },  
  markingSchemeFile: { type: String,required: false },
  questions: [{
    question: { type: String },
    options: [String],
    answer: { type: String },
  }],
  essayQuestions: [String],
  subject: { type: String, required: true },
  year: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Item = mongoose.model('Item', itemSchema);

export default Item;
