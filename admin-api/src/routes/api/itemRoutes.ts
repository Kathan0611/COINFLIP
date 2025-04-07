import express from 'express';
import {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
} from '../../controllers/api/itemController';

const router = express.Router();

router.post('/', createItem);
router.get('/', getItems);
router.get('/:id', getItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;
