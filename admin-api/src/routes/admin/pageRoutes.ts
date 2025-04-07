import { Router } from 'express';
import {
  pageCreate,
  pageDelete,
  pageDetails,
  pageList,
  pageStatusUpdate,
  pageUpdate,
} from '../../controllers/admin/pageController';
import { aclCheck } from '../../middlewares';
import { validateRequest } from '../../middlewares/validateRequest';
import { createPageValidation, statusUpdateValidation } from '../../validators/admin/page/pageValidation';

const router = Router();

router.get('/', pageList);
router.get('/:id', aclCheck('cms_pages', 'view'), pageDetails);
router.delete('/:id', aclCheck('cms_pages', 'delete'), pageDelete);
router.post('/', aclCheck('cms_pages', 'create'), createPageValidation, validateRequest, pageCreate);
router.post('/index', aclCheck('cms_pages', 'view'), pageList);
router.put('/:id', aclCheck('cms_pages', 'edit'), createPageValidation, validateRequest, pageUpdate);
router.patch('/:id', aclCheck('cms_pages', 'edit'), statusUpdateValidation, validateRequest, pageStatusUpdate);

export default router;
