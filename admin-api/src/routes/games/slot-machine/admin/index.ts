import { Router } from 'express';
import slotAdminRoutes from './slotAdminRoutes';

const router = Router();

router.use('/', slotAdminRoutes);

export default router;