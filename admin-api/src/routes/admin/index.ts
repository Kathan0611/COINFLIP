//src/routes/admin/index.ts
import { Router } from 'express';
import { authJwt } from '../../middlewares';
import adminGroupRoutes from './adminGroupRoutes';
import adminRoutes from './adminRoutes';
import authRoutes from './authRoutes';
import mediaRoutes from './mediaRoutes';
import pageRoutes from './pageRoutes';
import systemModuleRoute from './systemModuleRoute';
import userRoutes from './userRoutes';
const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', authJwt, adminRoutes);
router.use('/admin-group', authJwt, adminGroupRoutes);
router.use('/system-modules', authJwt, systemModuleRoute);
router.use('/page', authJwt, pageRoutes);
router.use('/media', authJwt, mediaRoutes);
router.use('/', authJwt, userRoutes);

export default router;
