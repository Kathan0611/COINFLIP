import * as yup from 'yup'

export const createAdminSchema = yup.object().shape({
  name: yup.string().required('Name is required').max(255, 'Email must not exceed 255 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format')
    .max(255, 'Email must not exceed 255 characters'),
  admin_group_id: yup.number().required('Please select one group.'),
  status: yup.boolean(false),
})
