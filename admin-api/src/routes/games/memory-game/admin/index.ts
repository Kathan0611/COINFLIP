import { Router } from 'express';
import { authJwt } from '../../../../middlewares';
import memoryGameRoutes from './memoryGameRoutes';

const router = Router();

router.use('/', authJwt, memoryGameRoutes);

export default router;
