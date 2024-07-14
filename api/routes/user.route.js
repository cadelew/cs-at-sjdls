import express from 'express';
import { test } from '../controllers/user.contoller.js';

const router = express.Router();

router.get('/', test)

export default router;