import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormLabel,
  CFormSwitch,
  CInputGroup,
  CRow,
} from '@coreui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FaSave } from 'react-icons/fa'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CustomButton from '../../../components/Button'
import CustomSelect from '../../../components/CustomSelect'
import FormInput from '../../../components/FormInput'
import { showToastr } from '../../../components/ToastrNotification'
import { titleConstants } from '../../../constant/titleConstant'
import {
  createNewAdmin,
  getAdminData,
  getAdminGroupData,
  updateAdminData,
} from '../../../helpers/apiRequest'
import { isLoggedUserDataOwner } from '../../../helpers/common-unitl'
import { createAdminSchema } from '../../../validation/admin-validation-schema'
const AdminCreateEdit = () => {
  const [adminGroups, setAdminGroups] = useState([])
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(createAdminSchema),
  })
  // === Get userdata and check is it logged in user's or not
  const userData = useSelector((state) => state.user)
  if (id && isLoggedUserDataOwner(userData, id)) {
    showToastr('You are not authorized to access this page.', 'warning', navigate('/admin'))
  }
  // ==== Submit function to create and update data of admin ==== //
  const onSubmit = async (payload) => {
    let result
    try {
      if (id) {
        result = await updateAdminData(id, payload)
      } else {
        result = await createNewAdmin(payload)
      }
      if (result?.data?.status) {
        showToastr(result?.data?.message, 'success')
        navigate('/admins')
        reset()
      }
    } catch (error) {
      showToastr(error?.result?.data?.message, 'error')
    }
  }
  // ==== Get admin group data for dropdown ==== //
  const getAdminGroups = async () => {
    const response = await getAdminGroupData()
    if (response?.data?.status) {
      setAdminGroups(response?.data?.data)
    }
  }
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getAdminData(id)
        if (result?.data?.status) {
          const adminData = result.data.data
          // Use setValue to populate form fields
          setValue('status', adminData.status)
          setValue('name', adminData.name)
          setValue('email', adminData.email)
          setValue('admin_group_id', adminData.admin_group_id)
        }
      } catch (error) {
        showToastr('Failed to load admin data.', 'error')
      }
    }
    if (id) {
      fetchData()
    }
    getAdminGroups()
  }, [id, setValue])

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader className={'font-weight-bold h5'}>
            {id ? titleConstants.ADMIN_EDIT_TITLE : titleConstants.ADMIN_ADD_TITLE}
            <div className="card-header-actions">
              <Link to="/admins">
                <CustomButton
                  color="danger"
                  className="btn-sm"
                  labelClass={'ml-2'}
                  text="Back"
                  icon={<FaArrowLeftLong className="mb-1" />}
                />
              </Link>
            </div>
          </CCardHeader>

          <CForm onSubmit={handleSubmit(onSubmit)} className="admin-add">
            <CCardBody>
              <CInputGroup className="row">
                <div className="mb-1 col-sm-4">
                  <FormInput
                    {...register('name')}
                    placeholder="Enter name"
                    autoComplete="name"
                    error={errors?.name?.message}
                    disable={isSubmitting}
                    label={'Name'}
                  />
                </div>
                <div className="mb-1 col-sm-4">
                  <FormInput
                    {...register('email')}
                    placeholder="Enter email address"
                    autoComplete="email"
                    error={errors?.email?.message}
                    disable={isSubmitting}
                    label={'Email'}
                  />
                </div>
                <div className="mb-1 col-sm-4">
                  <CFormLabel htmlFor="nf-email" className=" col-form-label">
                    Admin groups
                  </CFormLabel>
                  <Controller
                    name="admin_group_id"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CustomSelect
                        {...register('admin_group_id', { valueAsNumber: true })}
                        name="admin_group_id"
                        options={adminGroups}
                        value={value}
                        onChange={onChange}
                        placeholder="Select an admin group"
                        error={errors?.admin_group_id?.message}
                        isMulti={false}
                      />
                    )}
                  />
                </div>
              </CInputGroup>
              <CInputGroup className="row">
                <div className="mb-1 col-sm-4">
                  <CFormLabel htmlFor="select" className="col-form-label">
                    Status
                  </CFormLabel>
                  <CFormSwitch
                    name="status"
                    className="mr-1"
                    color="primary"
                    {...register('status')}
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
              <Link aria-current="page" to="/admins">
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

export default AdminCreateEdit
