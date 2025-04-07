// src/routes/admin/slotRoutes.ts
import { Router } from 'express';
import { getConfig, createConfig } from '../../../../controllers/slot-machine/admin/slotConfigController';
import { createValidation } from '../../../../validators/slot-machine/admin/admin/slot';
import { validateRequest } from '../../../../middlewares/validateRequest';
import { aclCheck } from '../../../../middlewares';
import { uploadGameImages } from '../../../../middlewares/slot-machine/uploadGameImages';
import { getUserLoggs, deleteUserLoggs, deleteMultipleUserLogs, exportSlotController } from '../../../../controllers/slot-machine/admin/userloggsController';
import { getUserLoggsValidation, deleteUserLoggsValidation } from '../../../../validators/slot-machine/admin/admin/slot';

const router = Router();

router.get('/config', 
  aclCheck('slotmachine_config', 'view'), 
  getConfig
);

router.post('/config',
  aclCheck('slotmachine_config', 'update'),
  uploadGameImages,
  createValidation, 
  validateRequest, 
  createConfig
);

router.post(
  '/user-logs',
  aclCheck('slotmachine_logs', 'view'),
  getUserLoggsValidation,
  validateRequest,
  getUserLoggs
);

router.delete(
  '/user-logs/:id',
  aclCheck('slotmachine_logs', 'delete'),
  deleteUserLoggsValidation,
  validateRequest,
  deleteUserLoggs
);
router.post('/user-logs/delete', aclCheck('slotmachine_logs', 'delete'), validateRequest, deleteMultipleUserLogs);
router.post('/user-logs/export', aclCheck('slotmachine_logs', 'export'), validateRequest, exportSlotController);

export default router;