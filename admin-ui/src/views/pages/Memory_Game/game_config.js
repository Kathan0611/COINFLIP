import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
} from '@coreui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect, useState, useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { adminSetMemoryGameConfig, adminGetMemoryGameConfig } from '../../../helpers/apiRequest'
import { gameConfigSchema } from './validation/game-form-schema'
import { IoClose } from 'react-icons/io5'
import { FaSave } from 'react-icons/fa'
import CustomButton from '../../../components/Button'
import { useCanAccess } from '../../../helpers/common-unitl'
import { ImageUploadCard } from './components/ImageuploadCard'
import { useDebounce } from '../../../hooks/use-debounce'
import ColorPicker from './components/ColorPicker' // Import the new ColorPicker
import './scss/styles.scss'
const mediaPath = import.meta.env.VITE_APP_MEDIA_PATH

const defaultGameTheme = {
  button_background_color: '#ffdd00',
  button_text_color: '#333333',
  text_color: '#ffcc00',
}

const GameConfigForm = () => {
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    getValues,
    trigger,
  } = useForm({
    resolver: yupResolver(gameConfigSchema),
    defaultValues: {
      game_time: '',
      total_cards: '',
      daily_limit: '',
      rewards: {
        grandmaster: '',
        expert: '',
        skilled: '',
        beginner: '',
        novice: '',
        better_luck_next_time: '',
      },
      game_theme: defaultGameTheme, // Ensure default theme is in form state
    },
  })

  // State to store the initial card front images (as URL strings)
  const [initialCardFrontImages, setInitialCardFrontImages] = useState([])

  const canAccess = useCanAccess()
  const canViewGameConfig = canAccess('memory_config', 'view')
  const totalCardsValue = watch('total_cards')

  // Fetch and populate game configuration.
  const fetchGameConfig = useCallback(async () => {
    try {
      const response = await adminGetMemoryGameConfig()
      const config = response.data?.data

      // Prepare default card front images as an array of URL strings.
      const defaultCardFrontImages = config?.card_front_images
        ? config.card_front_images.map((img) => `${mediaPath}/${img}`)
        : []

      // Set form values.
      setValue('card_front_images', defaultCardFrontImages)
      setInitialCardFrontImages(defaultCardFrontImages)
      setValue('game_time', config?.game_time || '')
      setValue('total_cards', config?.total_cards || '')
      setValue('daily_limit', config?.daily_limit || '')
      setValue(
        'background_image',
        config?.background_image ? `${mediaPath}/${config?.background_image}` : null,
      )
      setValue(
        'card_cover_image',
        config?.card_cover_image ? `${mediaPath}/${config?.card_cover_image}` : null,
      )
      setValue(
        'rewards',
        config?.rewards || {
          grandmaster: '',
          expert: '',
          skilled: '',
          beginner: '',
          novice: '',
          better_luck_next_time: '',
        },
      )
      // Set theme values with defaults if not provided.
      setValue('game_theme', config?.game_theme || defaultGameTheme)
    } catch (error) {
      console.error('Error fetching game configuration:', error)
      toast.error('Failed to load game configuration.')
    }
  }, [setValue])

  // Fetch config on component mount.
  useEffect(() => {
    fetchGameConfig()
  }, [fetchGameConfig])

  // Debounced handler for updating card front images when "Total Cards" changes.
  const debouncedHandleTotalCardsChange = useDebounce(async (value) => {
    if (value === '') return
    const newCount = parseInt(value, 10) || 0
    // Update total_cards in form state and trigger validation.
    setValue('total_cards', newCount)
    await trigger('total_cards')

    // Only process if even number.
    if (newCount % 2 !== 0) return

    const requiredImages = newCount / 2
    const currentImages = getValues('card_front_images') || []
    if (requiredImages > currentImages.length) {
      // Append additional (null) entries.
      const additional = Array.from({ length: requiredImages - currentImages.length }, () => null)
      setValue('card_front_images', [...currentImages, ...additional])
    } else if (requiredImages < currentImages.length) {
      // Trim the array.
      setValue('card_front_images', currentImages.slice(0, requiredImages))
    }
  }, 1500)

  // Helper: Convert an image URL to a File object.
  async function convertImageUrlToFile(url, filename) {
    const response = await fetch(url)
    const blob = await response.blob()
    const contentType = response.headers.get('content-type')
    const mimeType =
      contentType && contentType.length > 0
        ? contentType
        : blob.type && blob.type.length > 0
          ? blob.type
          : 'image/jpeg'
    return new File([blob], filename, { type: mimeType })
  }

  // Reset function to clear theme and background image.
  const onReset = () => {
    setValue('game_theme', defaultGameTheme)
    setValue('background_image', null)
  }

  const onSubmit = async (data) => {
    if (!canAccess('memory_config', 'update')) return

    if (Object.keys(data.game_theme).length === 0) {
      data.game_theme = defaultGameTheme
    }

    const formDataToSend = new FormData()
    formDataToSend.append('game_time', data.game_time)
    formDataToSend.append('total_cards', data.total_cards)
    formDataToSend.append('daily_limit', data.daily_limit)
    formDataToSend.append('rewards', JSON.stringify(data.rewards))
    // Append theme configuration as a JSON string.
    formDataToSend.append('game_theme', JSON.stringify(data.game_theme))

    // Handle background image removal flag.
    formDataToSend.append(
      'isBackgroundImageRemoved',
      data.background_image === null ? 'true' : 'false',
    )
    if (data.background_image && typeof data.background_image !== 'string') {
      formDataToSend.append('background_image', data.background_image)
    }
    if (data.card_cover_image && typeof data.card_cover_image !== 'string') {
      formDataToSend.append('card_cover_image', data.card_cover_image)
    }

    // Process each card front image: if it's a File, append it;
    // if it's a URL string, convert it and then append.
    const currentCardFrontImages = data.card_front_images || []
    for (let i = 0; i < currentCardFrontImages.length; i++) {
      const image = currentCardFrontImages[i]
      if (image instanceof File) {
        formDataToSend.append('card_front_images', image)
      } else if (typeof image === 'string' && image) {
        const file = await convertImageUrlToFile(image, `existing_card_${i}.jpg`)
        formDataToSend.append('card_front_images', file)
      }
    }

    try {
      const response = await adminSetMemoryGameConfig(formDataToSend)
      const msg = response?.data?.message || 'Game configuration saved successfully!'
      toast.success(msg)
      // Re-fetch config to update form values (including file inputs).
      await fetchGameConfig()
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to save game configuration. Please try again.')
    }
  }

  if (!canViewGameConfig) {
    return (
      <div>
        <h1>You do not have permission to access this page</h1>
      </div>
    )
  }
  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader className="font-bold font-16">Memory Game Configuration</CCardHeader>
          <CForm onSubmit={handleSubmit(onSubmit)}>
            <CCardBody>
              <CRow className="mb-3">
                <CCol md={4}>
                  <CFormLabel>Game Time (seconds)</CFormLabel>
                  <Controller
                    name="game_time"
                    control={control}
                    render={({ field }) => (
                      <CFormInput
                        type="text"
                        {...field}
                        disabled={!canAccess('memory_config', 'update')}
                      />
                    )}
                  />
                  {errors.game_time && <p className="text-danger">{errors.game_time.message}</p>}
                </CCol>
                <CCol md={4}>
                  <CFormLabel>Total Cards</CFormLabel>
                  <Controller
                    name="total_cards"
                    control={control}
                    render={({ field }) => (
                      <CFormInput
                        type="text"
                        {...field}
                        disabled={!canAccess('memory_config', 'update')}
                        onChange={(e) => {
                          field.onChange(e)
                          debouncedHandleTotalCardsChange(e.target.value)
                        }}
                      />
                    )}
                  />
                  {errors.total_cards && (
                    <p className="text-danger">{errors.total_cards.message}</p>
                  )}
                </CCol>
                <CCol md={4}>
                  <CFormLabel>Daily User Play Limit</CFormLabel>
                  <Controller
                    name="daily_limit"
                    control={control}
                    render={({ field }) => (
                      <CFormInput
                        type="text"
                        {...field}
                        disabled={!canAccess('memory_config', 'update')}
                      />
                    )}
                  />
                  {errors.daily_limit && (
                    <p className="text-danger">{errors.daily_limit.message}</p>
                  )}
                </CCol>
              </CRow>

              {/* Theme Section Header with Reset Button */}
              <CCardHeader className="mt-3 d-flex justify-content-between align-items-center">
                <span>Theme Section</span>
                <CustomButton
                  variant="cancel"
                  type="button"
                  onClick={onReset}
                  text="Reset"
                  disabled={!canAccess('memory_config', 'update')}
                  size="sm"
                />
              </CCardHeader>
              <CRow className="mb-3 mt-3">
                <CCol md={4}>
                  <CFormLabel>Button Background Color</CFormLabel>
                  <Controller
                    name="game_theme.button_background_color"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <ColorPicker
                        value={field.value || '#ffcc00'}
                        onChange={field.onChange}
                        error={error ? error.message : ''}
                        disabled={!canAccess('memory_config', 'update')}
                      />
                    )}
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel>Button Text Color</CFormLabel>
                  <Controller
                    name="game_theme.button_text_color"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <ColorPicker
                        value={field.value || '#333333'}
                        onChange={field.onChange}
                        error={error ? error.message : ''}
                        disabled={!canAccess('memory_config', 'update')}
                      />
                    )}
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel>Text Color</CFormLabel>
                  <Controller
                    name="game_theme.text_color"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <ColorPicker
                        value={field.value || '#ffcc00'}
                        onChange={field.onChange}
                        error={error ? error.message : ''}
                        disabled={!canAccess('memory_config', 'update')}
                      />
                    )}
                  />
                </CCol>
              </CRow>

              {/* Background & Card Cover Images */}
              <CRow className="mb-7">
                <CCol md={6}>
                  <CFormLabel>Background Image</CFormLabel>
                  <Controller
                    name="background_image"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <div className="position-relative">
                        <ImageUploadCard
                          name="background_image"
                          labelText="Background Image"
                          watch={watch}
                          error={error}
                          onChange={field.onChange}
                          disabled={!canAccess('memory_config', 'update')}
                        />
                      </div>
                    )}
                  />
                  {errors.background_image && (
                    <p className="text-danger">{errors.background_image.message}</p>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Card Cover Image</CFormLabel>
                  <Controller
                    name="card_cover_image"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <div className="position-relative">
                        <ImageUploadCard
                          name="card_cover_image"
                          labelText="Card Cover Image"
                          watch={watch}
                          error={error}
                          onChange={field.onChange}
                          disabled={!canAccess('memory_config', 'update')}
                        />
                      </div>
                    )}
                  />
                </CCol>
              </CRow>

              {/* Card Front Images */}
              <CRow className="mb-4">
                <CCol md={12}>
                  {/* Added top margin to create extra space from the above section */}
                  <CFormLabel className="mt-4 mb-1">Card Front Images</CFormLabel>
                  <div className="d-flex flex-wrap">
                    {Array.from({ length: Number(totalCardsValue) / 2 || 0 }).map((_, index) => (
                      <Controller
                        key={index}
                        name={`card_front_images.${index}`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <div className="position-relative m-2">
                            <ImageUploadCard
                              name={`card_front_images.${index}`}
                              labelText={`Card ${index + 1}`}
                              watch={watch}
                              error={error}
                              onChange={field.onChange}
                              disabled={!canAccess('memory_config', 'update')}
                            />
                          </div>
                        )}
                      />
                    ))}
                  </div>
                </CCol>
              </CRow>

              {/* Rewards Section */}
              <CCardHeader className="mt-3 mb-2">Rewards Section</CCardHeader>
              <CRow className="mb-3">
                {[
                  'grandmaster',
                  'expert',
                  'skilled',
                  'beginner',
                  'novice',
                  'better_luck_next_time',
                ].map((reward) => (
                  <CCol md={4} key={reward}>
                    <div className="mb-3">
                      <CFormLabel className="mb-1">
                        {reward.replace(/_/g, ' ').toUpperCase()}
                      </CFormLabel>
                      <Controller
                        name={`rewards.${reward}`}
                        control={control}
                        render={({ field }) => (
                          <CFormInput
                            {...field}
                            className="mt-2"
                            disabled={!canAccess('memory_config', 'update')}
                          />
                        )}
                      />
                      {errors?.rewards?.[reward] && (
                        <p className="text-danger">{errors.rewards[reward].message}</p>
                      )}
                    </div>
                  </CCol>
                ))}
              </CRow>
            </CCardBody>
            {canAccess('memory_config', 'update') && (
              <CCardFooter>
                <CustomButton
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                  className="mt-1 btn-sm"
                  text={isSubmitting ? 'Submitting...' : 'Submit'}
                  icon={<FaSave className="mb-1 mr-1" />}
                />
                &nbsp;
                {/* <Link to="/home">
                  <CustomButton
                    color="danger"
                    className="mt-1 btn-sm"
                    type="button"
                    text="Cancel"
                    disabled={isSubmitting}
                    icon={<IoClose className="mb-1 mr-1" size={'16px'} />}
                  />
                </Link> */}
              </CCardFooter>
            )}
          </CForm>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default GameConfigForm
