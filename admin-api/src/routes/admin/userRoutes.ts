import { Router } from 'express';
import { profile } from '../../controllers/admin/adminController';
import { updateProfile } from '../../controllers/admin/userController';
import { validateRequest } from '../../middlewares/validateRequest';
import { updateProfileValidation } from '../../validators/admin/user/userValidation';

const router = Router();

router.get('/profile', profile);
router.post('/profile', updateProfileValidation, validateRequest, updateProfile);

export default router;
