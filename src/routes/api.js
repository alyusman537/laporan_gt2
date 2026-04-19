import express from 'express';
import { authenticate, role } from '../middleware/authMiddleware.js'
export const router = express.Router();