import { Router } from 'express';
import slotApiRoutes from './slotApiRoutes';

const router = Router();

router.use('/', slotApiRoutes);

export default router;