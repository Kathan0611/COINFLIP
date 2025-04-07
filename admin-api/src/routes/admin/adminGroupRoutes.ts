import { Router } from 'express';
import {
  adminGroupDetail,
  adminGroupList,
  create,
  deleteAdminGroup,
  paginationList,
  statusUpdate,
  update,
} from '../../controllers/admin/adminGroupController';
import { aclCheck } from '../../middlewares';
import { validateRequest } from '../../middlewares/validateRequest';
import { createValidation, updateValidation } from '../../validators/admin/adminGroup/createValidation';

const router = Router();

router.get('/', adminGroupList);
router.get('/:id', aclCheck('admin_groups', 'view'), adminGroupDetail);
router.delete('/:id', aclCheck('admin_groups', 'delete'), deleteAdminGroup);
router.post('/', aclCheck('admin_groups', 'create'), createValidation, validateRequest, create);
router.post('/list', aclCheck('admin_groups', 'view'), paginationList);
router.put('/:id', aclCheck('admin_groups', 'update'), createValidation, validateRequest, update);
router.patch('/:id', aclCheck('admin_groups', 'update'), updateValidation, validateRequest, statusUpdate);

export default router;
