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
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaSave } from 'react-icons/fa'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import CustomButton from '../../../components/Button'
import FormInput from '../../../components/FormInput'
import { apiRequest } from '../../../helpers/apiRequest'
import { capitalize } from '../../../helpers/common-unitl'
import { titleConstants } from '../../../constant/titleConstant'

const AdminGroupEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [fields, setFields] = useState({
    admin_group_name: '',
    status: true,
    id: id,
  })
  const [modulePermission, setModulePermission] = useState({})
  const [error, setError] = useState('')

  const schema = Yup.object().shape({
    admin_group_name: Yup.string().required('Group name is required'),
  })

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      admin_group_name: '',
      status: true,
    },
  })

  useEffect(() => {
    fetchAdminGroupDetails()
  }, [id])

  const fetchAdminGroupDetails = async () => {
    try {
      const res = await apiRequest.getAdminGroupDetails(id)
      if (res.data.status === false) {
        toast.error(res.data.message)
      } else if (!res.data.data) {
        toast.error('Admin Group not found')
        navigate('/groups')
      } else {
        const { admin_group_name, status, permission } = res.data.data
        setFields({ ...fields, admin_group_name, status, id: res.data.data.id })
        setValue('admin_group_name', admin_group_name)
        setValue('status', status)
        setSystemModules(JSON.parse(permission) || {})
      }
    } catch (error) {
      console.error('Error admin groups:', error)
      toast.error('Failed to fetch admin group details')
    }
  }

  const setSystemModules = async (savedPermission = {}) => {
    try {
      const res = await apiRequest.getSystemModulesList()
      if (res.data.status === false) {
        toast.error(res.data.message)
      } else {
        let permissionModel = {}
        if (Array.isArray(res.data.data)) {
          res.data.data.forEach((module) => {
            permissionModel[module.module_name] = {}
            let moduleActions = JSON.parse(module.action) || []
            moduleActions.forEach((action) => {
              permissionModel[module.module_name][action] =
                savedPermission[module.module_name]?.includes(action) || false
            })
          })
        }
        setModulePermission(permissionModel)
      }
    } catch (error) {
      toast.error('Failed to fetch system modules')
    }
  }

  const permissionChange = useCallback((e) => {
    const { name } = e.target
    const [module, action] = name.split('___')

    setModulePermission((prevPermissions) => {
      const updatedPermissions = { ...prevPermissions }
      const currentModulePermissions = updatedPermissions[module] || {}

      if (!currentModulePermissions) {
        return updatedPermissions
      }

      const isCurrentlyChecked = currentModulePermissions[action]
      const newCheckedState = !isCurrentlyChecked

      // If the action is "view" and is being unchecked
      if (action === 'view' && !newCheckedState) {
        // Check if any other permissions (create, update, delete) are selected
        if (
          Object.keys(currentModulePermissions).some(
            (act) => act !== 'view' && currentModulePermissions[act],
          )
        ) {
          // Prevent unchecking "view" and show a toast notification
          toast.info('View action is required while other module actions are selected')
          return prevPermissions
        }
      } else if (action !== 'view' && newCheckedState) {
        // If a non-"view" permission is checked, ensure "view" is also checked
        currentModulePermissions['view'] = true
      }

      currentModulePermissions[action] = newCheckedState
      updatedPermissions[module] = currentModulePermissions
      return updatedPermissions
    })
  }, [])

  const onSubmit = async (data) => {
    try {
      let finalPermission = {}
      let hasSelectedPermission = false

      // Build the finalPermission object
      Object.keys(modulePermission).forEach((module) => {
        finalPermission[module] = []
        Object.keys(modulePermission[module] || {}).forEach((action) => {
          if (modulePermission[module][action]) {
            finalPermission[module].push(action)
            hasSelectedPermission = true
          }
        })
      })

      // Check if at least one permission is selected
      if (hasSelectedPermission) {
        const postVal = {
          admin_group_name: data.admin_group_name,
          status: data.status,
          permissions: finalPermission,
        }
        const res = await apiRequest.updateAdminGroup(fields.id, postVal)
        if (res.data.status === false) {
          toast.error(res.data.message)
        } else {
          toast.success(res.data.message)
          navigate('/groups')
        }
      } else {
        setError('At least one module permission must be selected.')
      }
    } catch (error) {
      console.error('Error admin groups:', error)
      toast.error('Failed to submit admin group details')
    }
  }

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader className="font-weight-bold h5">
            Edit Group
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
            <CRow className="d-flex">
              <div className="col-sm-4">
                <FormInput
                  {...register('admin_group_name')}
                  placeholder="Enter group name"
                  autoComplete="admin_group_name"
                  error={errors.admin_group_name?.message}
                  disabled={fields.admin_group_name === 'Super Users'}
                  label={'Group name'}
                />
              </div>
              <div className="col-sm-2"></div>
              <div className="col-sm-6">
                <CInputGroup className="row">
                  <CFormLabel htmlFor="select" className="col-form-label">
                    Status
                  </CFormLabel>
                  <CFormSwitch
                    name="status"
                    className="ml-07"
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
              <div className="form-group row" key={`module_permission_list_${moduleName}`}>
                <div className="col-md-2">
                  <label>
                    <strong>{capitalize(moduleName.replace('_', ' '))}</strong>
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
                      <label htmlFor={moduleName + '___' + key} className="form-check-label">
                        {capitalize(key.replace('_', ' '))}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {error && <small className="form-text text-danger">{error}</small>}
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
            />
            &nbsp;
            <Link aria-current="page" to="/groups">
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
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AdminGroupEdit
