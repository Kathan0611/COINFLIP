import { Router } from 'express';
import { listSpin, updateAllSpinRecords } from '../../../../controllers/Spin/admin/spinController';
import { updateValidation } from '../../../../validators/admin/admin';

const router = Router();

router.post('/', listSpin);

router.put('/', updateValidation, updateAllSpinRecords);

export default router;
