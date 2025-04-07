import { Router } from 'express';
import templateRoutes from './templateRoutes';
import blockNumber from './blockNumber';
import customerRoutes from './customerRoutes';

const router = Router();

// router.use('/stores', storeRoutes);
router.use('/', templateRoutes);
router.use('/blocked', blockNumber);
router.use('/customer-logs', customerRoutes);

export default router;