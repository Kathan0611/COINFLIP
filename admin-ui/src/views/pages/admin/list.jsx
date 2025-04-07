import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormSwitch,
  CInputGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import React, { useEffect, useMemo, useState } from 'react'
import { FaPlus, FaSearch, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
import { FaPencil } from 'react-icons/fa6'
import { GrPowerReset } from 'react-icons/gr'
import { IoClose } from 'react-icons/io5'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import CustomButton from '../../../components/Button'
import CustomSelect from '../../../components/CustomSelect'
import FormInput from '../../../components/FormInput'
import Pagination from '../../../components/Pagination'
import { showToastr } from '../../../components/ToastrNotification'
import { statusHeader } from '../../../constant/htmlConstant'
import { titleConstants } from '../../../constant/titleConstant'
import {
  changeAdminStatus,
  deleteAdminData,
  getAdminDataList,
  getAdminGroupData,
} from '../../../helpers/apiRequest'
import {
  createListSerialNo,
  isLoggedUserDataOwner,
  useCanAccess,
} from '../../../helpers/common-unitl'
const AdminManagement = () => {
  const [fields, setFields] = useState({
    sort_dir: 'desc',
    sort_field: 'id',
    email: '',
    name: '',
    admin_group_id: '',
    page_no: 1,
  })
  const [isReset, setIsReset] = useState(true)
  const [adminGroups, setAdminGroups] = useState([])
  const [adminDataLists, setAdminDataLists] = useState([])
  const [openPopup, setOpenPopup] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)
  const canAccess = useCanAccess()
  // === Get logged user data from state === //
  const userData = useSelector((state) => state.user)

  // ==== Get admin group data for dropdown ==== //
  const getAdminGroups = async () => {
    const response = await getAdminGroupData()
    if (response?.data?.status) {
      setAdminGroups(response?.data?.data)
    }
  }
  // === Pagination function === //
  const handlePageChange = (newPage) => {
    setPage(newPage)
    setFields({ ...fields, page_no: newPage })
  }
  // === Open modal for delete === //
  const openDeletePopup = (id, visible) => {
    setDeleteId(id)
    setOpenPopup(!visible)
  }
  // === Close modal for delete === //
  const closeDeletePopup = () => {
    setOpenPopup(false)
    setDeleteId(null)
  }
  // === Set sorting column and it's sorting order === //
  const handleAdminColumnSort = (fieldName) => {
    setFields((prevFields) => ({
      ...prevFields,
      sort_dir: prevFields.sort_dir === 'asc' ? 'desc' : 'asc',
      sort_field: fieldName,
    }))
  }
  // === For serach set the name, email value === //
  const handleChange = (e) => {
    const { name, value } = e.target
    setPage(1)
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
      page_no: 1,
    }))
  }
  // === Admin group change handle function === //
  const handleAdminGroupChange = (value) => {
    setFields({ ...fields, admin_group_id: value })
  }
  // === Reset function === //
  const handleReset = () => {
    setIsReset(!isReset)
    setPage(1)
    setFields({
      sort_dir: 'desc',
      sort_field: 'id',
      email: '',
      name: '',
      admin_group_id: '',
      page_no: 1,
    })
  }
  // === Get list of admins === //
  const getLists = async () => {
    try {
      const response = await getAdminDataList(fields)
      if (response?.data?.status) {
        const dataResult = response?.data?.data
        setAdminDataLists(dataResult?.result)
        setPagination({
          current: dataResult?.page,
          totalPage: dataResult?.totalPage,
          totalRecords: dataResult?.totalRecords,
        })
      } else {
        showToastr(response?.data?.message ?? 'Someting went wrong', 'error')
      }
    } catch (error) {
      showToastr(error?.response?.data?.message ?? 'Failed to get admin list data', 'error')
    }
  }
  // === Change status of admin === //
  const changeAdminStatusData = async (statusValue, id) => {
    try {
      const response = await changeAdminStatus(id, { status: statusValue })
      if (response?.data?.status) {
        showToastr(response?.data?.message, 'success', getLists())
      } else {
        showToastr(response?.data?.message ?? 'Someting went wrong', 'error')
      }
    } catch (error) {
      showToastr(error?.response?.data?.message ?? 'Failed to change admin status data', 'error')
    }
  }
  // === Delete data of admin === //
  const deleteAdmin = async () => {
    try {
      setOpenPopup(false)
      const response = await deleteAdminData(deleteId)
      if (response?.data?.status) {
        showToastr(response?.data?.message ?? 'Admin data deleted successfully.', 'success')
      } else {
        showToastr(response?.data?.message ?? 'Someting went wrong', 'error')
      }
    } catch (error) {
      showToastr(error?.response?.data?.message ?? 'Failed to delete admin', 'success')
    } finally {
      setOpenPopup(false)
    }
  }
  useMemo(() => {
    getAdminGroups()
  }, [])
  useEffect(() => {
    getLists()
  }, [page, fields.sort_dir, fields.sort_field, fields.admin_group_id, isReset])
  return (
    <>
      <CRow>
        <CCol xl={12}>
          <CCard className="admin-lists">
            <CCardHeader className={'font-weight-bold h5'}>
              {titleConstants.ADMIN_LIST_TITLE}
              <div className={'card-header-actions'}>
                {canAccess('admins', 'create') && (
                  <Link to="/admins/add">
                    <CustomButton
                      color="primary"
                      active
                      tabIndex={-1}
                      className="btn-sm"
                      labelClass={'ml-1'}
                      text="Add"
                      icon={<FaPlus className="mb-1 mr-1" />}
                    />
                  </Link>
                )}
              </div>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-1">
                <CInputGroup className="row">
                  <CCol xl={3}>
                    <FormInput
                      id="email"
                      placeholder="Search email"
                      name="email"
                      value={fields.email}
                      onChange={handleChange}
                      onBlur={getLists}
                      onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                          getLists()
                        }
                      }}
                      style={{ lineHeight: '17px' }}
                    />
                  </CCol>
                  <CCol xl={3}>
                    <FormInput
                      id="name"
                      placeholder="Search name"
                      name="name"
                      value={fields.name}
                      onChange={handleChange}
                      onBlur={getLists}
                      onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                          getLists()
                        }
                      }}
                      style={{ lineHeight: '17px' }}
                    />
                  </CCol>
                  <CCol xl={3}>
                    <CustomSelect
                      name="admin_group_id"
                      value={fields.admin_group_id}
                      onChange={handleAdminGroupChange}
                      options={adminGroups}
                      placeholder="Select an admin group"
                      isMulti={false}
                    />
                  </CCol>
                  <CCol xl={3}>
                    <CustomButton
                      type={'submit'}
                      color="primary"
                      className="btn-sm mr-2"
                      onClick={getLists}
                      labelClass={'ml-1'}
                      text="Search"
                      icon={<FaSearch className="mb-1" />}
                    />
                    <CustomButton
                      color="secondary"
                      className="btn-sm"
                      onClick={handleReset}
                      labelClass={'ml-1'}
                      text="Reset"
                      icon={<GrPowerReset className="mb-1" />}
                    />
                  </CCol>
                </CInputGroup>
              </CRow>
              <div className="position-relative table-responsive">
                <table className="table without-table-action">
                  <thead>
                    <tr>
                      <th width="10%">#</th>
                      <th onClick={() => handleAdminColumnSort('name')}>
                        <span className="sortCls">
                          <span className="table-header-text-mrg">Name</span>
                          {fields.sort_field !== 'name' && adminDataLists.length > 0 && <FaSort />}
                          {fields.sort_dir === 'asc' &&
                            fields.sort_field === 'name' &&
                            adminDataLists.length > 0 && <FaSortUp />}
                          {fields.sort_dir === 'desc' &&
                            fields.sort_field === 'name' &&
                            adminDataLists.length > 0 && <FaSortDown />}
                        </span>
                      </th>
                      <th onClick={() => handleAdminColumnSort('email')}>
                        <span className="sortCls">
                          <span className="table-header-text-mrg">Email</span>
                          {fields.sort_field !== 'email' && adminDataLists.length > 0 && <FaSort />}
                          {fields.sort_dir === 'asc' &&
                            fields.sort_field === 'email' &&
                            adminDataLists.length > 0 && <FaSortUp />}
                          {fields.sort_dir === 'desc' &&
                            fields.sort_field === 'email' &&
                            adminDataLists.length > 0 && <FaSortDown />}
                        </span>
                      </th>
                      <th
                        onClick={() => handleAdminColumnSort('group_name')}
                        style={{ textAlign: 'center' }}
                      >
                        <span className="sortCls">
                          <span className="table-header-text-mrg">Group</span>
                          {fields.sort_field !== 'group_name' && adminDataLists.length > 0 && (
                            <FaSort />
                          )}
                          {fields.sort_dir === 'asc' &&
                            fields.sort_field === 'group_name' &&
                            adminDataLists.length > 0 && <FaSortUp />}
                          {fields.sort_dir === 'desc' &&
                            fields.sort_field === 'group_name' &&
                            adminDataLists.length > 0 && <FaSortDown />}
                        </span>
                      </th>
                      <th
                        onClick={() => handleAdminColumnSort('status')}
                        width="10%"
                        style={{ textAlign: 'center' }}
                      >
                        {statusHeader(fields, adminDataLists)}
                      </th>
                      {(canAccess('admins', 'update') || canAccess('admins', 'delete')) && (
                        <th width="10%" style={{ textAlign: 'center' }}>
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {adminDataLists.length > 0 ? (
                      adminDataLists.map((adminData, index) => (
                        <tr key={adminData.id + '_' + adminData.email}>
                          <td>{createListSerialNo(page, index)}</td>
                          <td>{adminData.name}</td>
                          <td>{adminData.email}</td>
                          <td>{adminData.admin_group.admin_group_name}</td>
                          {!isLoggedUserDataOwner(userData, adminData.id) ? (
                            <>
                              <td style={{ textAlign: 'center' }}>
                                <CFormSwitch
                                  name="status"
                                  className="mr-1"
                                  color="primary"
                                  size="md"
                                  checked={adminData.status}
                                  onChange={() =>
                                    changeAdminStatusData(!adminData.status, adminData.id)
                                  }
                                  disabled={!canAccess('admins', 'update')}
                                />
                              </td>
                              {(canAccess('admins', 'update') || canAccess('admins', 'delete')) && (
                                <td style={{ textAlign: 'center' }}>
                                  {canAccess('admins', 'update') && (
                                    <Link to={`/admins/edit/${adminData.id}`}>
                                      <CustomButton
                                        color="primary"
                                        className="ml-1 btn-sm"
                                        isToolTip={true}
                                        size="sm"
                                        toolTipContent={titleConstants.ADMIN_EDIT_TITLE}
                                        text={<FaPencil size={'13px'} />}
                                      />
                                    </Link>
                                  )}
                                  {canAccess('admins', 'delete') && (
                                    <CustomButton
                                      color="danger"
                                      className="ml-1 btn-sm"
                                      isToolTip={true}
                                      size="sm"
                                      toolTipContent={titleConstants.ADMIN_DELETE_TITLE}
                                      text={<RiDeleteBin6Line size={'13px'} />}
                                      onClick={() => openDeletePopup(adminData.id)}
                                    />
                                  )}
                                </td>
                              )}
                            </>
                          ) : (
                            <>
                              <td></td>
                              <td></td>
                            </>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center' }}>
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {pagination && adminDataLists.length > 0 && (
                  <Pagination
                    page={pagination.current}
                    fields={pagination}
                    handlePageChange={handlePageChange}
                  />
                )}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* Modal for Deleting an admin */}
      <CModal visible={openPopup} onClose={closeDeletePopup} size="md" color="danger">
        <CModalHeader closeButton>
          <CModalTitle>Delete admin</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <span>Are you sure you want to delete this admin? </span>
        </CModalBody>
        <CModalFooter>
          <CustomButton
            color="danger"
            className="btn-sm d-flex align-items-center "
            isToolTip={true}
            toolTipContent={titleConstants.ADMIN_DELETE_TITLE}
            text="Yes, delete it."
            labelClass="ml-1"
            icon={<RiDeleteBin6Line />}
            onClick={deleteAdmin}
          />
          <CustomButton
            color="secondary"
            className="btn-sm d-flex align-items-center "
            isToolTip={true}
            text="Cancel"
            labelClass="ml-1"
            toolTipContent={'Cancel'}
            icon={<IoClose />}
            onClick={closeDeletePopup}
          />
        </CModalFooter>
      </CModal>
    </>
  )
}

export default AdminManagement
