import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CFormLabel,
  CFormSwitch,
  CInputGroup,
  CRow,
} from '@coreui/react'
import { yupResolver } from '@hookform/resolvers/yup' // Import yupResolver
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaSave } from 'react-icons/fa'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import CustomButton from '../../../components/Button'
import FormInput from '../../../components/FormInput'
import { apiRequest } from '../../../helpers/apiRequest'
import { capitalize } from '../../../helpers/common-unitl'
import { titleConstants } from '../../../constant/titleConstant'

const AdminGroupAdd = () => {
  const [modulePermission, setModulePermission] = useState({})
  const navigate = useNavigate()

  // Fetch module permissions on component mount
  useEffect(() => {
    getAdminGroupList()
  }, [])

  const schema = Yup.object().shape({
    admin_group_name: Yup.string().required('Group name is required'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema), // Use yupResolver
    defaultValues: {
      admin_group_name: '',
      status: true,
      permissions: modulePermission,
    },
  })
  const getAdminGroupList = async () => {
    try {
      let response = await apiRequest.getSystemModulesList()
      if (response.data.status === false) {
        toast.error(response.data.message)
      } else {
        const permissionModel = response.data.data.reduce((acc, value) => {
          const actions = JSON.parse(value.action)
          acc[value.module_name] = actions.reduce((obj, innerValue) => {
            obj[innerValue] = false
            return obj
          }, {})
          return acc
        }, {})
        setModulePermission(permissionModel)
      }
    } catch (error) {
      console.error('Error fetching admin groups:', error)
      toast.error('Something went wrong!')
    }
  }
  const permissionChange = (e) => {
    const { name, value, checked } = e.target
    const [action] = name.split('___')
    const updatedPermissions = { ...modulePermission }
    const permissionVal = { ...updatedPermissions[action] }

    // Update the permission value based on the checkbox state
    permissionVal[value] = checked

    // Determine if 'view' needs to be checked or unchecked
    const anyOtherPermissionSelected = Object.keys(permissionVal).some(
      (key) => key !== 'view' && permissionVal[key],
    )

    if (anyOtherPermissionSelected) {
      // Ensure 'view' is enabled if any other permission is selected
      permissionVal['view'] = true
    } else if (value === 'view' && !checked) {
      // Allow 'view' to be unchecked only if no other permissions are selected
      permissionVal['view'] = false
    }

    // Update state with new permissions
    updatedPermissions[action] = permissionVal
    setModulePermission(updatedPermissions)

    // Optional: Provide feedback if 'view' is selected while other permissions are present
    if (anyOtherPermissionSelected && value === 'view') {
      toast.info('View action is required while other module actions are selected')
    }
  }

  const onSubmit = async (data) => {
    try {
      const finalPermission = Object.keys(modulePermission).reduce((acc, key) => {
        const permissions = Object.keys(modulePermission[key]).filter(
          (innerKey) => modulePermission[key][innerKey],
        )
        if (permissions.length > 0) {
          acc[key] = permissions
        }
        return acc
      }, {})

      if (Object.keys(finalPermission).length === 0) {
        toast.error('At least one module permission is required')
        return
      }

      const payload = {
        ...data,
        permissions: finalPermission,
      }
      let response = await apiRequest.createAdminGroup(payload)
      if (response.data.status === false) {
        toast.error(response.data.message)
      } else {
        toast.success(response.data.message)
        navigate('/groups')
      }
    } catch (error) {
      console.error('Error fetching admin groups:', error)
      toast.error('Something went wrong!')
    }
  }

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader className="font-weight-bold h5">
            Add Group
            <div className="card-header-actions">
              <Link to="/groups">
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
          <CCardBody>
            <CRow>
              <div className="col-sm-4">
                <FormInput
                  {...register('admin_group_name')}
                  placeholder="Enter group name"
                  autoComplete="admin_group_name"
                  error={errors.admin_group_name?.message}
                  disabled={isSubmitting}
                  label={'Group name'}
                />
              </div>
              <div className="col-sm-2" id="admin_group_add"></div>
              <div className="col-sm-6" id="admin_group_add">
                <CInputGroup className="row">
                  <CFormLabel htmlFor="select" className="col-form-label">
                    Status
                  </CFormLabel>
                  <CFormSwitch
                    name="status"
                    className="ml-07"
                    id="admin_group_add"
                    color="primary"
                    {...register('status')}
                  />
                </CInputGroup>
              </div>
            </CRow>
            <div className="form-group">
              <span className="h6">Module permissions</span>
              <hr />
            </div>

            {Object.keys(modulePermission).map((moduleName) => (
              <div
                className="form-group row"
                id="admin_group_add"
                key={`module_permission_list_${moduleName}`}
              >
                <div className="col-md-2">
                  <label>
                    <span className="h6">{capitalize(moduleName.replace('_', ' '))}</span>
                  </label>
                </div>
                <div className="col-md-9">
                  {Object.entries(modulePermission[moduleName]).map(([key, item]) => (
                    <div className="form-check form-check-inline" key={moduleName + key}>
                      <input
                        type="checkbox"
                        id={moduleName + '___' + key}
                        name={moduleName + '___' + key}
                        value={key}
                        className="form-check-input"
                        checked={item}
                        onChange={permissionChange}
                      />
                      <label
                        htmlFor={moduleName + '___' + key}
                        className="form-check-label"
                        id="admin_group_add"
                      >
                        {capitalize(key.replace('_', ' '))}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <small className="form-text text-danger module_permission" id="admin_group_add"></small>
            <div className="mb-1 col-sm-6" id="admin_group_add"></div>
          </CCardBody>
          <CCardFooter>
            <CustomButton
              color="primary"
              className="mt-1 btn-sm"
              type="button"
              text={
                isSubmitting
                  ? titleConstants.BUTTON_SUBMITTING_TITLE
                  : titleConstants.BUTTON_SUBMIT_TITLE
              }
              disabled={isSubmitting}
              labelClass={'ml-1'}
              onClick={handleSubmit(onSubmit)}
              icon={<FaSave className="mb-1 mr-1" />}
              id="admin_group_add"
            />
            &nbsp;
            <Link aria-current="page" to="/groups" id="admin_group_add">
              <CustomButton
                color="danger"
                className="mt-1 btn-sm"
                text="Cancel"
                disabled={isSubmitting}
                labelClass={'ml-1'}
                icon={<IoClose className="mb-1 mr-1" size={'16px'} />}
                id="admin_group_add"
              />
            </Link>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AdminGroupAdd
