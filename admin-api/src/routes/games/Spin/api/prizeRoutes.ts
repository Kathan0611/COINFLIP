import express from 'express';
import { getSelectedTemplate } from '../../../../controllers/Spin/admin/templateController';
import { tokenMiddleware } from '../../../../middlewares/Spin/loginStoreToken';

const router = express.Router();

router.get('/spin-config', getSelectedTemplate);

export default router;
