import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInputGroup,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilEnvelopeClosed, cilLockLocked } from '@coreui/icons'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import FormInput from '../../../components/FormInput'
import CustomButton from '../../../components/Button'
import { loginSchema } from '../../../validation/auth-validation-schema'
import { loginUser } from '../../../helpers/apiRequest'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setAuth } from '../../../helpers/storageRequests'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    try {
      const result = await loginUser(data)
      if (result?.data?.status) {
        setAuth(result?.data?.data?.accessToken)
        dispatch({ type: 'SET_USER', user: result?.data?.data })
        toast.success(result?.data?.message)

        reset()
        navigate('/dashboard')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup>
                      <FormInput
                        {...register('email')}
                        placeholder="Enter email address"
                        autoComplete="email"
                        error={errors?.email?.message}
                        disabled={isSubmitting}
                        icon={<CIcon icon={cilEnvelopeClosed} />}
                        label={'Email'}
                      />
                    </CInputGroup>
                    <CInputGroup>
                      <FormInput
                        {...register('password')}
                        type="password"
                        placeholder="Enter password"
                        autoComplete="current-password"
                        icon={<CIcon icon={cilLockLocked} />}
                        error={errors?.password?.message}
                        label={'Password'}
                        disabled={isSubmitting}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CustomButton
                          disabled={isSubmitting}
                          type="submit"
                          className="px-4"
                          text={isSubmitting ? 'Loading...' : 'Login'}
                        />
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <Link to={'/forgot-password'}>
                          <CustomButton
                            color="link"
                            className="px-0 custom-hover-button"
                            text="Forgot password?"
                          />
                        </Link>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
