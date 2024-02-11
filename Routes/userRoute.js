import express from 'express';
import {getUserById, userLogin, userRegister } from '../Controllers/userController.js';

const router = express.Router();

// Public routes
router.post('/register', userRegister);
router.post('/login', userLogin);
router.get('/:id', getUserById);

export default router;