import { Router } from 'express';
import prizeRoutes from './prizeRoutes';
import customerRoutes from './customerRoutes';

const router = Router();

router.use('/', prizeRoutes);
router.use('/customer', customerRoutes);

export default router;
