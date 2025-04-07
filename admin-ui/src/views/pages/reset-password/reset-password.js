import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CCard, CCardBody, CCol, CContainer, CForm, CRow } from '@coreui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import FormInput from '../../../components/FormInput'
import CustomButton from '../../../components/Button'
import { resetPasswordSchema } from '../../../validation/auth-validation-schema'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import { AdminResetPassword } from '../../../helpers/apiRequest'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const navigate = useNavigate()
  const { token } = useParams()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  })

  const onSubmit = async (data) => {
    try {
      const payload = {
        token,
        newPassword: data?.confirmPassword,
      }
      const result = await AdminResetPassword(payload)
      if (result?.data?.status) {
        navigate('/login')
        reset()
        toast.success(result?.data?.message)
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
                  <h1 className="text-center mb-4">Reset Password</h1>
                  <p className="text-medium-emphasis text-center mb-4">
                    Enter your new password below
                  </p>
                  <FormInput
                    {...register('password')}
                    type="password"
                    icon={<CIcon icon={cilLockLocked} />}
                    placeholder="New Password"
                    autoComplete="new-password"
                    error={errors?.password?.message}
                    disabled={isSubmitting}
                  />
                  <div className="mt-4">
                    <FormInput
                      {...register('confirmPassword')}
                      type="password"
                      icon={<CIcon icon={cilLockLocked} />}
                      placeholder="Confirm New Password"
                      autoComplete="new-password"
                      error={errors?.confirmPassword?.message}
                      disabled={isSubmitting}
                    />
                  </div>

                  <CRow className="mt-4">
                    <CCol xs={12}>
                      <CustomButton
                        disabled={isSubmitting}
                        type="submit"
                        color="primary"
                        className="px-4 w-100"
                        text={isSubmitting ? 'Resetting...' : 'Reset Password'}
                      />
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

export default ResetPassword
