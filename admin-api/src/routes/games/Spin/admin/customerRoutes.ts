import express from 'express';
import {
  getCustomerList,
  deleteCustomerHandler,
  customerLogs,
  deleteAllCustomerHandler,
} from '../../../../controllers/Spin/admin/customer';
import { aclCheck } from '../../../../middlewares';
import { validateRequest } from '../../../../middlewares/validateRequest';

const router = express.Router();
router.post('/', aclCheck('spin_customer_logs', 'view'),validateRequest, getCustomerList);
router.delete('/:id', aclCheck('spin_customer_logs', 'delete'),validateRequest, deleteCustomerHandler);
router.post('/export', customerLogs);
router.post('/delete', aclCheck('spin_customer_logs', 'delete'),validateRequest, deleteAllCustomerHandler);

export default router;
