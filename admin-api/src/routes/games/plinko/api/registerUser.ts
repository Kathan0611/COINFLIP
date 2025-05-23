import express from 'express';
import {registerUserController} from '../../../../controllers/plinko/api/registerUserController';

const router = express.Router();

router.post('/register', registerUserController);

export default router;
