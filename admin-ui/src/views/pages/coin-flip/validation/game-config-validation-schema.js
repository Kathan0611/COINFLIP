import * as yup from 'yup'

//validationSchema of Admin
export const AdminConfigValidationSchema = yup.object().shape({
  head_image: yup
    .mixed()
    .nullable()
    .test('fileRequired', 'Head image is required', (value) => {
      return value instanceof File || (typeof value === 'string' && value.length > 0)
    }),
  tail_image: yup
    .mixed()
    .nullable()
    .test('fileRequired', 'Tail image is required', (value) => {
      return value instanceof File || (typeof value === 'string' && value.length > 0)
    }),
  special_days: yup
    .array()
    .of(
      yup.object().shape({
        start_date: yup
          .string()
          .required('Start date is required')
          .test('isValidDate', 'Invalid date format', (value) => !isNaN(Date.parse(value))),
        end_date: yup
          .string()
          .required('End date is required')
          .test('isValidDate', 'Invalid date format', (value) => !isNaN(Date.parse(value)))
          .test('isAfterStart', 'End date must be after start date', function (value) {
            return new Date(value) > new Date(this.parent.start_date)
          }),
        daily_limit: yup
          .string()
          .required('daily_limit is required')
          .min(0, 'daily_limit must be 0 or greater'),
        price: yup.string().min(0, 'Prize must be 0 or greater').required('Prize is required'),
      }),
    )
    .default([]),
  prices: yup
    .array()
    .of(
      yup.object().shape({
        price: yup.string().min(0, 'Prize must be string').required('Prize is required'),
        limit: yup.string().min(0, 'limit must  not empty').required('limit is required'),
      }),
    )
    .default([]),
})
