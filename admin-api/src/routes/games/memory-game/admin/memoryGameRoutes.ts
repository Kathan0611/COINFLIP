import { Router } from 'express';
import { getGameConfig, setGameConfig } from '../../../../controllers/memory-game/admin/memoryGameController';
import { deleteMultipleUserLogs, deleteUserLog, exportMemoryGameUserLogsController, listingUserLogs } from '../../../../controllers/memory-game/admin/userLogsController';
import { aclCheck } from '../../../../middlewares';
import { uploadGameFields } from '../../../../middlewares/memory-game/gameFileUpload';
import { validateRequest } from '../../../../middlewares/validateRequest';
import { createValidation } from '../../../../validators/memory-game/admin/game/createValidation';
import { deleteLogsValidation } from '../../../../validators/memory-game/admin/game/deleteValidation';
import { deleteMultipleCustomer } from '../../../../services/admin/userLogsService';

const router = Router();

router.post(
  '/config',
  aclCheck('memory_config', 'update'),
  uploadGameFields,
  createValidation,
  validateRequest,
  setGameConfig,
);
router.get('/config', aclCheck('memory_config', 'view'), getGameConfig);
router.post('/user-logs', aclCheck('memory_logs', 'view'), listingUserLogs);
router.delete('/user-logs/:id', aclCheck('memory_logs', 'delete'), deleteLogsValidation, validateRequest, deleteUserLog);
router.post('/user-logs/delete', aclCheck('memory_logs', 'delete'), validateRequest, deleteMultipleUserLogs);
router.post('/user-logs/export', aclCheck('memory_logs', 'view'), validateRequest, exportMemoryGameUserLogsController);
export default router;
