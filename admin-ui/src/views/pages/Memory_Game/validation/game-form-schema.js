import * as yup from 'yup'

export const gameConfigSchema = yup.object().shape({
  game_time: yup
    .number()
    .typeError('Game time must be a number')
    .positive('Game time must be greater than zero')
    .integer('Game time must be a whole number.')
    .required('Game time is required'),

  total_cards: yup
    .number()
    .typeError('Total cards must be a number')
    .positive('Total cards must be a positive number.')
    .integer('Total cards must be a whole number.')
    .test('is-multiple-of-2', 'Total cards must be a multiple of 2.', (value) => value % 2 === 0)
    .required('Total cards is required')
    .max(24, 'Total cards must be at most 24'),

  daily_limit: yup
    .number()
    .typeError('Daily limit must be a number')
    .positive('Daily limit must be a positive integer.')
    .integer('Daily limit must be a whole number.')
    .test(
      'is-positive-integer',
      'Daily limit must be a positive integer without leading zeros.',
      (value) => /^[1-9]\d*$/.test(value),
    )
    .required('Daily limit is required'),

  // background_image is optional (or can be uncommented if required)
  // background_image: yup.mixed(),

  card_cover_image: yup.mixed().required('(Required)'),
  // .test('fileRequired', 'Card cover image is required', (value) => !!value),

  card_front_images: yup
    .array()
    .of(
      yup
        .mixed()
        .required('(Required)')
        .test('fileRequired', 'Card front image is required', (value) => !!value),
    )
    .required('Card front images are required')
    .test(
      'half-of-total',
      'The number of card front images must be exactly half of total cards',
      function (value) {
        const { total_cards } = this.parent
        if (!total_cards || total_cards <= 0) return true
        return value && value.length === total_cards / 2
      },
    ),

  rewards: yup
    .object({
      grandmaster: yup.string().required('Grandmaster reward is required'),
      expert: yup.string().required('Expert reward is required'),
      skilled: yup.string().required('Skilled reward is required'),
      beginner: yup.string().required('Beginner reward is required'),
      novice: yup.string().required('Novice reward is required'),
      better_luck_next_time: yup.string().required('Better luck next time reward is required'),
    })
    .required('Rewards are required'),
})
