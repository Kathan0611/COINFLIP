import * as yup from 'yup'

export const slotValidationSchema = yup.object().shape({
  slotCount: yup
    .number()
    .typeError('Slot count must be a number')
    .min(1, 'Slot count must be at least 1')
    .max(5, 'Slot count cannot be more than 5')
    .required('Slot count is required'),

  numImages: yup
    .number()
    .typeError('Number of images must be a number')
    .min(3, 'Number of images must be at least 3')
    .max(10, 'Number of images cannot be more than 10')
    .required('Number of images is required'),

  spinLimit: yup
    .number()
    .typeError('Spin limit must be a number')
    .min(1, 'Spin limit must be at least 1')
    .required('Spin limit is required'),

  totalPrizeLimit: yup
    .number()
    .typeError('Total prize limit must be a number')
    .min(1, 'Total prize limit must be at least 1')
    .required('Total prize limit is required'),

  images: yup
    .array()
    .of(
      yup.object().shape({
        src: yup.string(),
        file: yup
          .mixed()
          .nullable()
          .test('fileType', 'Only PNG, JPEG, JPG, and GIF files are allowed', (value) => {
            if (!value) return true
            return ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'].includes(value.type)
          })
          .test('fileSize', 'File size must be less than 500KB', (value) => {
            if (!value) return true
            return value.size <= 500 * 1024
          }),
      }),
    )
    .min(1, 'At least one image is required')
    .required('Images are required'),

  combinations: yup
    .array()
    .of(
      yup.object().shape({
        combination: yup.string().required('Combination is required'),
        prizes: yup
          .array()
          .of(
            yup.object().shape({
              name: yup.string().required('Prize name is required'),
              prize_limit: yup
                .number()
                .typeError('Daily limit must be a number')
                .min(0, 'Daily limit cannot be less than 0')
                .required('Daily limit is required'),
            }),
          )
          .required('At least one prize is required'),
      }),
    )
    // Root-level test for validating each combination against slotCount and numImages
    .test('combinations-valid', function (combinations) {
      const { slotCount, numImages } = this.parent

      // Skip test if slotCount or numImages is not set (or falsy)
      if (!slotCount || !numImages) return true

      for (let i = 0; i < combinations.length; i++) {
        const { combination } = combinations[i]
        // Check the combination's length
        if (!combination || combination.length !== Number(slotCount)) {
          return this.createError({
            path: `combinations[${i}].combination`,
            message: `Combination must be exactly ${slotCount} digit(s) long`,
          })
        }
        // Check each digit in the combination
        for (let j = 0; j < combination.length; j++) {
          const digit = parseInt(combination[j], 10)
          // Ensure digit is a valid number and between 1 and numImages
          if (isNaN(digit) || digit < 1 || digit > Number(numImages)) {
            return this.createError({
              path: `combinations[${i}].combination`,
              message: `Each digit must be between 1 and ${numImages}`,
            })
          }
        }
      }
      return true
    }),
})
