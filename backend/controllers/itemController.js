import Item from '../models/itemModel.js';
import Favorite from '../models/favoriteModel.js'; 
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createItem = async (req, res) => {
  const { name, description, option, questions, essayQuestions, subject, year } = req.body;
  const file = req.files?.file?.[0]?.path || null; // Change to handle multiple files
  const markingSchemeFile = req.files?.markingSchemeFile?.[0]?.path || null; // New field for marking scheme file

  try {
    const item = new Item({
      name,
      description,
      option,
      subject,
      year,
      file,
      markingSchemeFile, // Save marking scheme file path
      questions: option === 'mcq' ? JSON.parse(questions) : [],
      essayQuestions: option === 'essay' ? JSON.parse(essayQuestions) : [],
    });

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const option = req.query.option;
    const subject = req.query.subject;
    const year = req.query.year;
    let items;
    if (option || subject || year) {
      items = await Item.find({
        ...(option && { option }),
        ...(subject && { subject }),
        ...(year && { year }),
      });
    } else {
      items = await Item.find();
    }
    
    res.status(200).json(items);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Delete associated file if it exists
    if (item.file) {
      try {
        fs.unlinkSync(path.join(__dirname, '..', item.file));
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
        return res.status(500).json({ message: 'Error deleting associated file' });
      }
    }

    // Delete associated marking scheme file if it exists
    if (item.markingSchemeFile) {
      try {
        fs.unlinkSync(path.join(__dirname, '..', item.markingSchemeFile));
      } catch (markingSchemeFileError) {
        console.error('Error deleting marking scheme file:', markingSchemeFileError);
        return res.status(500).json({ message: 'Error deleting associated marking scheme file' });
      }
    }

    // Remove associated favorites
    try {
      await Favorite.deleteMany({ paperId: id });
    } catch (favoriteError) {
      console.error('Error deleting associated favorites:', favoriteError);
      return res.status(500).json({ message: 'Error deleting associated favorites' });
    }

    res.status(200).json({ message: 'Item and associated files/favorites deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRecentPdfs = async (req, res) => {
  try {
    const recentPdfs = await Item.find({ option: 'pdf' })
                                 .sort({ createdAt: -1 })
                                 .limit(5);
    res.json(recentPdfs);
  } catch (error) {
    console.error('Error fetching recent PDFs:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, option, questions, essayQuestions, subject, year } = req.body;
  const file = req.files?.file?.[0]?.path || null;
  const markingSchemeFile = req.files?.markingSchemeFile?.[0]?.path || null;

  try {
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.name = name || item.name;
    item.description = description || item.description;
    item.option = option || item.option;
    item.subject = subject || item.subject;
    item.year = year || item.year;

    if (file) {
      // Delete old file if exists
      if (item.file) {
        try {
          fs.unlinkSync(path.join(__dirname, '..', item.file));
        } catch (fileError) {
          console.error('Error deleting file:', fileError);
        }
      }
      item.file = file;
    }

    if (markingSchemeFile) {
      // Delete old marking scheme file if exists
      if (item.markingSchemeFile) {
        try {
          fs.unlinkSync(path.join(__dirname, '..', item.markingSchemeFile));
        } catch (markingSchemeFileError) {
          console.error('Error deleting marking scheme file:', markingSchemeFileError);
        }
      }
      item.markingSchemeFile = markingSchemeFile;
    }

    item.questions = option === 'mcq' ? JSON.parse(questions) : item.questions;
    item.essayQuestions = option === 'essay' ? JSON.parse(essayQuestions) : item.essayQuestions;

    await item.save();

    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};