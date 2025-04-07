import SpinModel from '../../../models/Spin/admin/Spin';

export const getSpinData = async () => {
  try {
    const spin = await SpinModel.findAll();
    if (!spin) {
      throw new Error('Spin not found');
    }
    return spin;
  } catch (err: any) {
    throw new Error(`Error fetching spin by name: ${err.message}`);
  }
};

export const updateSpinData = async (id: number, updatedData: any) => {
  try {
    const [affectedRows] = await SpinModel.update(updatedData, {
      where: { id },
    });

    if (affectedRows === 0) {
      throw new Error('No records updated');
    }
    const updatedSpin = await SpinModel.findByPk(id);

    return updatedSpin;
  } catch (error: any) {
    throw new Error(`Error updating spin data: ${error.message}`);
  }
};
