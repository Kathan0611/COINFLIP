import { Router } from 'express';
import { systemModuleList } from '../../controllers/admin/systemModuleController';

const router = Router();

router.get('/', systemModuleList);

export default router;