import { CCard, CCardBody, CCardFooter, CCardHeader, CCol, CRow } from '@coreui/react'
import React, { useState, useEffect, useCallback } from 'react'
import { GrPowerReset } from 'react-icons/gr'
import { FaSave } from 'react-icons/fa'
import CustomButton from '../../../components/Button'
import FormInput from '../../../components/FormInput'
import { titleConstants } from '../../../constant/titleConstant'
import { slotValidationSchema } from './validation/admin-gameconfig-schema'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  admingetSlotMachineconfigcontent,
  adminsetSlotMachineconfig,
} from '../../../helpers/apiRequest'
import { useDebounce } from 'src/hooks/use-debounce'
import { populateImages } from './components/ImageHandle'
import ImageUploadCard from './components/ImageUploadCard'
import CombinationCard from './components/CombinationCard'
import { useCanAccess } from '../../../helpers/common-unitl'
import { showToastr } from '../../../components/ToastrNotification'
import { API_ENDPOINT } from '../../../helpers/apiRequest'
import './scss/styles.scss'

const Slot_Config_Form = () => {
  const [loading, setLoading] = useState(false)
  const [apiDataLoaded, setApiDataLoaded] = useState(false)
  const [manuallyUpdated, setManuallyUpdated] = useState(false)
  const [hasImageErrors, setHasImageErrors] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
    watch,
    setValue,
    trigger,
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(slotValidationSchema, { abortEarly: false }),
    defaultValues: {
      slotCount: '',
      numImages: '',
      spinLimit: '',
      totalPrizeLimit: '',
      backgroundImage: { file: null, src: '' },
      images: [],
      combinations: [{ combination: '', prizes: [{ name: '', prize_limit: '' }] }],
      theme_config: [{}],
    },
    mode: 'onChange',
  })

  const titleColor = useWatch({ control, name: 'theme_config.0.titleColor' })
  const reelBorder = useWatch({ control, name: 'theme_config.0.reelBorder' })
  const buttonBackgroundColor = useWatch({ control, name: 'theme_config.0.buttonBackgroundColor' })
  const buttonTextColor = useWatch({ control, name: 'theme_config.0.buttonTextColor' })

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({ control, name: 'images' })

  const {
    fields: combinationFields,
    append: appendCombination,
    remove: removeCombination,
  } = useFieldArray({ control, name: 'combinations' })

  const canAccess = useCanAccess()
  const canUpdate = canAccess('slotmachine_config', 'update')
  const canViewGameConfig = canAccess('slotmachine_config', 'view')

  const watchedImages = watch('images')
  const [imageErrorsMap, setImageErrorsMap] = useState({})
  const baseUrl = (API_ENDPOINT || '').replace(/\/$/, '')

  const slotCount = watch('slotCount')
  useEffect(() => {
    if (slotCount) {
      trigger('combinations')
    }
  }, [slotCount, trigger])
  const numImages = watch('numImages')
  useEffect(() => {
    if (numImages) {
      trigger('combinations')
    }
  }, [numImages, trigger])

  const calculateTotalDailyLimits = () => {
    const combinations = watch('combinations') || []
    let totalDailyLimits = 0
    combinations.forEach((combo) => {
      if (combo.prizes && combo.prizes.length > 0) {
        combo.prizes.forEach((prize) => {
          if (prize.prize_limit) {
            totalDailyLimits += Number(prize.prize_limit || 0)
          }
        })
      }
    })
    return totalDailyLimits
  }

  const [totalDailyLimits, setTotalDailyLimits] = useState(0)
  const watchCombinations = useWatch({ control, name: 'combinations' })
  useEffect(() => {
    setTotalDailyLimits(calculateTotalDailyLimits())
  }, [watchCombinations])

  const reportImageError = useCallback((index, hasError) => {
    setImageErrorsMap((prev) => ({
      ...prev,
      [index]: hasError,
    }))
  }, [])

  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1])
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], { type: mimeString })
  }

  const checkForMissingImages = useCallback(() => {
    if (!watchedImages || watchedImages.length === 0) {
      console.log('No images available to check')
      return true
    }
    const anyMissingFiles = watchedImages.some((img, index) => {
      const isMissing = (!img.file && !img.src) || imageErrorsMap[index]
      if (!isMissing && !img.file && img.src) {
        const isValidSrc =
          img.src.startsWith('data:') || img.src.startsWith('http') || img.src.startsWith('/')
        console.log(`Image ${index} src validation:`, { isValidSrc })
        return !isValidSrc
      }
      return isMissing
    })
    if (anyMissingFiles) {
      setError('images', { type: 'manual' })
      setHasImageErrors(true)
    } else {
      clearErrors('images')
      setHasImageErrors(false)
    }
    return anyMissingFiles
  }, [watchedImages, setError, clearErrors, imageErrorsMap])

  useEffect(() => {
    if (apiDataLoaded) {
      checkForMissingImages()
    }
  }, [watchedImages, apiDataLoaded, checkForMissingImages, imageErrorsMap])

  const fetchData = useCallback(async () => {
    if (manuallyUpdated) return
    try {
      const response = await admingetSlotMachineconfigcontent()
      if (response.data.status && response.data.data) {
        const configData = response.data.data
        reset({
          slotCount: configData.slots,
          numImages: configData.section,
          spinLimit: configData.user_daily_limit,
          totalPrizeLimit: configData.total_prize_limit,
          backgroundImage: {
            file: null,
            src: configData.backgroundImage ? `${baseUrl}/media/${configData.backgroundImage}` : '',
          },
          theme_config: configData.theme_config || [{}],
          combinations: configData.specific_combinations
            ? configData.specific_combinations.map((combo) => ({
                combination: combo.combination,
                prizes: combo.prizes.map((prize) => ({
                  name: prize.name,
                  prize_limit: prize.prize_limit?.toString(),
                })),
              }))
            : [{ combination: '', prizes: [{ name: '', prize_limit: '' }] }],
        })
        await populateImages(configData, {
          appendImage,
          removeImage,
          setValue,
          trigger,
          imageFieldsLength: imageFields.length,
        })
        setApiDataLoaded(true)
      }
    } catch (error) {
      console.error('Error fetching config:', error)
    }
  }, [appendImage, removeImage, reset, setValue, trigger, manuallyUpdated, imageFields.length])

  // Call fetchData only once on mount
  useEffect(() => {
    fetchData()
  }, [fetchData])

  const debouncedHandleImagesChange = useDebounce(async (value) => {
    if (value === '') return
    const newCount = parseInt(value, 10) || 0
    setValue('numImages', newCount)
    await trigger('numImages')
    if (newCount < 3 || newCount > 10) {
      setApiDataLoaded(true)
      return
    }
    const currentCount = imageFields.length
    setManuallyUpdated(true)
    if (newCount > currentCount) {
      for (let i = currentCount; i < newCount; i++) {
        appendImage({ file: null, src: '' }, { shouldFocus: false })
      }
    } else if (newCount < currentCount) {
      for (let i = currentCount - 1; i >= newCount; i--) {
        removeImage(i)
      }
    }
    setApiDataLoaded(true)
    await trigger()
    checkForMissingImages()
  }, 1500)

  const handleImageChange = async (index, event) => {
    const file = event.target.files[0]
    if (file) {
      setValue(`images.${index}.file`, file)
      const reader = new FileReader()
      reader.onloadend = async () => {
        setValue(`images.${index}.src`, reader.result)
        await trigger(`images.${index}`)
        checkForMissingImages()
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteCombination = (index) => {
    setManuallyUpdated(true)
    removeCombination(index)
  }

  const handleAddCombination = () => {
    setManuallyUpdated(true)
    appendCombination({ combination: '', prizes: [{ name: '', prize_limit: '' }] })
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const anyMissingFiles = checkForMissingImages()
      if (anyMissingFiles) {
        setLoading(false)
        return
      }
      for (let i = 0; i < data.images.length; i++) {
        const image = data.images[i]
        if (!image.file && !image.src) {
          showToastr(`Missing image ${i + 1}`, 'error')
          setLoading(false)
          return
        }
      }
      const formData = new FormData()
      formData.append('slots', data.slotCount.toString())
      formData.append('section', data.numImages.toString())
      formData.append('user_daily_limit', data.spinLimit.toString())
      formData.append('total_prize_limit', data.totalPrizeLimit.toString())
      if (data.combinations?.length) {
        const specificCombinations = data.combinations.map((combo) => ({
          combination: combo.combination,
          prizes: combo.prizes.map((prize) => ({
            name: prize.name,
            prize_limit: parseInt(prize.prize_limit),
          })),
        }))
        formData.append('specific_combinations', JSON.stringify(specificCombinations))
      }
      if (data.theme_config) {
        formData.append('theme_config', JSON.stringify(data.theme_config))
      }
      try {
        for (let i = 0; i < data.images.length; i++) {
          const image = data.images[i]
          if (image.file) {
            formData.append('images', image.file)
          } else if (image.src && image.src.startsWith('data:')) {
            const blob = dataURItoBlob(image.src)
            const fileExtension = blob.type.split('/')[1] || 'png'
            const fileName = `image_${i}.${fileExtension}`
            formData.append('images', new File([blob], fileName, { type: blob.type }))
          } else {
            throw new Error(`Image ${i + 1} has an invalid source format.`)
          }
        }
      } catch (error) {
        console.error(error.message, 'error')
        setLoading(false)
        return
      }
      if (data.backgroundImage && data.backgroundImage.file) {
        formData.append('BackgroundImage', data.backgroundImage.file)
      }
      const response = await adminsetSlotMachineconfig(formData)
      if (response.data.status) {
        showToastr(response?.data?.message ?? 'Configuration saved successfully.', 'success')
      } else {
        throw new Error(response.data.message || 'Failed to save configuration')
      }
    } catch (error) {
      console.error('API Error:', error)
      showToastr(
        error.response?.data?.message || error.message || 'Failed to submit configuration',
        'error',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('Form errors:', errors)
  }, [errors])

  if (!canViewGameConfig) {
    return (
      <div>
        <h1>You do not have permission to access this page</h1>
      </div>
    )
  }

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader className="font-weight-bold h5">Game Config</CCardHeader>
          <CCardBody>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {canAccess('slotmachine_config', 'view') && (
                <>
                  <fieldset disabled={!canUpdate}>
                    <CRow className="d-flex">
                      <div className="col-sm-4">
                        <FormInput
                          type="number"
                          placeholder="Enter number of slots"
                          label="Slots"
                          {...register('slotCount')}
                          error={errors.slotCount?.message}
                          min={3}
                          max={5}
                        />
                      </div>
                      <div className="col-sm-4">
                        <FormInput
                          type="number"
                          placeholder="Enter Number Of Images"
                          label="Slot Images"
                          {...register('numImages')}
                          onChange={(e) => debouncedHandleImagesChange(e.target.value)}
                          error={errors.numImages?.message}
                          min={3}
                          max={10}
                        />
                      </div>
                      <div className="col-sm-4">
                        <FormInput
                          type="number"
                          placeholder="Enter User's Daily Play Limit"
                          label="User Daily Play Limit"
                          {...register('spinLimit')}
                          error={errors.spinLimit?.message}
                        />
                      </div>
                      <div className="col-sm-3">
                        <FormInput
                          type="number"
                          placeholder="Enter Total Prize Limit"
                          label="Total Prize Limit"
                          {...register('totalPrizeLimit')}
                          error={errors.totalPrizeLimit?.message}
                        />
                      </div>
                      <div className="col-12 mt-2">
                        <h6 className="font-weight-bold mb-3">Slot Images</h6>
                        <CRow className="image-cards-row">
                          {apiDataLoaded &&
                            imageFields.map((field, index) => (
                              <ImageUploadCard
                                key={field.id}
                                index={index}
                                field={field}
                                watch={watch}
                                errors={errors}
                                isSubmitted={isSubmitted || hasImageErrors}
                                handleImageChange={handleImageChange}
                                reportImageError={reportImageError}
                                setValue={setValue}
                              />
                            ))}
                        </CRow>
                        {(isSubmitted || hasImageErrors) && errors.images && (
                          <div className="text-danger">{errors.images.message}</div>
                        )}
                      </div>
                      <div className="col-12 mt-4">
                        <h6 className="font-weight-bold mb-3">Theme Configuration (Optional)</h6>
                        <div className="border rounded p-3">
                          <CRow>
                            <CCol sm="6">
                              <div className="form-group">
                                <label>Game Title</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter game title"
                                  {...register('theme_config.0.gameTitle')}
                                />
                              </div>
                            </CCol>
                            <CCol sm="6">
                              <div className="form-group">
                                <label>Theme Background Image</label>
                                {/* Remove the extra wrapping div */}
                                <ImageUploadCard
                                  fieldName="backgroundImage"
                                  labelText="Upload Theme Background"
                                  watch={watch}
                                  setValue={setValue}
                                  errors={errors}
                                  isSubmitted={isSubmitted}
                                  previewWidth={120} // You can adjust these if needed
                                  previewHeight={120}
                                />
                              </div>
                            </CCol>
                          </CRow>
                          <CRow className="mt-3">
                            <CCol sm="3">
                              <div className="form-group">
                                <label>Title Color</label>
                                <div className="d-flex align-items-center">
                                  <input
                                    type="color"
                                    className="form-control"
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      padding: 0,
                                      border: 'none',
                                    }}
                                    {...register('theme_config.0.titleColor')}
                                    onChange={(e) =>
                                      setValue('theme_config.0.titleColor', e.target.value)
                                    }
                                  />
                                  <input
                                    type="text"
                                    className="form-control ml-2"
                                    placeholder="#000000"
                                    value={titleColor || ''}
                                    onChange={(e) =>
                                      setValue('theme_config.0.titleColor', e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </CCol>
                            <CCol sm="3">
                              <div className="form-group">
                                <label>Reel Border</label>
                                <div className="d-flex align-items-center">
                                  <input
                                    type="color"
                                    className="form-control"
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      padding: 0,
                                      border: 'none',
                                    }}
                                    {...register('theme_config.0.reelBorder')}
                                    onChange={(e) =>
                                      setValue('theme_config.0.reelBorder', e.target.value)
                                    }
                                  />
                                  <input
                                    type="text"
                                    className="form-control ml-2"
                                    placeholder="#000000"
                                    value={reelBorder || ''}
                                    onChange={(e) =>
                                      setValue('theme_config.0.reelBorder', e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </CCol>
                            <CCol sm="3">
                              <div className="form-group">
                                <label>Button Background Color</label>
                                <div className="d-flex align-items-center">
                                  <input
                                    type="color"
                                    className="form-control"
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      padding: 0,
                                      border: 'none',
                                    }}
                                    {...register('theme_config.0.buttonBackgroundColor')}
                                    onChange={(e) =>
                                      setValue(
                                        'theme_config.0.buttonBackgroundColor',
                                        e.target.value,
                                      )
                                    }
                                  />
                                  <input
                                    type="text"
                                    className="form-control ml-2"
                                    placeholder="#000000"
                                    value={buttonBackgroundColor || ''}
                                    onChange={(e) =>
                                      setValue(
                                        'theme_config.0.buttonBackgroundColor',
                                        e.target.value,
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </CCol>
                            <CCol sm="3">
                              <div className="form-group">
                                <label>Button Text Color</label>
                                <div className="d-flex align-items-center">
                                  <input
                                    type="color"
                                    className="form-control"
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      padding: 0,
                                      border: 'none',
                                    }}
                                    {...register('theme_config.0.buttonTextColor')}
                                    onChange={(e) =>
                                      setValue('theme_config.0.buttonTextColor', e.target.value)
                                    }
                                  />
                                  <input
                                    type="text"
                                    className="form-control ml-2"
                                    placeholder="#000000"
                                    value={buttonTextColor || ''}
                                    onChange={(e) =>
                                      setValue('theme_config.0.buttonTextColor', e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </CCol>
                          </CRow>
                        </div>
                      </div>

                      <div className="col-12 mt-4">
                        <div className="border rounded p-3">
                          <h6 className="font-weight-bold mb-3">Specific Combination</h6>
                          <div className="combinations-grid">
                            {combinationFields.map((field, combinationIndex) => (
                              <CombinationCard
                                key={field.id}
                                combinationIndex={combinationIndex}
                                field={field}
                                register={register}
                                errors={errors}
                                watch={watch}
                                control={control}
                                removePrizeField={() => {}}
                                handleDeleteCombination={handleDeleteCombination}
                              />
                            ))}
                          </div>
                          {errors.combinations?.message && (
                            <div className="text-danger mt-2">{errors.combinations.message}</div>
                          )}
                          <div className="mt-2 mb-2">
                            <small
                              className={`${
                                totalDailyLimits === Number(watch('totalPrizeLimit'))
                                  ? 'text-success'
                                  : 'text-danger'
                              }`}
                            >
                              <strong>Total Daily Prize Limits: {totalDailyLimits}</strong>
                              {watch('totalPrizeLimit') && (
                                <>
                                  {' / '}
                                  <strong>{watch('totalPrizeLimit')}</strong>{' '}
                                  {totalDailyLimits !== Number(watch('totalPrizeLimit')) &&
                                    `(${
                                      totalDailyLimits < Number(watch('totalPrizeLimit'))
                                        ? 'Under'
                                        : 'Over'
                                    } by ${Math.abs(totalDailyLimits - Number(watch('totalPrizeLimit')))})`}
                                </>
                              )}
                            </small>
                          </div>
                          <CustomButton
                            color="primary"
                            className="mt-1 btn-sm"
                            type="button"
                            text="Add More Combination"
                            onClick={handleAddCombination}
                          />
                        </div>
                      </div>
                    </CRow>
                  </fieldset>
                </>
              )}
              {canUpdate && (
                <CCardFooter className="mt-4">
                  <CustomButton
                    color="primary"
                    className="mt-1 btn-sm"
                    type="submit"
                    text={loading ? 'Saving...' : titleConstants.BUTTON_SUBMIT_TITLE}
                    labelClass="ml-1"
                    icon={<FaSave className="mb-1 mr-1" />}
                    disabled={loading || hasImageErrors || Object.keys(errors).length > 0}
                  />
                  &nbsp;
                  {/* <CustomButton
                    color="secondary"
                    className="mt-1 btn-sm"
                    type="button"
                    text="Reset"
                    icon={<GrPowerReset className="mb-1 mr-1" />}
                    onClick={() =>
                      reset({
                        slotCount: '',
                        numImages: '',
                        spinLimit: '',
                        totalPrizeLimit: '',
                        images: [],
                        combinations: [],
                      })
                    }
                    disabled={loading}
                  /> */}
                </CCardFooter>
              )}
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Slot_Config_Form
