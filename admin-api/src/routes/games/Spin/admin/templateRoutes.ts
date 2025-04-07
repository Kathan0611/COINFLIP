import express from 'express';
import { getTemplates, updatedTemplates, getConfig } from '../../../../controllers/Spin/admin/templateController';
import { multiFileUpload } from '../../../../middlewares/fileUpload';
import { aclCheck } from '../../../../middlewares';
import { createValidation } from '../../../../validators/Spin/admin/createValidation';
const router = express.Router();

router.get('/template', aclCheck('spin_config', 'view'),getTemplates); // done
router.get('/template/:templateid',aclCheck('spin_config', 'view'), getConfig);
router.put('/template/:templateid',aclCheck('spin_config', 'update'),multiFileUpload.any(), createValidation,  updatedTemplates);

export default router;
