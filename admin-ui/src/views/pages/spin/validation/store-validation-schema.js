import * as yup from 'yup'

export const createStoreSchema = yup.object().shape({
  store_name: yup
    .string()
    .required('Store name is required')
    .max(255, 'Name must not exceed 255 characters')
    .trim(),

  store_owner: yup
    .string()
    .required('Owner name is required')
    .max(255, 'Owner name must not exceed 255 characters')
    .trim(),

  location: yup
    .string()
    .required('Location is required')
    .max(255, 'Location must not exceed 255 characters')
    .trim(),

  mobile: yup
    .string()
    .required('Mobile no is required')
    .max(10, 'Mobile no must not exceed 10 numbers')
    .min(10, 'Mobile no must not exceed 10')
    .matches(/^\d{10}$/, 'Mobile no must contain only numbers.'),

  min_spend_amount: yup
    .string()
    .required('Min spend amount is required'),

  status: yup.boolean(false),
})
