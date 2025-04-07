import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSwitch,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CPagination,
  CPaginationItem,
  CRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { FaPlus, FaSearch, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
import { FaPencil } from 'react-icons/fa6'
import { GrPowerReset } from 'react-icons/gr'
import { IoClose } from 'react-icons/io5'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import CustomButton from '../../../components/Button'
import { statusHeader } from '../../../constant/htmlConstant'
import { titleConstants } from '../../../constant/titleConstant'
import { apiRequest } from '../../../helpers/apiRequest'
import {
  createListSerialNo,
  isLoggedAdminGroupDataOwner,
  isLoggedUserDataOwner,
  useCanAccess,
} from '../../../helpers/common-unitl'
import { useSelector } from 'react-redux'

const AdminGroupsIndex = () => {
  const [fields, setFields] = useState({
    pageNo: 1,
    sort_dir: 'DESC',
    sort_field: 'id',
    search_group_name: '',
    totalPage: 1,
  })
  const [adminGroupList, setAdminGroupList] = useState([])
  const [openPopup, setOpenPopup] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [page, setPage] = useState(1)
  const canAccess = useCanAccess()
  const userData = useSelector((state) => state.user)
  useEffect(() => {
    getAdminGroupsList(fields.pageNo)
  }, [fields.pageNo, fields.sort_dir, fields.sort_field, fields.search_group_name, page])

  const getAdminGroupsList = async (page) => {
    try {
      const payload = {
        page: page,
        orderBy: fields.sort_dir,
        sortBy: fields.sort_field,
        search_group_name: fields.search_group_name,
      }
      const response = await apiRequest.adminGroupList(payload)
      if (response.data.status) {
        setAdminGroupList(response.data.data.result)
        setFields((prevFields) => ({
          ...prevFields,
          totalPage: response.data.data.totalPage,
        }))
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const handleAdminGroupColumnSort = (fieldName) => {
    setFields((prevFields) => ({
      ...prevFields,
      sort_dir: prevFields.sort_dir === 'ASC' ? 'DESC' : 'ASC',
      sort_field: fieldName,
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setPage(1)
    setFields((prevFields) => ({
      ...prevFields,
      pageNo: 1,
      [name]: value,
    }))
  }

  const handleSearch = (type) => {
    if (type === 'reset') {
      setFields({
        pageNo: 1,
        sort_dir: 'DESC',
        sort_field: 'id',
        search_group_name: '',
        totalPage: 1,
      })
      setPage(1)
    } else {
      setPage(1)
      setFields((prevFields) => ({
        ...prevFields,
        pageNo: 1,
      }))
    }
  }

  const openDeletePopup = (id) => {
    setDeleteId(id)
    setOpenPopup(true)
  }

  const closeDeletePopup = () => {
    setOpenPopup(false)
    setDeleteId(null)
  }

  const deleteUser = async () => {
    try {
      setOpenPopup(false)
      const response = await apiRequest.deleteAdminGroup(deleteId)
      if (response.data.status === 'error') {
        toast.error(response.data.message)
      } else {
        toast.success(response.data.message)
        getAdminGroupsList(fields.pageNo)
      }
    } catch (error) {
      console.error('Error fetching admin groups:', error)
      toast.error('Failed to delete admin group')
    }
  }

  const AdminGroupStatusChangedHandler = async (userGroupId, currentStatus) => {
    try {
      const response = await apiRequest.changeAdminGroupStatus(userGroupId, {
        status: !currentStatus,
      })
      if (response.data.status === 'error') {
        toast.error(response.data.message)
      } else {
        toast.success(response.data.message)
        getAdminGroupsList(fields.pageNo)
      }
    } catch (error) {
      toast.error('Failed to change status')
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1) newPage = 1
    if (newPage > fields.totalPage) newPage = fields.totalPage
    setPage(newPage)
    setFields((prevFields) => ({
      ...prevFields,
      pageNo: newPage,
    }))
  }

  return (
    <>
      <CRow>
        <CCol xl={12}>
          <CCard>
            <CCardHeader className="font-weight-bold h5">
              {titleConstants.ADMIN_GROUP_LIST}
              <div className="card-header-actions">
                {canAccess('admin_groups', 'create') && (
                  <Link to={'/groups/add'}>
                    <CustomButton
                      color="primary"
                      active
                      tabIndex={-1}
                      className="me-2 btn-sm"
                      labelClass={'ml-1'}
                      text="Add"
                      icon={<FaPlus className="mb-1 mr-1" />}
                    />
                  </Link>
                )}
              </div>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-4 custom-bottom-boder">
                <CCol xl={3}>
                  <CFormInput
                    id="name"
                    placeholder="Search group name"
                    name="search_group_name"
                    value={fields.search_group_name}
                    onChange={handleChange}
                    onBlur={() => handleSearch()}
                    onKeyPress={(event) => {
                      if (event.key === 'Enter') {
                        handleSearch('search')
                      }
                    }}
                    style={{ lineHeight: '17px' }}
                  />
                </CCol>
                <CCol xl={3}>
                  <CustomButton
                    type={'submit'}
                    color="primary"
                    className="btn-sm mr-2"
                    onClick={() => handleSearch('search')}
                    labelClass={'ml-1'}
                    text="Search"
                    icon={<FaSearch className="mb-1" />}
                  />
                  <CustomButton
                    color="secondary"
                    className="btn-sm"
                    onClick={() => handleSearch('reset')}
                    labelClass={'ml-1'}
                    text="Reset"
                    icon={<GrPowerReset className="mb-1" />}
                  />
                </CCol>
              </CRow>
              <div className="position-relative table-responsive">
                <table className="table without-table-action">
                  <thead>
                    <tr>
                      <th width="10%">#</th>
                      <th
                        onClick={() => handleAdminGroupColumnSort('admin_group_name')}
                        width="70%"
                      >
                        <span className="sortCls">
                          <span className="table-header-text-mrg">Group Name</span>
                          {fields.sort_field !== 'admin_group_name' &&
                            adminGroupList?.length > 0 && <FaSort />}
                          {fields.sort_dir === 'ASC' &&
                            fields.sort_field === 'admin_group_name' &&
                            adminGroupList?.length > 0 && <FaSortUp />}
                          {fields.sort_dir === 'DESC' &&
                            fields.sort_field === 'admin_group_name' &&
                            adminGroupList?.length > 0 && <FaSortDown />}
                        </span>
                      </th>
                      <th
                        onClick={() => handleAdminGroupColumnSort('status')}
                        width="10%"
                        style={{ textAlign: 'center' }}
                      >
                        {statusHeader(fields, adminGroupList)}
                      </th>
                      {(canAccess('admin_groups', 'update') ||
                        canAccess('admin_groups', 'delete')) && (
                        <>
                          <th width="10%" style={{ textAlign: 'center' }}>
                            Action
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {adminGroupList?.length > 0 ? (
                      adminGroupList?.map((u, index) => (
                        <tr key={u.id}>
                          <td>{createListSerialNo(page, index)}</td>
                          <td>{u.admin_group_name}</td>

                          {!isLoggedAdminGroupDataOwner(userData, u.id) ? (
                            <>
                              <td style={{ textAlign: 'center' }}>
                                <CFormSwitch
                                  id="status"
                                  type="checkbox"
                                  name="status"
                                  checked={u.status}
                                  onChange={() => AdminGroupStatusChangedHandler(u.id, u.status)}
                                  disabled={!canAccess('admin_groups', 'update')}
                                />
                              </td>
                              {(canAccess('admin_groups', 'update') ||
                                canAccess('admin_groups', 'delete')) && (
                                <td style={{ textAlign: 'center' }}>
                                  {canAccess('admin_groups', 'update') && (
                                    <Link to={`/groups/edit/${u.id}`}>
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
                                  {canAccess('admin_groups', 'delete') && (
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
                          {/* {(canAccess('admin_groups', 'update') ||
                            canAccess('admin_groups', 'delete')) && (
                            <td style={{ textAlign: 'center' }}>
                              {canAccess('admin_groups', 'update') && (
                                <Link to={`/groups/edit/${u.id}`}>
                                  <CustomButton
                                    color="primary"
                                    size="sm"
                                    className="ml-1 btn-sm"
                                    isToolTip={true}
                                    toolTipContent={titleConstants.ADMIN_GROUP_EDIT_TITLE}
                                    text={<FaPencil size={'13px'} />}
                                  />
                                </Link>
                              )}
                              {canAccess('admin_groups', 'delete') && (
                                <CustomButton
                                  onClick={() => openDeletePopup(u?.id)}
                                  color="danger"
                                  size="sm"
                                  className="ml-1 btn-sm"
                                  isToolTip={true}
                                  toolTipContent={titleConstants.ADMIN_GROUP_DELETE_TITLE}
                                  text={<RiDeleteBin6Line size={'13px'} />}
                                />
                              )}
                            </td>
                          )} */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {adminGroupList.length > 0 && (
                <CPagination align="end" aria-label="Page navigation example" className="mt-3">
                  <CPaginationItem
                    aria-label="Previous"
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    &laquo;
                  </CPaginationItem>
                  {Array.from({ length: fields.totalPage }, (_, index) => (
                    <CPaginationItem
                      key={index + 1}
                      active={index + 1 === page}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    aria-label="Next"
                    disabled={page === fields.totalPage}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    &raquo;
                  </CPaginationItem>
                </CPagination>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={openPopup} onClose={closeDeletePopup} backdrop="static">
        <CModalHeader>
          <CModalTitle>Delete Group</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this group?</CModalBody>
        <CModalFooter>
          <CustomButton
            color="danger"
            className="btn-sm d-flex align-items-center "
            onClick={deleteUser}
            labelClass={'ml-1'}
            text="Yes, delete it."
            icon={<RiDeleteBin6Line />}
          />
          <CustomButton
            color="secondary"
            className="btn-sm d-flex align-items-center "
            onClick={closeDeletePopup}
            labelClass={'ml-1'}
            text="Cancel"
            icon={<IoClose />}
          />
        </CModalFooter>
      </CModal>
    </>
  )
}

export default AdminGroupsIndex
