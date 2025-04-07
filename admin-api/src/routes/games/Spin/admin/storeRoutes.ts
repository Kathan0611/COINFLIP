import { Router } from 'express';
import {
  createStoreHandler,
  getAllStoreList,
  getStoreDetail,
  updateStoreHandler,
  updateStoreStatusHandler,
  deleteStoreHandler,
  deleteAllStoreHandler,
  deleteAllRewards,
} from '../../../../controllers/Spin/admin/storeController';
import { validateRequest } from '../../../../middlewares/validateRequest';
import { aclCheck } from '../../../../middlewares';
import { createValidation } from '../../../../validators/Spin/admin';
import { updateValidation } from '../../../../validators/admin/admin';

const router = Router();

router.post('/', aclCheck('store', 'create'), createValidation, validateRequest, createStoreHandler);
router.post('/list', aclCheck('store', 'view'), getAllStoreList);
router.post('/:id/update-status', aclCheck('store', 'update'), validateRequest, updateStoreStatusHandler);
router.get('/:id', aclCheck('store', 'view'), validateRequest, getStoreDetail);
router.delete('/:id', aclCheck('store', 'delete'), deleteStoreHandler);
router.put('/:id', aclCheck('store', 'update'), updateValidation, validateRequest, updateStoreHandler);
router.post('/delete', aclCheck('store', 'delete'), deleteAllStoreHandler);
router.post('/reset-rewards', aclCheck('store', 'spin_config'), deleteAllRewards);

export default router;
