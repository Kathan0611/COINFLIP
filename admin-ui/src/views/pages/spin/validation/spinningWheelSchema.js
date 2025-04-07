import * as yup from 'yup'

export const validationSchema = yup.object().shape({
  rewards: yup
    .array()
    .of(
      yup
        .string()
        .required('Reward name is required')
        .max(150, 'Rewards name can be a maximum of 150 characters.'),
    )
    .required(),
  images: yup.array().of(yup.string().required('Please select image')).required(),
  prizeLimit: yup
    .array()
    .of(
      yup
        .number()
        .typeError('Prize limit must be a number')
        .min(1, 'Prize limit must be at least 1')
        .required('Prize limit is required'),
    )
    .required(),
  colors: yup
    .array()
    .of(
      yup
        .string()

        .required('Color is required'),
    )
    .required(),
  totalPrizeLimit: yup
    .number()
    .typeError('Prize limit must be a number')

    .required('Total Prize Limit is required'),
})
