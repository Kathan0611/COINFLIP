import * as yup from 'yup'

const baseSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format')
    .max(255, 'Email must not exceed 255 characters'),
  password: yup.string().required('Password is required'),
  // .min(8, 'Password must be at least 8 characters')
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  // ),
})

export const resetPasswordSchema = yup.object().shape({
  password: yup.string().required('Password is required'),
  // .min(8, 'Password must be at least 8 characters')
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  // ),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
})

export const loginSchema = baseSchema

export const forgotPasswordSchema = baseSchema.pick(['email'])
