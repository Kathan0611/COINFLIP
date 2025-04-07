import { Router } from 'express';
import { aclCheck, authJwt } from '../../../../middlewares';
import { listingGameUserLogs } from '../../../../controllers/plinko/admin/gameUserListingController';
import { deleteGameUserLogController, deleteMultipleUserLogs } from '../../../../controllers/plinko/admin/deleteGameUserLogController';
import {
  getGameConfigController,
  setGameConfigController,
} from '../../../../controllers/plinko/admin/gameConfigController';
import { exportPlinkoGameUserController, getAllUserController } from '../../../../controllers/plinko/admin/getAllUserController';
import { validateRequest } from '../../../../middlewares/validateRequest';

const router = Router();

//routes for admin configuration
router.post('/config', aclCheck('plinko_config', 'update'), validateRequest, setGameConfigController);
router.get('/config', aclCheck('plinko_config', 'view'), validateRequest, getGameConfigController);
router.get('/user-logs', aclCheck('plinko_logs', 'view'), validateRequest, getAllUserController);
router.post('/user-logs', aclCheck('plinko_logs', 'view'), validateRequest, listingGameUserLogs);
router.delete('/user-logs/:id', aclCheck('plinko_logs', 'delete'), validateRequest, deleteGameUserLogController);
router.post('/user-logs/delete', aclCheck('plinko_logs', 'delete'), validateRequest, deleteMultipleUserLogs);
router.post('/user-logs/export', aclCheck('plinko_logs', 'view'), validateRequest,exportPlinkoGameUserController );

export default router;
