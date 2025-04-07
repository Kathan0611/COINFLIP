//src/controllers/api/itemController.ts
import { Request, Response } from 'express';
import * as ItemService from '../../services/itemService';

export const createItem = async (req: Request, res: Response) => {
  try {
    const newItem = await ItemService.createItem(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
};

export const getItems = async (req: Request, res: Response) => {
  try {
    const items = await ItemService.getItems();
    res.status(200).json(items);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const getItem = async (req: Request, res: Response) => {
  try {
    const item = await ItemService.getItem(req.params.id);
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const updatedItem = await ItemService.updateItem(req.params.id, req.body);
    if (updatedItem) {
      res.status(200).json(updatedItem);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const deletedItem = await ItemService.deleteItem(req.params.id);
    if (deletedItem) {
      res.status(200).json({ message: 'Item deleted' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};
