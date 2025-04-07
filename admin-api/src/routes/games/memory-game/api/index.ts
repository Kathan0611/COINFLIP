import { Router } from 'express';
import memoryGameRoutes from './memoryGameRoutes';

const router = Router();

router.use('/', memoryGameRoutes);

export default router;
