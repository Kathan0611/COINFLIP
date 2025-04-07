import express from 'express';
import { blockCustomer, blockNumberList } from '../../../../controllers/Spin/admin/blockNumber';
import { aclCheck } from '../../../../middlewares';

const router = express.Router();
router.post('/', aclCheck('blocked_customers', 'create'), blockCustomer);
router.get('/', aclCheck('blocked_customers', 'view'), blockNumberList);

export default router;
