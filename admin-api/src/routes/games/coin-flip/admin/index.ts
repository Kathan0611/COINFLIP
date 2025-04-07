import { Router } from 'express';
import FlipAdminRoutes from './CoinFlipAdminRoute';

const router = Router();

router.use('/', FlipAdminRoutes);

export default router;