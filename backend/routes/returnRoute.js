// routes/returnRoute.js
import express from 'express';
import { 
  createReturn, 
  getUserReturns, 
  getReturnById, 
  getAllReturns, 
  updateReturnStatus, 
  deleteReturn 
} from '../controllers/returnController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const returnRouter = express.Router();

// ✅ Ensure ReturnProof directory exists
const returnProofDir = path.join(process.cwd(), 'Images', 'ReturnProof');
if (!fs.existsSync(returnProofDir)) {
  fs.mkdirSync(returnProofDir, { recursive: true });
}

// ✅ Multer configuration for local storage (same as product images)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, returnProofDir);
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    callback(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// User Routes
returnRouter.post('/create', authUser, upload.array('proofImages', 5), createReturn);
returnRouter.post('/user-returns', authUser, getUserReturns);
returnRouter.get('/:id', authUser, getReturnById);

// Admin Routes
returnRouter.post('/all', adminAuth, getAllReturns);
returnRouter.post('/update-status', adminAuth, updateReturnStatus);
returnRouter.delete('/:id', adminAuth, deleteReturn);

export default returnRouter;
