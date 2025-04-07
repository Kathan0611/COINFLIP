import * as yup from 'yup'

export const updateProfileSchema = yup.object().shape({
  name: yup.string().required('Name is required').max(255, 'Email must not exceed 255 characters'),
  password: yup.string().optional(),
  confirmPassword: yup
    .string()
    .optional()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
})
