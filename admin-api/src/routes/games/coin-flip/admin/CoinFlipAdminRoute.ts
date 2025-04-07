import { Router } from 'express';
import {
  createOrUpdateCoinFlipHandler,
  getCoinFlipHandler,
} from '../../../../controllers/coin-flip/admin/CoinFlipController';
import { aclCheck } from '../../../../middlewares';
import { validateRequest } from '../../../../middlewares/validateRequest';
import { deleteMultipleUserLogs, deleteUserLog, exportCoinFlipLogsController, listingUserLogs } from '../../../../controllers/coin-flip/admin/userLogsController';
import { multiFileUpload } from '../../../../middlewares/fileUpload';
import { coinFlipcreateValidation } from '../../../../validators/coin-flip/admin/createValidation';

const router = Router();

//@post admin game config create route
router.post(
  '/config',
  aclCheck('coin_flip_config', 'update'),
  multiFileUpload.fields([{ name: 'head_image' }, { name: 'tail_image' }]),
  coinFlipcreateValidation,
  validateRequest,
  createOrUpdateCoinFlipHandler,
);

//@get admin config get route
router.get('/config', aclCheck('coin_flip_config', 'view'), getCoinFlipHandler);

//@post user listing api route
router.post('/user-logs', aclCheck('coin_flip_logs', 'view'),validateRequest, listingUserLogs);

//@delete user_list delete route
router.delete('/user-logs/:id', aclCheck('coin_flip_logs', 'delete'), deleteUserLog);
router.post('/user-logs/delete', aclCheck('coin_flip_logs', 'delete'), validateRequest, deleteMultipleUserLogs);
router.post('/user-logs/export', aclCheck('coin_flip_logs', 'view'), validateRequest, exportCoinFlipLogsController);

export default router;
