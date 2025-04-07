import React, { useEffect, useState } from 'react'
import CustomButton from '../../../components/Button'
import CIcon from '@coreui/icons-react'
import { cilSave, cilX } from '@coreui/icons'
import { titleConstants } from '../../../constant/titleConstant'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { updateProfileSchema } from '../../../validation/profile-validation-schema'
import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CInputGroup,
  CRow,
} from '@coreui/react'
import { AUTH_KEY } from '../../../helpers/storageRequests'
import FormInput from '../../../components/FormInput'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { updateUserProfileData } from '../../../helpers/apiRequest'
import { FaSave } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'

const Profile = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(updateProfileSchema),
  })
  const [isReset, setIsReset] = useState(true)
  const token = localStorage.getItem(AUTH_KEY)
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.user)
  const navigate = useNavigate()

  // === Get data os logged in user if it is not in state === //
  const getUserData = async () => {
    try {
      const result = await getAdminProfileData()
      if (result?.data?.status) {
        dispatch({ type: 'SET_USER', user: result?.data?.data })
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  // ==== Submit function to update data of user ==== //
  const onSubmit = async (payload) => {
    let result
    try {
      const data = {
        name: payload.name,
        password: payload.password,
      }
      result = await updateUserProfileData(data)
      if (result?.data?.status) {
        toast.success(result?.data?.message)
        navigate('/dashboard')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  useEffect(() => {
    if (userData === null || userData === undefined) {
      getUserData()
    } else {
      setValue('email', userData.email)
      setValue('name', userData.name)
    }
  }, [userData, isReset])

  if (!token) {
    return <Navigate to={'/login'} />
  }
  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader className={'font-weight-bold h5'}>{titleConstants.PROFILE}</CCardHeader>
          <CForm onSubmit={handleSubmit(onSubmit)} className="admin-add">
            <CCardBody>
              <CInputGroup className="row">
                <div className="mb-1 col-sm-6">
                  <FormInput
                    {...register('name')}
                    placeholder="Enter name"
                    autoComplete="name"
                    error={errors?.name?.message}
                    disable={isSubmitting}
                    label={'Name'}
                  />
                </div>
                <div className="mb-1 col-sm-6">
                  <FormInput
                    readOnly
                    {...register('email')}
                    placeholder="Enter email"
                    label={'Email'}
                  />
                </div>
              </CInputGroup>
              <CInputGroup className="row">
                <div className="mb-1 col-sm-6">
                  <FormInput
                    {...register('password')}
                    type="password"
                    placeholder="New password"
                    autoComplete="new-password"
                    error={errors?.password?.message}
                    disabled={isSubmitting}
                    label={'Password'}
                  />
                </div>
                <div className="mb-1 col-sm-6">
                  <FormInput
                    {...register('confirmPassword')}
                    type="password"
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    error={errors?.confirmPassword?.message}
                    disabled={isSubmitting}
                    label={'Confirm Password'}
                  />
                </div>
              </CInputGroup>
            </CCardBody>
            <CCardFooter>
              <CustomButton
                color="primary"
                disabled={isSubmitting}
                type="submit"
                className="mt-1 btn-sm"
                labelClass={'ml-1'}
                text={
                  isSubmitting
                    ? titleConstants.BUTTON_SUBMITTING_TITLE
                    : titleConstants.BUTTON_SUBMIT_TITLE
                }
                icon={<FaSave className="mb-1 mr-1" />}
              />
              &nbsp;
              <Link aria-current="page" to="/dashboard">
                <CustomButton
                  color="danger"
                  className="mt-1 btn-sm"
                  text="Cancel"
                  disabled={isSubmitting}
                  labelClass={'ml-1'}
                  icon={<IoClose className="mb-1 mr-1" size={'16px'} />}
                />
              </Link>
            </CCardFooter>
          </CForm>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Profile
