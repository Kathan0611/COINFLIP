// src/routes/api/index.ts
import { Router } from 'express';
import itemRoutes from './itemRoutes';

const router = Router();

router.use('/items', itemRoutes);


export default router;