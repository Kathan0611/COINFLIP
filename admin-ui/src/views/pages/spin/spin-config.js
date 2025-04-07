import React, { useState, useEffect, useMemo } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CFormSelect,
  CContainer,
  CRow,
  CCol,
  CImage,
  CCardFooter,
  CForm,
  CFormInput,
  CFormText,
} from '@coreui/react'
import '@coreui/coreui/dist/css/coreui.min.css'
import FormInput from '../../../components/FormInput'
import CustomButton from '../../../components/Button'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FaSave } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { IoClose } from 'react-icons/io5'
import { showToastr } from '../../../components/ToastrNotification'
import { getTemplateData, getConfig, updateTemplateConfig } from '../../../helpers/apiRequest'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { validationSchema } from './validation/spinningWheelSchema'
import { SpinningWheel } from './components/spinningwheel/SpinningWheel'
import { API_ENDPOINT } from '../../../helpers/apiRequest'
import { useCanAccess } from '../../../helpers/common-unitl'
import { StorePagetitleConstants } from '../../../constant/titleConstant'

const SpinningWheelSystem = () => {
  const navigate = useNavigate()
  const canAccess = useCanAccess()
  const isEditable = canAccess('spin_config', 'update')
  const [slectedTemplate, setSlectedTemplate] = useState(null)
  const sliceCount = useMemo(() => slectedTemplate?.slice_count, [slectedTemplate])
  const [previews, setPreviews] = useState([]) // Keep only previews here
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [rewards, setRewards] = useState(Array(8).fill(''))
  const [imageData, setImages] = useState(Array(8).fill(''))

  // prizeLimit state
  const [totalPrizeLimit, setTotalPrizeLimit] = useState()
  const [prizeLimit, setPrizeLimit] = useState(Array(sliceCount).fill(0))
  const [colors, setColors] = useState(Array(sliceCount).fill('FFFFFF'))
  const [error, setError] = useState('')
  const selectedColor = []
  // const { id } = useParams()
  const id = 23

  const handlePrizeLimitChange = (index, value) => {
    const newValue = value ? parseInt(value, 10) : 0

    // Calculate the new total used
    let totalUsed = prizeLimit.reduce((sum, v, i) => sum + (i === index ? newValue : v), 0)

    setPrizeLimit((prev) => {
      const updated = [...prev]
      updated[index] = newValue
      return updated
    })
  }

  // Update Validation Function
  const validateTotalPrizeLimit = (totalUsed) => {
    const sum = totalUsed !== undefined ? totalUsed : prizeLimit.reduce((a, b) => a + b, 0)

    if (sum < totalPrizeLimit) {
      setError(`Total Prize Limit is not fully allocated. Remaining: ${totalPrizeLimit - sum}`)
      return false
    }
    if (sum > totalPrizeLimit) {
      setError(`Total Prize Limit is fully allocated.`)
      return false
    }

    setError('') // Clear error if valid
    return true
  }

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      totalPrizeLimit: '',
      rewards: Array(sliceCount).fill(''),
      images: Array(sliceCount).fill(null),
    },
  })

  // Watch the rewards array (live updates)
  const watchedRewards = watch('rewards', rewards)
  const watchImages = watch('images')
  const watchedPrizeLimit = watch('prizeLimit')
  const watchedColors = watch('colors')
  const watchedTotalPrizeLimit = watch('totalPrizeLimit')

  const settings = {
    prizeList: watchedRewards,
    images: {},
    colors: watchedColors,
    prizeLimit: watchedPrizeLimit,
  }

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)

      setImages((prevImages) => {
        const newImages = [...prevImages]
        newImages[index] = file
        return newImages
      })

      setPreviews((prevPreviews) => {
        const newPreviews = [...prevPreviews]
        newPreviews[index] = previewUrl
        return newPreviews
      })
    }
  }

  const fetchTemplates = async () => {
    if (!id) {
      return
    }

    setLoading(true)
    try {
      const response = await getTemplateData(id)
      if (response?.status) {
        const fetchedTemplates = response?.data?.data?.templates || []
        setTemplates(fetchedTemplates)
        // Find the template that was previously used
        const storedTemplateId = localStorage.getItem(`selectedTemplate-${id}`)
        const defaultTemplate =
          fetchedTemplates.find((template) => template.id == storedTemplateId) ||
          fetchedTemplates.find((template) => template.is_default)

        if (defaultTemplate) {
          setSlectedTemplate(defaultTemplate)
          fetchTemplateConfig(id, defaultTemplate.id)
        }
      } else {
        console.error('API response error:', response?.message)
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTemplateConfig = async (id, templateId, templateData) => {
    try {
      if (!id || !templateId) return

      const response = await getConfig(id, templateId)
      if (response?.data?.status) {
        const configData = response?.data?.data?.stripe_texts || []
        const totalPrizeLimit = response?.data?.data?.total_prize_limit
        setTotalPrizeLimit(Number(totalPrizeLimit))
        // Extract rewards and images
        const extractedRewards = configData.map((item) => item.text || '')
        const extractedImages = configData.map((item) =>
          item.image ? `${API_ENDPOINT}${item.image}` : null,
        )
        const extractedColors = configData.map((item) => item.color || 'FFFFFF')
        console.log('extractedColors', extractedColors)
        const extractedprizelimit = configData.map((item) => Number(item.prize_limit) || 0)
        // Set rewards and images
        setRewards(
          extractedRewards.length ? extractedRewards : Array(templateData?.slice_count).fill(''),
        )
        setValue(
          'rewards',
          extractedRewards.length ? extractedRewards : Array(templateData?.slice_count).fill(''),
        )
        setColors(extractedColors)
        setValue('colors', extractedColors)
        setPrizeLimit(extractedprizelimit)
        setValue('prizeLimit', extractedprizelimit)
        setValue('totalPrizeLimit', Number(totalPrizeLimit))
        setImages(extractedImages)
        setValue('images', extractedImages)
        setPreviews(extractedImages.map((img) => (img ? img : null)))
      } else {
        console.error('Failed to fetch template configuration:', response?.message)
      }
    } catch (error) {
      console.error('Error fetching template configuration:', error)
    }
  }

  const onSubmit = async (data) => {
    const totalUsed = prizeLimit.reduce((a, b) => a + b, 0)

    if (!validateTotalPrizeLimit(totalUsed)) {
      console.log("first")
      return // Prevent form submission if total prize limit is not correctly allocated
    }

    try {
      const storeId = id
      const templateId = slectedTemplate?.id

      if (!storeId || !templateId) {
        showToastr('Store ID or Template ID is missing!', 'error')
        return
      }

      const formData = new FormData()
      formData.append('is_default', true)
      formData.append('total_prize_limit', data.totalPrizeLimit)
      data.rewards.forEach((stripe, index) => {
        formData.append(`stripe_texts[${index}][id]`, index + 1)
        formData.append(`stripe_texts[${index}][text]`, stripe)
        formData.append(`stripe_texts[${index}][degree]`, (360 / sliceCount) * (index + 1))
        formData.append(`stripe_texts[${index}][color]`, data.colors[index])
        formData.append(`stripe_texts[${index}][prize_limit]`, data.prizeLimit[index])
        if (typeof watchImages[index] !== 'string') {
          formData.append(`stripe_texts[${index}][image]`, watchImages[index])
        }
      })

      const response = await updateTemplateConfig(storeId, templateId, formData)

      if (response?.data?.status) {
        showToastr(response?.data?.message, 'success')
        navigate('/spinconfig')
      } else {
        showToastr('Failed to update template!', 'error')
      }
    } catch (error) {
      showToastr(error.message || 'Something went wrong!', 'error')
    }
  }

  useEffect(() => {
    if (id) {
      fetchTemplates()
    }
  }, [id])


  return (
    <CContainer className="py-2">
      <CRow className="g-4">
        {/* Template Selection */}
        <CCol xs={12}>
          <CCard>
            <CCardHeader className="fw-semibold">Spin Config</CCardHeader>
            <CCardBody>
              <CRow className="g-3">
                <CCol xs={12} sm={6}>
                  <label className="fw-medium"> select slice</label>
                  <CFormSelect
                    value={slectedTemplate?.id}
                    onChange={async (e) => {
                      const selectedTemplateId = e.target.value
                      const newTemplate = templates.find((item) => item.id == selectedTemplateId)

                      if (newTemplate) {
                        reset({
                          rewards: Array(newTemplate?.slice_count).fill(''),
                          images: Array(newTemplate?.slice_count).fill(null),
                        })
                        setPreviews(Array(sliceCount).fill(null))
                        setSlectedTemplate(newTemplate)
                        setLoading(true)
                        await fetchTemplateConfig(id, selectedTemplateId, newTemplate)
                        setLoading(false)
                      }
                    }}
                    options={[
                      { label: 'Select Slices', value: '' },
                      ...(Array.isArray(templates)
                        ? templates.map((template) => ({
                            label: template.slice_name,
                            value: template.id,
                          }))
                        : []),
                    ]}
                    className="w-100 w-sm-50"
                  />
                </CCol>
                {/* Prize Limit Input Field */}
                {canAccess('spin_config', 'view') && (
                <CCol xs={12} sm={6}>
                  <label className="fw-medium">
                    Total Prize Limit (Remaining: {totalPrizeLimit - prizeLimit.reduce((a, b) => a + b, 0)})
                  </label>
                  <Controller
                    name={`totalPrizeLimit`}
                    control={control}
                    render={({ field }) => (
                      <FormInput
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          setTotalPrizeLimit(e.target.value)
                        }}
                        disabled={!isEditable}
                        value={totalPrizeLimit}
                        placeholder="Enter Total Prize Limit"
                        className="w-100"
                        error={errors.totalPrizeLimit?.message}
                      />
                    )}
                  />
                </CCol>
                )}
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Main Form */}
        <CCol xs={12}>
          <CCard>
            {loading ? (
              <CCardBody>
                <p>Loading data...</p>
              </CCardBody>
            ) : (
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <CRow className="g-4 mb-4">
                    {/* Spinning Wheel Section */}
                    <CCol xs={12} lg={6}>
                      <div className="position-relative">
                        {slectedTemplate?.images?.circle_img ? (
                          <SpinningWheel
                            settings={settings}
                            howMuchToSpin={360}
                            wheelImage={`${API_ENDPOINT}${slectedTemplate?.images?.circle_img}`}
                          />
                        ) : (
                          <p>No template selected yet.</p>
                        )}
                      </div>
                    </CCol>

                    {/* Rewards & Image Upload Section */}
                    {canAccess('spin_config', 'view') && (
                      <CCol xs={12} lg={6}>
                        <CRow className="g-3">
                          {Array.from({ length: sliceCount }).map((_, index) => (
                            <CCol xs={12} key={index}>
                              <CCard className="p-2">
                                <CRow>
                                  <CCol xs={12} sm={5}>
                                    <span className="fw-medium" style={{ minWidth: '30px' }}>
                                      {index + 1}.
                                    </span>
                                    {/* Reward Text Input */}
                                    <label className="fw-medium"> Reward Text</label>
                                    <Controller
                                      name={`rewards.${index}`}
                                      control={control}
                                      render={({ field }) => (
                                        <FormInput
                                          {...field}
                                          disabled={!isEditable}
                                          value={getValues('rewards')?.[index]}
                                          placeholder={`Enter reward for slice ${index + 1}`}
                                          className="flex-grow-1"
                                          error={errors.rewards?.[index]?.message}
                                        />
                                      )}
                                    />
                                  </CCol>

                                  <CCol xs={12} sm={5}>
                                    <label className="fw-medium"> Reward images </label>
                                    <Controller
                                      name={`images.${index}`}
                                      control={control}
                                      render={({ field: { onChange } }) => (
                                        <div>
                                          <FormInput
                                            type="file"
                                            disabled={!isEditable}
                                            onChange={(e) => {
                                              handleImageUpload(index, e)
                                              const file = e.target.files[0]
                                              onChange(file)
                                            }}
                                            className="flex-grow-1"
                                          />
                                          {errors.images?.[index] && (
                                            <p className="text-danger">{errors.images[index].message}</p>
                                          )}
                                        </div>
                                      )}
                                    />
                                  </CCol>

                                  {/* Image Preview */}
                                  <div
                                    className="border rounded overflow-hidden d-flex align-items-center justify-content-center bg-light"
                                    style={{ width: '60px', height: '60px', flexShrink: 0 }}
                                  >
                                    {previews[index] && (
                                      <CImage
                                        src={previews[index]}
                                        alt={`Preview ${index + 1}`}
                                        width={80}
                                        height={80}
                                        className="border rounded previewImage"
                                      />
                                    )}
                                  </div>
                                </CRow>
                                <CRow>
                                  <CCol xs={12} sm={5}>
                                    <label className="fw-medium"> PrizeLimit: </label>
                                    <Controller
                                      name={`prizeLimit.${index}`}
                                      control={control}
                                      render={({ field }) => (
                                        <FormInput
                                          {...field}
                                          onChange={(e) => {
                                            field.onChange(e)
                                            setPrizeLimit((prev) => {
                                              const updated = [...prev]
                                              updated[index] = Number(e.target.value)
                                              return updated
                                            })
                                          }}
                                          disabled={!isEditable}
                                          value={getValues('prizeLimit')?.[index]}
                                          placeholder={`Enter prize limit for slice ${index + 1}`}
                                          className="flex-grow-1"
                                          error={errors.prizeLimit?.[index]?.message}
                                        />
                                      )}
                                    />
                                  </CCol>
                                  <CCol xs={12} sm={5}>
                                    <label className="fw-medium">Color:</label>
                                    <Controller
                                      name={`colors.${index}`}
                                      control={control}
                                      render={({ field }) => (
                                        <div
                                          className="d-flex align-items-center"
                                          style={{ border: '1px solid #ddd', borderRadius: '5px' }}
                                        >
                                          <input
                                            id={`colorPicker-${index}`}
                                            type="color"
                                            disabled={!isEditable}
                                            // value={`#${field.value}`}
                                            value={`#${getValues('colors')?.[index]}`}
                                            onChange={(e) => {
                                              const color = e.target.value.toUpperCase().replace('#', '')
                                              field.onChange(color)
                                              setValue(`colors.${index}`, color)
                                            }}
                                            className="form-control-color"
                                            style={{
                                              width: '40px',
                                              height: '35px',
                                              border: 'none',
                                              cursor: isEditable ? 'pointer' : 'not-allowed',
                                            }}
                                          />
                                          <input
                                            type="text"
                                            disabled={!isEditable}
                                            // value={field.value || 'FFFFFF'}
                                            value={`${getValues('colors')?.[index]}` || ''}
                                            onChange={(e) => {
                                              let hex = e.target.value.toUpperCase().trim().replace('#', '')
                                              if (hex.length <= 6 && /^[0-9A-F]*$/i.test(hex)) {
                                                field.onChange(hex)
                                                setValue(`colors.${index}`, hex)
                                              }
                                            }}
                                            placeholder="FFFFFF"
                                            maxLength={7}
                                            className="form-control text-uppercase border-0"
                                            style={{ width: '100px', textAlign: 'center' }}
                                          />
                                        </div>
                                      )}
                                    />
                                    {errors.colors?.[index] && (
                                      <span className="text-danger">{errors.colors[index].message}</span>
                                    )}
                                  </CCol>
                                  <CCol xs={12} sm={2}>
                                    <span className="fw-medium">{selectedColor[index]}</span>
                                  </CCol>
                                </CRow>
                              </CCard>
                            </CCol>
                          ))}
                        </CRow>
                      </CCol>
                    )}
                  </CRow>


                  {canAccess('spin_config', 'update') && (
                    <CustomButton
                      className="mt-1 btn-sm float-right mr-2"
                      color="primary"
                      disabled={isSubmitting || !slectedTemplate}
                      type="submit"
                      text={
                        isSubmitting
                          ? StorePagetitleConstants.BUTTON_SUBMITTING_TITLE
                          : StorePagetitleConstants.BUTTON_SUBMIT_TITLE
                      }
                      icon={<FaSave className="mb-1 mr-1" size={'16px'} />}
                    />
                  )}
                </CForm>
              </CCardBody>
            )}
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default SpinningWheelSystem
