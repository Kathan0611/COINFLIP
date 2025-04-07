// src/views/pages/memory-game/UserLog.jsx
import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CInputGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { FaSearch, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
import { GrPowerReset, GrDownload } from 'react-icons/gr'
import { IoClose } from 'react-icons/io5'
import { RiDeleteBin6Line } from 'react-icons/ri'
import CustomButton from '../../../components/Button'
import FormInput from '../../../components/FormInput'
import Pagination from '../../../components/Pagination'
import { showToastr } from '../../../components/ToastrNotification'
import {
  adminGetMemoryGameUserlogs,
  deleteMemoryGameUserLogs,
  adminDeleteAllMemoryGameUserLogs, // new API for bulk deletion
  adminExportMemoryGameUserlogs,
  API_ENDPOINT, // new API for export
} from '../../../helpers/apiRequest'
import { useCanAccess } from '../../../helpers/common-unitl'
import MultiActionBar from '../../../components/MultiActionBar'
import CheckBoxes from '../../../components/Checkboxes'

// Helper function to format date into "dd-MM-yyyy HH:mm:ss"
const formatDateTime = (dateString) => {
  const d = new Date(dateString)
  const day = ('0' + d.getDate()).slice(-2)
  const month = ('0' + (d.getMonth() + 1)).slice(-2)
  const year = d.getFullYear()
  const hours = ('0' + d.getHours()).slice(-2)
  const minutes = ('0' + d.getMinutes()).slice(-2)
  const seconds = ('0' + d.getSeconds()).slice(-2)
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`
}

const UserLog = () => {
  const [fields, setFields] = useState({
    sort_dir: 'desc',
    sort_field: 'createdAt',
    name: '',
    mobile: '',
    score: '',
    reward: '',
    page_no: 1,
  })
  const [searchTriggered, setSearchTriggered] = useState(false)
  const [isReset, setIsReset] = useState(true)
  const [userLogsLists, setUserLogsLists] = useState([])
  const [openPopup, setOpenPopup] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)

  // New state variables for multi-select
  const [selectedLogs, setSelectedLogs] = useState([])
  const [isChecked, setIsChecked] = useState(false)

  // Check permissions
  const canAccess = useCanAccess()
  const canViewGameConfig = canAccess('memory_logs', 'view')

  // --- Pagination Handler ---
  const handlePageChange = (newPage) => {
    setPage(newPage)
    setFields({ ...fields, page_no: newPage })
  }

  // --- Open/Close Delete Modal ---
  const openDeletePopup = (id) => {
    setDeleteId(id)
    setOpenPopup(true)
  }
  const closeDeletePopup = () => {
    setOpenPopup(false)
    setDeleteId(null)
  }

  // --- Sorting Handler ---
  const handleColumnSort = (fieldName) => {
    setFields((prevFields) => ({
      ...prevFields,
      sort_dir:
        prevFields.sort_field === fieldName && prevFields.sort_dir === 'asc' ? 'desc' : 'asc',
      sort_field: fieldName,
    }))
  }

  // --- Search Field Change Handler ---
  const handleChange = (e) => {
    const { name, value } = e.target
    setPage(1)
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
      page_no: 1,
    }))
  }

  // --- Reset Search Fields ---
  const handleReset = () => {
    setIsReset(!isReset)
    setPage(1)
    setSearchTriggered(false)
    setFields({
      sort_dir: 'desc',
      sort_field: 'createdAt',
      name: '',
      mobile: '',
      page_no: 1,
    })
  }

  // --- Fetch Logs ---
  const getLists = async () => {
    try {
      const response = await adminGetMemoryGameUserlogs(fields)
      if (response?.data?.status) {
        const dataResult = response?.data?.data
        setUserLogsLists(dataResult?.result)
        setPagination({
          current: dataResult?.page,
          totalPage: dataResult?.totalPage,
          totalRecords: dataResult?.totalRecords,
        })
      } else {
        showToastr(response?.data?.message ?? 'Something went wrong', 'error')
      }
    } catch (error) {
      showToastr(error?.response?.data?.message ?? 'Failed to get user logs', 'error')
    }
  }

  // --- Single Deletion ---
  const deleteUserLog = async () => {
    try {
      setOpenPopup(false)
      const response = await deleteMemoryGameUserLogs(deleteId)
      if (response?.data?.status) {
        showToastr(response?.data?.message ?? 'User log deleted successfully.', 'success')
        getLists()
      } else {
        showToastr(response?.data?.message ?? 'Something went wrong', 'error')
      }
    } catch (error) {
      showToastr(error?.response?.data?.message ?? 'Failed to delete user log', 'error')
    } finally {
      setOpenPopup(false)
    }
  }

  // --- Multi-select Handlers ---
  const handleCheckedElement = (e) => {
    const { value, checked } = e.target
    setSelectedLogs((prevSelected) => {
      if (checked) {
        return [...prevSelected, parseInt(value)]
      } else {
        return prevSelected.filter((id) => id !== parseInt(value))
      }
    })
  }

  const handleSelectAll = () => {
    if (!isChecked) {
      setSelectedLogs(userLogsLists.map((log) => log.id))
    } else {
      setSelectedLogs([])
    }
    setIsChecked(!isChecked)
  }

  // Update select-all checkbox when individual selections change
  useEffect(() => {
    if (userLogsLists.length > 0 && selectedLogs.length === userLogsLists.length) {
      setIsChecked(true)
    } else {
      setIsChecked(false)
    }
  }, [selectedLogs, userLogsLists])

  // --- Bulk Action Handlers ---
  const handleMultiAction = async (actionType) => {
    if (selectedLogs.length === 0) {
      showToastr('Please select at least one user log to proceed.', 'warning')
      return
    }
    if (actionType === 'delete') {
      await handleMultiDelete()
    } else {
      showToastr('Invalid action selected.', 'error')
    }
  }

  const handleMultiDelete = async () => {
    try {
      const params = { id: selectedLogs }
      const response = await adminDeleteAllMemoryGameUserLogs(params)
      if (response?.data?.status) {
        showToastr(response?.data?.message || 'Selected user logs deleted successfully.', 'success')
        getLists()
        setSelectedLogs([])
      } else {
        showToastr(response?.data?.message || 'Something went wrong', 'error')
      }
    } catch (error) {
      showToastr(error?.response?.data?.message || 'Failed to delete selected user logs', 'error')
    }
  }

  // --- Export Functionality ---
  const handleExport = async () => {
    try {
      const response = await adminExportMemoryGameUserlogs(fields)
      if (response?.data?.status) {
        const filePath = `${API_ENDPOINT}${response?.data?.data?.filePath}`
        const link = document.createElement('a')
        link.href = filePath
        link.download = filePath.split('/').pop()
        link.click()
      } else {
        showToastr(response?.data?.message || 'Failed to export user logs', 'error')
      }
    } catch (error) {
      showToastr(error?.response?.data?.message || 'Failed to export user logs', 'error')
    }
  }

  // --- Fetch logs when dependencies change ---
  useEffect(() => {
    if ((fields.name === '' && fields.mobile === '') || searchTriggered) {
      getLists()
    }
  }, [
    page,
    fields.sort_dir,
    fields.sort_field,
    isReset,
    searchTriggered,
    fields.name,
    fields.mobile,
  ])

  if (!canViewGameConfig) {
    return (
      <div>
        <h1>You do not have permission to access this page</h1>
      </div>
    )
  }

  return (
    <>
      {/* Search & Action Bar */}
      <CRow className="mb-1">
        <CCol xl={9}>
          <CInputGroup className="row">
            <CCol xl={3}>
              <FormInput
                id="name"
                placeholder="Search name"
                name="name"
                value={fields.name}
                onChange={handleChange}
                style={{ lineHeight: '17px' }}
              />
            </CCol>
            <CCol xl={3}>
              <FormInput
                id="mobile"
                placeholder="Search mobile"
                name="mobile"
                value={fields.mobile}
                onChange={handleChange}
                style={{ lineHeight: '17px' }}
              />
            </CCol>
            <CCol xl={3}>
              <CustomButton
                type="submit"
                color="primary"
                className="btn-sm mr-2"
                onClick={() => {
                  setSearchTriggered(true)
                  getLists()
                }}
                labelClass="ml-1"
                text="Search"
                icon={<FaSearch className="mb-1" />}
              />
              <CustomButton
                color="secondary"
                className="btn-sm"
                onClick={handleReset}
                labelClass="ml-1"
                text="Reset"
                icon={<GrPowerReset className="mb-1" />}
              />
            </CCol>
          </CInputGroup>
        </CCol>
        <CCol xl={3} className="d-flex justify-content-end">
          <CustomButton
            color="primary"
            className="btn-sm"
            onClick={handleExport}
            text="Export"
            icon={<GrDownload className="mb-1" />}
          />
        </CCol>
      </CRow>

      {/* Bulk Action Bar */}
      {canAccess('spin_customer_logs', 'delete') && (
        <CRow className="mb-2">
          <MultiActionBar
            onClick={(action) => handleMultiAction(action)}
            checkBoxData={selectedLogs}
            module_name="memory_logs"
          />
        </CRow>
      )}
      {/* User Logs Table */}
      <CRow>
        <CCol xl={12}>
          <CCard className="user-logs-lists">
            <CCardHeader className="font-weight-bold h5">User Logs</CCardHeader>
            <CCardBody>
              <div className="position-relative table-responsive">
                <table className="table without-table-action">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center' }}>
                        <input type="checkbox" checked={isChecked} onChange={handleSelectAll} />
                      </th>
                      <th onClick={() => handleColumnSort('name')}>
                        <span className="sortCls">
                          <span className="table-header-text-mrg">Name</span>
                          {fields.sort_field !== 'name' && userLogsLists.length > 0 && <FaSort />}
                          {fields.sort_dir === 'asc' &&
                            fields.sort_field === 'name' &&
                            userLogsLists.length > 0 && <FaSortUp />}
                          {fields.sort_dir === 'desc' &&
                            fields.sort_field === 'name' &&
                            userLogsLists.length > 0 && <FaSortDown />}
                        </span>
                      </th>
                      <th>Mobile</th>
                      <th onClick={() => handleColumnSort('score')}>
                        <span className="sortCls">
                          <span className="table-header-text-mrg">Score</span>
                          {fields.sort_field !== 'score' && userLogsLists.length > 0 && <FaSort />}
                          {fields.sort_dir === 'asc' &&
                            fields.sort_field === 'score' &&
                            userLogsLists.length > 0 && <FaSortUp />}
                          {fields.sort_dir === 'desc' &&
                            fields.sort_field === 'score' &&
                            userLogsLists.length > 0 && <FaSortDown />}
                        </span>
                      </th>
                      <th>Reward</th>
                      <th onClick={() => handleColumnSort('createdAt')}>
                        <span className="sortCls">
                          <span className="table-header-text-mrg">Created At</span>
                          {fields.sort_field !== 'createdAt' && userLogsLists.length > 0 && (
                            <FaSort />
                          )}
                          {fields.sort_dir === 'asc' &&
                            fields.sort_field === 'createdAt' &&
                            userLogsLists.length > 0 && <FaSortUp />}
                          {fields.sort_dir === 'desc' &&
                            fields.sort_field === 'createdAt' &&
                            userLogsLists.length > 0 && <FaSortDown />}
                        </span>
                      </th>
                      {canAccess('memory_logs', 'delete') && (
                        <th width="10%" style={{ textAlign: 'center' }}>
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {userLogsLists.length > 0 ? (
                      userLogsLists.map((logData) => (
                        <tr key={logData.id}>
                          <td style={{ textAlign: 'center' }}>
                            <CheckBoxes
                              _id={logData.id}
                              _isChecked={selectedLogs.includes(logData.id)}
                              handleCheckChieldElement={handleCheckedElement}
                            />
                          </td>
                          <td>{logData.name}</td>
                          <td>{logData.mobile}</td>
                          <td>{logData.score}</td>
                          <td>{logData.reward}</td>
                          <td>{formatDateTime(logData.createdAt)}</td>
                          {canAccess('memory_logs', 'delete') && (
                            <td style={{ textAlign: 'center' }}>
                              <CustomButton
                                color="danger"
                                className="ml-1 btn-sm"
                                isToolTip
                                toolTipContent="Delete User Log"
                                icon={<RiDeleteBin6Line size={'13px'} />}
                                onClick={() => openDeletePopup(logData.id)}
                              />
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={canAccess('memory_logs', 'delete') ? 7 : 6}
                          style={{ textAlign: 'center' }}
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {pagination && userLogsLists.length > 0 && (
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

      {/* Delete Confirmation Modal */}
      <CModal visible={openPopup} onClose={closeDeletePopup} size="md" color="danger">
        <CModalHeader closeButton>
          <CModalTitle>Delete User Log</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <span>Are you sure you want to delete this user log?</span>
        </CModalBody>
        <CModalFooter>
          {canAccess('memory_logs', 'delete') && (
            <CustomButton
              color="danger"
              className="btn-sm d-flex align-items-center"
              isToolTip
              toolTipContent="Delete User Log"
              text="Yes, delete it."
              labelClass="ml-1"
              icon={<RiDeleteBin6Line />}
              onClick={deleteUserLog}
            />
          )}
          <CustomButton
            color="secondary"
            className="btn-sm d-flex align-items-center"
            isToolTip
            text="Cancel"
            labelClass="ml-1"
            toolTipContent="Cancel"
            icon={<IoClose />}
            onClick={closeDeletePopup}
          />
        </CModalFooter>
      </CModal>
    </>
  )
}

export default UserLog
