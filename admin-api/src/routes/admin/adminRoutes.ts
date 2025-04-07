import { Router } from 'express';
import {
  listingAdmin,
  create,
  profile,
  update,
  view,
  changeStatus,
  deleteAdmin,
} from '../../controllers/admin/adminController';
import { aclCheck, authJwt } from '../../middlewares';
import { validateRequest } from '../../middlewares/validateRequest';
import { createValidation, updateValidation } from '../../validators/admin/admin';

const router = Router();

router.post('/listing', aclCheck('admins', 'view'), listingAdmin);
router.post('/create', aclCheck('admins', 'create'), createValidation, validateRequest, create);
router.get('/view/:id', aclCheck('admins', 'view'), view);
router.post('/update/:id', aclCheck('admins', 'update'), updateValidation, validateRequest, update);
router.get('/profile', aclCheck('admins', 'view'), profile);
router.post('/change-status/:id', aclCheck('admins', 'update'), changeStatus);
router.delete('/delete/:id', aclCheck('admins', 'delete'), deleteAdmin);

export default router;
