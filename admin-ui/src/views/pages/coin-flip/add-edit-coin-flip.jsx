import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { FaRedo, FaUndo, FaSave, FaPlus, FaTrash } from 'react-icons/fa'
import CustomButton from '../../../components/Button'
import FormInput from '../../../components/FormInput'
import { toast } from 'react-toastify'
import { coinflipsetgameconfig, coinflipgetgameconfig } from '../../../helpers/apiRequest'
import { useCanAccess } from '../../../helpers/common-unitl'
import { AdminConfigValidationSchema } from '../../pages/coin-flip/validation/game-config-validation-schema'
import './scss/coin-flip.scss'
import {
  CForm,
  CCardFooter,
  CInputGroup,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormFeedback,
  CFormLabel,
  CImage,
} from '@coreui/react'

//admin game config_form
export default function AdminConfigForm() {
  const [loading, setLoading] = useState(false)
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [headPreview, setHeadPreview] = useState(null)
  const [tailPreview, setTailPreview] = useState(null)
  const canAccess = useCanAccess()
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(AdminConfigValidationSchema),
    defaultValues: {
      head_image: '',
      tail_image: '',
      special_days: [
        {
          start_date: '',
          end_date: '',
          daily_limit: '',
          price: '',
        },
      ],
      prices: [{ price: '' }],
      daily_limit: '',
    },
  })

  const {
    fields: specialDays,
    append: appendSpecialDay,
    remove: removeSpecialDay,
  } = useFieldArray({
    control,
    name: 'special_days',
  })
  const canViewGameConfig = canAccess('coin_flip_config', 'view')

  const fetchData = async () => {
    if (isSubmittingForm) return

    setLoading(true) // Set loading state
    try {
      //get api called
      const response = await coinflipgetgameconfig()
      const data = response.data.data
      if (data) {
        setValue('head_image', data?.head_image)
        setValue('tail_image', data?.tail_image)
        setValue('prices', data?.prices)
        setValue('special_days', data?.special_days)
        setValue('daily_limit', data?.daily_limit)
        const UPLOADS_PATH = import.meta.env.VITE_APP_MEDIA_PATH

        if (data?.head_image) {
          setHeadPreview(`${UPLOADS_PATH}/${data.head_image}`)
        }
        if (data?.tail_image) {
          setTailPreview(`${UPLOADS_PATH}/${data.tail_image}`)
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false) // Set loading state to false after data is fetched
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleImageUpload = (type, event) => {
    const file = event.target.files[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)

      if (type === 'head') {
        setHeadPreview(previewUrl)
      } else if (type === 'tail') {
        setTailPreview(previewUrl)
      }
    }
  }

  const onSubmit = async (data) => {
    setIsSubmittingForm(true)
    try {
      console.log(data)
      const formData = new FormData()

      // Append non-file fields as JSON
      for (const [key, value] of Object.entries(data)) {
        if (key === 'head_image' || key === 'tail_image') {
          if (value instanceof File) {
            formData.append(key, value)
          }
        } else {
          formData.append(key, JSON.stringify(value))
        }
      }
      let result
      result = await coinflipsetgameconfig(formData)
      if (result?.status) {
        toast.success(result?.data?.message)
      } else {
        console.error('Error submitting form:')
        toast.error(result?.data?.message || 'Something went wrong')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error(error?.response?.data?.message || 'Submission failed')
    }
  }

  // const custom-style = headPreview ? { width: '100px', height: '100px', objectFit: 'cover' } : {}

  const tailStyle = tailPreview ? { width: '100px', height: '100px', objectFit: 'cover' } : {}

  if (loading) {
    return <p>Loading...</p>
  }

  if (!canViewGameConfig) {
    return (
      <div>
        <h1>You do not have permission to access this page</h1>
      </div>
    )
  }

  //return my entire code
  return (
    <CRow>
      <CCol xs="12">
        <CCard className="admin-config-container">
          <CCardHeader className="admin-config-title h5">Coin Flip Config</CCardHeader>
          <CForm onSubmit={handleSubmit(onSubmit)}>
            <CCardBody>
              <CInputGroup className="row">
                {/* Head Image */}
                <div className="mb-3 col-sm-6">
                  <CFormLabel htmlFor="head_image" className='ml-2'>Head image</CFormLabel>
                  {headPreview && (
                    <div style={{ height: 'auto', width: '100px' }}>
                      <CImage src={headPreview} className="rounded-2 me-2 p-2" alt="" width="100" />
                    </div>
                  )}
                  <Controller
                    name="head_image"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <>
                        <FormInput
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            handleImageUpload('head', e)
                            onChange(e.target.files[0])
                          }}
                          className="form-control"
                          disabled={!canAccess('coin_flip_config', 'update')}
                        />
                      </>
                    )}
                  />
                  {errors.head_image && (
                    <CFormFeedback className="invalid-feedback d-block">
                      {errors.head_image.message}
                    </CFormFeedback>
                  )}
                </div>
                {/* Tail Image */}
                <div className="mb-3 col-sm-6">
                  <CFormLabel htmlFor="tail_image">Tail image</CFormLabel>
                  {tailPreview && (
                    <div style={{ height: 'auto', width: '100px' }}>
                      <CImage src={tailPreview} alt="" width="100" className="rounded-2 me-2 p-2" />
                    </div>
                  )}
                  <Controller
                    name="tail_image"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <>
                        <FormInput
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            handleImageUpload('tail', e)
                            onChange(e.target.files[0])
                          }}
                          className="form-control"
                          disabled={!canAccess('coin_flip_config', 'update')}
                        />
                      </>
                    )}
                  />
                  {errors.tail_image && (
                    <CFormFeedback className="invalid-feedback d-block">
                      {errors.tail_image.message}
                    </CFormFeedback>
                  )}
                </div>
              </CInputGroup>

              <CCard className="mb-3">
                <CCardBody>
                  <CInputGroup className="row mb-2">
                    <div className="col-sm-1"></div>
                  </CInputGroup>
                  {/* Loop for Input Fields */}

                  <div className>
                    {/* Index Number */}
                    <span>User daily limit</span>
                  </div>
                  <CInputGroup key={1} className="row mb-3">
                    <div className="col-sm-5">
                      <Controller
                        name={`daily_limit`} // Access price field
                        control={control}
                        render={({ field }) => {
                          console.log(field, 'head')
                          return (
                            <FormInput
                              {...field}
                              value={field.value}
                              type="string"
                              placeholder="Daily Limit"
                              error={errors.daily_limit}
                              className="mt-3"
                              disabled={!canAccess('coin_flip_config', 'update')}
                            />
                          )
                        }}
                      />
                    </div>
                  </CInputGroup>
                </CCardBody>
              </CCard>

              {/* <CFormLabel>Prices</CFormLabel> */}
              {/** Static prices */}
              <CCard className="mb-3">
                <CCardBody>
                  <CInputGroup className="row mb-2">
                    <div className="col-sm-1"></div>
                    <div className="col-sm-3">
                      <div>Prize</div>
                    </div>
                    <div className="col-sm-2"></div>
                    <div className="col-sm-3">
                      <div>Prize limit</div>
                    </div>
                  </CInputGroup>
                  {/* Loop for Input Fields */}
                  {Array.from({ length: 6 }).map((_, index) => (
                    <CInputGroup key={index + 1} className="row mb-3">
                      <div className="col-sm-1 d-flex align-items-center justify-content-center">
                        {/* Index Number */}
                        <span className='ml-5'>{index + 1}</span>
                      </div>
                      <div className="col-sm-5">
                        {/* Price Field */}
                        <Controller
                          name={`prices.${index}.price`} // Access price field
                          control={control}
                          render={({ field }) => {
                            return (
                              <FormInput
                                {...field}
                                value={field.value}
                                type="string"
                                placeholder="Price"
                                error={errors.prices?.[index]?.price?.message}
                                className="mt-3"
                                disabled={!canAccess('coin_flip_config', 'update')}
                              />
                            )
                          }}
                        />
                      </div>
                      {/* Limit Field */}
                      <div className="col-sm-5">
                        <Controller
                          name={`prices.${index}.limit`}
                          control={control}
                          render={({ field }) => {
                            return (
                              <FormInput
                                {...field}
                                value={field.value}
                                type="string"
                                placeholder="prize limit"
                                error={errors.prices?.[index]?.limit?.message}
                                className="mt-3"
                                disabled={!canAccess('coin_flip_config', 'update')}
                              />
                            )
                          }}
                        />
                      </div>
                    </CInputGroup>
                  ))}
                </CCardBody>
              </CCard>
              {/* Special-days */}
              {/* <CFormLabel>Special Days</CFormLabel> */}
              {/* {specialDays?.map((field, index) => (
                <CCard key={field.id} className="mb-3">
                  <CCardBody>
                    <CInputGroup className="row">
                      <div className="mb-3 col-sm-3">
                        <Controller
                          name={`special_days.${index}.start_date`}
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              {...field}
                              value={getValues(`special_days`)?.[index]?.start_date}
                              type="date"
                              placeholder="Start Date"
                              error={errors.special_days?.[index]?.start_date?.message}
                              label="Start Date"
                              disabled={!canAccess('coin_flip_config', 'update')}
                            />
                          )}
                        />
                      </div> */}
              {/* <div className="mb-3 col-sm-3">
                        <Controller
                          name={`special_days.${index}.end_date`}
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              {...field}
                              type="date"
                              placeholder="End Date"
                              error={errors.special_days?.[index]?.end_date?.message}
                              label="End Date"
                              value={getValues(`special_days`)?.[index]?.end_date}
                              disabled={!canAccess('coin_flip_config', 'update')}
                            />
                          )}
                        /> */}
              {/* </div> */}
              {/* <div className="mb-3 col-sm-3">
                        <Controller
                          name={`special_days.${index}.daily_limit`}
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              {...field}
                              type="number"
                              placeholder="Daily limit"
                              error={errors.special_days?.[index]?.daily_limit?.message}
                              label="Daily limit"
                              value={getValues(`special_days`)?.[index]?.daily_limit}
                              disabled={!canAccess('coin_flip_config', 'update')}
                              className="no-spinner"
                            />
                          )}
                        /> */}
              {/* </div> */}
              {/* <div className="mb-3 col-sm-3">
                        <Controller
                          name={`special_days.${index}.price`}
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              {...field}
                              type="string"
                              placeholder="Prize"
                              error={errors.special_days?.[index]?.price?.message}
                              label="Prize"
                              value={getValues(`special_days`)?.[index]?.price}
                              disabled={!canAccess('coin_flip_config', 'update')}
                            />
                          )}
                        />
                      </div> */}
              {/* </CInputGroup> */}
              {/* {canAccess('coin_flip_config', 'update') && (
                      <>
                        <CustomButton
                          icon={<FaTrash />}
                          color="danger"
                          className="btn-sm"
                          onClick={() => removeSpecialDay(index)}
                        />
                      </>
                    )} */}
              {/* </CCardBody> */}
              {/* </CCard> */}
              {/* ))} */}
              {/* {canAccess('coin_flip_config', 'update') && (
                <>
                  <CustomButton
                    icon={<FaPlus />}
                    color="primary"
                    className="btn-sm mb-3 mt-3 ml-2"
                    onClick={() =>
                      appendSpecialDay({
                        start_date: '',
                        end_date: '',
                        daily_limit: '',
                        price: '',
                      })
                    }
                    text="Add Special Day"
                  />
                </>
              )} */}
            </CCardBody>
            {/* Footer Button */}
            <CCardFooter>
              {canAccess('coin_flip_config', 'update') && (
                <>
                  <CustomButton
                    color="primary"
                    disabled={isSubmitting}
                    type="submit"
                    className="mt-1 btn-sm"
                    text={'Submit'}
                    icon={<FaSave className="mb-1 mr-1" />}
                  />
                  &nbsp;
                  {/* <Link to={'/admin-config'}>
                    <CustomButton
                      icon={<IoClose className="mb-1 mr-1" />}
                      color="danger"
                      className="mt-1 btn-sm"
                      type="button"
                      text="Cancel"
                    />
                  </Link> */}
                </>
              )}
            </CCardFooter>
          </CForm>
        </CCard>
      </CCol>
    </CRow>
  )
}
