import React, { useRef, useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import {
  CForm,
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CRow,
  CCol,
  CFormLabel,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { storageRequest } from '../../../helpers/storageRequests'
import { FaSave } from 'react-icons/fa'
import { toast } from 'react-toastify'
import FormInput from '../../../components/FormInput'
import CustomButton from '../../../components/Button'
import { GrPowerReset } from 'react-icons/gr'
import { Link } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import Overlay from './components/previewOverlay'
import PlinkoCanvas from './components/previewComponent'
import { plinkosetgameconfig, plinkogetgameconfig } from '../../../helpers/apiRequest'
import { useCanAccess } from '../../../helpers/common-unitl'
export const API_ENDPOINT = import.meta.env.VITE_APP_API_ENDPOINT

export default function AdminForm() {
  // Use the new rewards object structure
  const defaultRewards = Array(4).fill({ reward: '', priceLimit: '' })

  // State declarations
  const [specialday, setSpecialday] = useState([])
  const [newDateRange, setNewDateRange] = useState({ start: null, end: null })
  const [backgroundColor, setBackgroundColor] = useState('#3A125E')
  const [dotobstaclesColor, setDotobstaclesColor] = useState('#B34CE6')
  const [sideobstaclesColor, setSideobstaclesColor] = useState('#F226EC')
  const [ballColor, setBallColor] = useState('#2CD4C3')
  const [arrowImage, setArrowImage] = useState('')

  // Separate states for Daily Play Limit and Total Prize Limit.
  const [perDayLimit, setDailyPlayLimit] = useState(1)
  const [totalPrizeCount, setTotalPrizeCount] = useState(1)

  const [rewards, setRewards] = useState(defaultRewards)
  const [editingIndex, setEditingIndex] = useState(null)
  const fileInputRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const canAccess = useCanAccess()

  const canViewGameConfig = canAccess('plinko_config', 'view')
  const hasUpdatePermission = canAccess('plinko_config', 'update')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    reset,
    getValues,
    clearErrors,
    setError,
  } = useForm()

  // Focus the first rewards error if one exists.
  useEffect(() => {
    if (errors.rewards) {
      const firstErrorIndex = Object.keys(errors.rewards)[0]
      if (firstErrorIndex !== undefined) {
        setFocus(`rewards[${firstErrorIndex}].reward`)
      }
    }
  }, [errors, setFocus])

  // Real-time validation for rewards price limits.
  useEffect(() => {
    const sum = rewards.reduce((acc, curr) => acc + Number(curr.rewardCount || 0), 0)
    const numericTotal = Number(totalPrizeCount)
    if (numericTotal > 0 && sum !== numericTotal) {
      const errorMessage =
        sum > numericTotal
          ? `Total bucket prize (${sum}) is more than the limit (${numericTotal}).`
          : `Total bucket prize (${sum}) is less than the limit (${numericTotal}).`
      setError('totalBucket', { type: 'manual', message: errorMessage })
    } else {
      clearErrors('totalBucket')
    }
  }, [rewards, totalPrizeCount, setError, clearErrors])

  // Reset function: load saved data from the API.
  const handleReset = async () => {
    try {
      const token = storageRequest.getAuth()
      if (!token) {
        toast.error('Unauthorized! Please log in again.')
        return
      }
      const response = await plinkogetgameconfig(token)
      if (!response.data.status) throw new Error('Failed to fetch saved settings.')

      const result = response.data
      console.log('Response for reset:', result)
      const Result = result.data.data
      console.log('Result:', Result)
      const parsedRewards = Result.rewards
        ? Result.rewards.map((reward) => (typeof reward === 'string' ? JSON.parse(reward) : reward))
        : defaultRewards

      const parsedSpecialDay = Result.specialday
        ? Result.specialday.map((day) => (typeof day === 'string' ? JSON.parse(day) : day))
        : []

      reset({ rewards: parsedRewards })
      setSpecialday(parsedSpecialDay)
      setBackgroundColor(Result.backgroundColor || '#f0f0f0')
      setDotobstaclesColor(Result.dotobstaclesColor || '#000000')
      setSideobstaclesColor(Result.sideobstaclesColor || '#000000')
      setBallColor(Result.ballColor || '#ff0000')
      setArrowImage(Result.arrowImage || '')
      setDailyPlayLimit(Result.perDayLimit || 1)
      setTotalPrizeCount(Result.totalPrizeCount || 1)
      setRewards(parsedRewards)
    } catch (error) {
      console.error('Error fetching saved settings:', error)
      toast.error('Failed to reset. Please try again.')
    }
  }

  // Handle changes for each reward bucket.
  const handleInputChange = (e, index, fieldName) => {
    const updated = [...rewards]
    updated[index] = { ...updated[index], [fieldName]: e.target.value }
    setRewards(updated)
    if (errors.rewards?.[index]?.[fieldName]) {
      clearErrors(`rewards[${index}].${fieldName}`)
    }
  }

  // onSubmit: Submit the form only if there is no error on totalBucket.
  const onSubmit = async () => {
    const currentRewards = getValues('rewards').map((reward, index) => ({
      reward: reward?.reward || '',
      rewardCount: reward?.rewardCount || '',
      index,
    }))
    if (errors.totalBucket) return

    const formData = {
      specialday,
      backgroundColor,
      dotobstaclesColor,
      sideobstaclesColor,
      ballColor,
      arrowImage,
      perDayLimit,
      totalPrizeCount,
      rewards: currentRewards,
    }

    console.log('Submitting form data:', formData)
    try {
      const token = storageRequest.getAuth()
      if (!token) {
        toast.error('Unauthorized! Please log in again.')
        return
      }
      const response = await plinkosetgameconfig(formData)
      const result = response?.data
      console.log('Response:', result.status)
      if (result.status) {
        console.log('Response:', response)
        toast.success('Configuration saved successfully!')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        toast.error(`Failed to save settings: ${result.message}`)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Something went wrong. Please try again.')
    }
  }

  // Color change handler.
  const handleColorChange = (colorValue, colorType) => {
    switch (colorType) {
      case 'background':
        setBackgroundColor(colorValue)
        break
      case 'dotobstacles':
        setDotobstaclesColor(colorValue)
        break
      case 'sideobstacles':
        setSideobstaclesColor(colorValue)
        break
      case 'ball':
        setBallColor(colorValue)
        break
      default:
        break
    }
  }

  // When the component mounts, load the saved configuration.
  useEffect(() => {
    handleReset()
  }, [])

  if (!canViewGameConfig) {
    return (
      <div>
        <h1>You do not have permission to access this page</h1>
      </div>
    )
  }
  return (
    <>
      <CRow>
        <CCol xs="12">
          <CCard className="mb-4">
            <CCardHeader className="d-flex">
              <h4>Game Config</h4>
              {/* <Link to="/dashboard">
                <CustomButton
                  color="danger"
                  className="btn-sm"
                  labelClass="ml-2"
                  text="Back"
                  icon={<FaArrowLeftLong className="mb-1" />}
                />
              </Link> */}
            </CCardHeader>
            <CForm onSubmit={handleSubmit(onSubmit)}>
              <fieldset disabled={!hasUpdatePermission}>
                <CCardBody>
                  {/* General Settings Card */}
                  <CRow className="mb-4">
                    <CCol xs="12">
                      <CCard className="shadow-sm">
                        <CCardHeader className="text-white">General Settings</CCardHeader>
                        <CCardBody className="p-4">
                          <CRow className="align-items-center">
                            <CCol xs="12" md="6" className="mb-3 mb-md-0">
                              <div className="p-3 rounded shadow-sm">
                                <CFormLabel className="fw-bold mb-2">
                                  Daily User Play Limit:
                                </CFormLabel>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={perDayLimit}
                                  onChange={(e) => {
                                    const value = e.target.value
                                    setDailyPlayLimit(
                                      value === '' ? '' : Math.max(1, Number(value)),
                                    )
                                  }}
                                  onBlur={(e) => {
                                    if (e.target.value === '') setDailyPlayLimit(1)
                                  }}
                                  min="1"
                                />
                              </div>
                            </CCol>
                            <CCol xs="12" md="6">
                              <div className="p-3 rounded shadow-sm">
                                <CFormLabel className="fw-bold mb-2">Total Prize Limit:</CFormLabel>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={totalPrizeCount}
                                  onChange={(e) => {
                                    const value = e.target.value
                                    setTotalPrizeCount(
                                      value === '' ? '' : Math.max(1, Number(value)),
                                    )
                                  }}
                                  onBlur={(e) => {
                                    if (e.target.value === '') setTotalPrizeCount(1)
                                  }}
                                  min="1"
                                />
                              </div>
                            </CCol>
                          </CRow>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>

                  {/* Rewards Card */}
                  <CRow className="mb-4">
                    <CCol xs="12">
                      <CCard className="shadow-sm">
                        <CCardHeader className="text-white">Rewards</CCardHeader>
                        <CCardBody>
                          {rewards
                            .reduce((rows, reward, index) => {
                              if (index % 2 === 0) {
                                rows.push([reward])
                              } else {
                                rows[rows.length - 1].push(reward)
                              }
                              return rows
                            }, [])
                            .map((rewardPair, rowIndex) => (
                              <CRow key={rowIndex} className="mb-4">
                                {rewardPair.map((reward, pairIndex) => {
                                  const index = rowIndex * 2 + pairIndex
                                  return (
                                    <React.Fragment key={index}>
                                      <CCol xs="3">
                                        <FormInput
                                          {...register(`rewards[${index}].reward`, {
                                            required: 'This field is required',
                                          })}
                                          value={reward.reward}
                                          placeholder={`Prize ${index + 1}`}
                                          onChange={(e) => handleInputChange(e, index, 'reward')}
                                          label={`Prize ${index + 1}`}
                                        />
                                        {errors.rewards?.[index]?.reward && (
                                          <p className="text-danger">
                                            {errors.rewards[index].reward.message}
                                          </p>
                                        )}
                                      </CCol>
                                      <CCol xs="3">
                                        <FormInput
                                          {...register(`rewards[${index}].rewardCount`, {
                                            required: 'This field is required',
                                          })}
                                          value={reward.rewardCount}
                                          placeholder={`Limit ${index + 1}`}
                                          onChange={(e) =>
                                            handleInputChange(e, index, 'rewardCount')
                                          }
                                          label={`Prize Limit ${index + 1}`}
                                        />
                                        {errors.rewards?.[index]?.rewardCount && (
                                          <p className="text-danger">
                                            {errors.rewards[index].rewardCount.message}
                                          </p>
                                        )}
                                      </CCol>
                                    </React.Fragment>
                                  )
                                })}
                              </CRow>
                            ))}
                          {errors.totalBucket && (
                            <p className="text-danger mt-3">{errors.totalBucket.message}</p>
                          )}
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>

                  {/* Colors & Design Card */}
                  <CRow className="mb-3">
                    <CCol xs="12">
                      <CCard className="shadow-sm">
                        <CCardHeader className="text-light">Colors & Design</CCardHeader>
                        <CCardBody className="mt-4">
                          <CRow className="g-3">
                            {[
                              {
                                label: 'Board Color',
                                color: backgroundColor,
                                type: 'background',
                              },
                              {
                                label: 'Obstacles Color',
                                color: dotobstaclesColor,
                                type: 'dotobstacles',
                              },
                              {
                                label: 'Side Obstacles Color',
                                color: sideobstaclesColor,
                                type: 'sideobstacles',
                              },
                              {
                                label: 'Ball Color',
                                color: ballColor,
                                type: 'ball',
                              },
                            ].map(({ label, color, type }) => (
                              <CCol key={type} xs="12" sm="6" md="3">
                                <div className="p-3 border rounded text-center">
                                  <CFormLabel className="fw-bold">{label}</CFormLabel>
                                  <div className="d-flex align-items-center justify-content-center mt-2">
                                    {/* The native color input styled as a rectangle */}
                                    <input
                                      type="color"
                                      value={color}
                                      onChange={(e) => handleColorChange(e.target.value, type)}
                                      style={{
                                        width: '60px',
                                        height: '30px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                      }}
                                    />
                                    {/* Color code text input beside the rectangle */}
                                    <input
                                      type="text"
                                      value={color}
                                      onChange={(e) => handleColorChange(e.target.value, type)}
                                      className="form-control text-center"
                                      style={{
                                        marginLeft: '8px',
                                        maxWidth: '120px',
                                      }}
                                    />
                                  </div>
                                </div>
                              </CCol>
                            ))}
                          </CRow>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                </CCardBody>
              </fieldset>
              <CCardFooter className="d-flex">
                {hasUpdatePermission && (
                  <>
                    <CustomButton
                      color="primary"
                      type="submit"
                      className="mt-0 btn-sm mr-2"
                      labelClass="ml-1"
                      text="Submit"
                      icon={<FaSave className="mb-1 mr-1" />}
                    />
                    {/* <CustomButton
                      color="secondary"
                      className="btn-sm mr-3"
                      onClick={handleReset}
                      labelClass="ml-1"
                      text="Reset"
                      icon={<GrPowerReset className="mb-1" />}
                    /> */}
                  </>
                )}
                <CustomButton
                  color="primary"
                  className="btn-sm"
                  onClick={() => setIsOpen(true)}
                  labelClass="ml-1"
                  text="Preview"
                />
              </CCardFooter>
            </CForm>
          </CCard>
        </CCol>
      </CRow>
      <Overlay
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        style={{ alignItems: 'center', marginTop: '500px' }}
      >
        <h1 style={{ alignSelf: 'center', textAlign: 'center' }}>Board Preview</h1>
        <PlinkoCanvas
          width={286}
          height={449}
          BackgroundColor={backgroundColor}
          DotobstaclesColor={dotobstaclesColor}
          SideobstaclesColor={sideobstaclesColor}
          BallColor={ballColor}
          Rewards={rewards}
          ArrowImage={arrowImage}
        />
      </Overlay>
    </>
  )
}
