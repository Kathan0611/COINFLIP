import { Router } from 'express';
import CoinApiRoutes from './gameRoutes';

const router = Router();

router.use('/', CoinApiRoutes);

export default router;