import express from 'express';
import {rewardUserController} from '../../../../controllers/plinko/api/rewardUserController';

const router = express.Router();

router.post('/reward', rewardUserController);

export default router;