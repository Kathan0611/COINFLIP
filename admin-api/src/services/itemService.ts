//src/services/itemService.ts
import Item from '../models/itemModel';

export const createItem = async (itemData: any) => {
  const item = await Item.create(itemData);
  return item;
};

export const getItems = async () => {
  const items = await Item.findAll();
  return items;
};

export const getItem = async (id: string) => {
  const item = await Item.findByPk(id);
  return item;
};

export const updateItem = async (id: string, itemData: any) => {
  const [updated] = await Item.update(itemData, { where: { id } });
  if (updated) {
    const updatedItem = await Item.findByPk(id);
    return updatedItem;
  }
  throw new Error('Item not found');
};

export const deleteItem = async (id: string) => {
  const deleted = await Item.destroy({ where: { id } });
  if (deleted) {
    return 'Item deleted';
  }
  throw new Error('Item not found');
};
