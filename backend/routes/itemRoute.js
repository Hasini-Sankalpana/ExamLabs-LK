import express from 'express';
import multer from 'multer';
import { createItem, getItems, deleteItem, getRecentPdfs, getItemById, updateItem } from '../controllers/itemController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.post('/', upload.fields([{ name: 'file' }, { name: 'markingSchemeFile' }]), createItem);
router.put('/:id', upload.fields([{ name: 'file' }, { name: 'markingSchemeFile' }]), updateItem);
router.get('/', getItems);
router.delete('/:id', deleteItem);
router.get('/recent-pdfs', getRecentPdfs);
router.get('/:id', getItemById);


export default router;
