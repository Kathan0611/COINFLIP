import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CCard, CCardBody, CCol, CContainer, CForm, CRow } from '@coreui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import FormInput from '../../../components/FormInput'
import CustomButton from '../../../components/Button'
import { forgotPasswordSchema } from '../../../validation/auth-validation-schema'
import CIcon from '@coreui/icons-react'
import { cilEnvelopeClosed } from '@coreui/icons'
import { AdminForgotPassword } from '../../../helpers/apiRequest'
import { toast } from 'react-toastify'

const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data) => {
    try {
      const result = await AdminForgotPassword(data)
      if (result?.data?.status) {
        toast.success(result?.data?.message)
        navigate('/login')

        reset()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} lg={6} xl={5}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <h1 className="text-center mb-4">Forgot Password</h1>
                  <p className="text-medium-emphasis text-center mb-4">
                    Enter your email address and we'll send you instructions to reset your password.
                  </p>
                  <FormInput
                    {...register('email')}
                    icon={<CIcon icon={cilEnvelopeClosed} />}
                    placeholder="johndoe@gmail.com"
                    autoComplete="email"
                    error={errors?.email?.message}
                    disabled={isSubmitting}
                  />
                  <CRow className="mt-4">
                    <CCol xs={12}>
                      <CustomButton
                        disabled={isSubmitting}
                        type="submit"
                        color="primary"
                        className="px-4 w-100"
                        text={isSubmitting ? 'Sending...' : 'Send Reset Link'}
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mt-4">
                    <CCol xs={12} className="text-center">
                      <Link to="/login">Back to Login</Link>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ForgotPasswordPage
