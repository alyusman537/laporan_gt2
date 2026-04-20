import express from 'express';
import { authenticate, role } from '../middleware/authMiddleware.js'
import { userController } from '../controllers/userController.js';

export const router = express.Router();

router.get("/users", userController.all);
router.get("/users/:id", userController.byId)