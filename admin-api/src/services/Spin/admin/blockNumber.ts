import BlockCustomers from '../../../models/Spin/admin/blockCustomer';

export const blockNumber = async (mobile_numbers: string[]) => {
  const formattedNumbers = mobile_numbers.map(number => number.trim());

  let blockedCustomer = await BlockCustomers.findOne();

  if (blockedCustomer) {
    const existingNumbers = blockedCustomer.mobile_number.split(',').map(number => number.trim());
    const updatedNumbers = existingNumbers.filter(number => formattedNumbers.includes(number));

    formattedNumbers.forEach(number => {
      if (!updatedNumbers.includes(number)) {
        updatedNumbers.push(number);
      }
    });

    blockedCustomer.mobile_number = updatedNumbers.join(',');
    await blockedCustomer.save();
  } else {
    blockedCustomer = await BlockCustomers.create({ mobile_number: formattedNumbers.join(',') } as any);
  }

  return blockedCustomer;
};

export const getBlockedNumbers = async () => {
  const blockedNumbers = await BlockCustomers.findOne({
    attributes: ['id', 'mobile_number', 'createdAt'],
    raw: true,
  });
  return blockedNumbers;
};
