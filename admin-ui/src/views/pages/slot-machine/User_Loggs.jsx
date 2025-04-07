// src/views/pages/user-loggs/User_Loggs.jsx
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
import { FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'
import { GrDownload, GrPowerReset } from 'react-icons/gr'
import { IoClose } from 'react-icons/io5'
import { RiDeleteBin6Line } from 'react-icons/ri'
import CustomButton from '../../../components/Button'
import FormInput from '../../../components/FormInput'
import Pagination from '../../../components/Pagination'
import { showToastr } from '../../../components/ToastrNotification'
import {
  admindeleteSlotMachineuserloggs,
  admindeleteAllSlotMachineuserloggs, // new multi-delete API call
  admingetSlotMachineuserloggs,
  adminexportSlotMachineuserloggs,
  API_ENDPOINT, // new export API call
} from '../../../helpers/apiRequest'
import { createListSerialNo, useCanAccess } from '../../../helpers/common-unitl'
import MultiActionBar from '../../../components/MultiActionBar'
import CheckBoxes from '../../../components/Checkboxes'

const UserLoggs = () => {
  // Permission hooks
  const canAccess = useCanAccess()
  const canViewUserLoggs = canAccess('slotmachine_logs', 'view')
  const hasDeletePermission = canAccess('slotmachine_logs', 'delete')

  // Search fields for filtering and sorting logs
  const [searchFields, setSearchFields] = useState({
    sort_dir: 'desc',
    sort_field: 'createdAt',
    name: '',
    mobile: '',
    page_no: 1,
  })
  const [logs, setLogs] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteId, setDeleteId] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // New state for multi-select functionality
  const [selectedLogs, setSelectedLogs] = useState([])
  const [isChecked, setIsChecked] = useState(false)

  // Fetch logs using the searchFields parameters
  const fetchLogs = async () => {
    try {
      const params = {
        name: searchFields.name,
        mobile: searchFields.mobile,
        page_no: searchFields.page_no,
        sort_dir: searchFields.sort_dir,
        sort_field: searchFields.sort_field,
      }
      const response = await admingetSlotMachineuserloggs(params)
      if (response.data && response.data.status) {
        if (response.data.data) {
          setLogs(response.data.data.result)
          setPagination({
            current: response.data.data.page,
            totalPage: response.data.data.totalPage,
            totalRecords: response.data.data.totalRecords,
          })
        } else {
          setLogs([])
          setPagination(null)
        }
      } else {
        showToastr(response.data.message || 'Something went wrong', 'error')
        setLogs([])
      }
    } catch (err) {
      showToastr(err.response?.data?.message || 'Something went wrong', 'error')
      setLogs([])
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [searchFields])

  // Handle input changes for search fields
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSearchFields((prev) => ({
      ...prev,
      [name]: value,
      page_no: 1,
    }))
    setCurrentPage(1)
  }

  // Reset search fields
  const handleReset = () => {
    setSearchFields({
      sort_dir: 'desc',
      sort_field: 'createdAt',
      name: '',
      mobile: '',
      page_no: 1,
    })
    setCurrentPage(1)
  }

  // Sorting handler
  const handleSort = (column) => {
    setSearchFields((prev) => ({
      ...prev,
      sort_field: column,
      sort_dir: prev.sort_field === column && prev.sort_dir === 'asc' ? 'desc' : 'asc',
      page_no: 1,
    }))
    setCurrentPage(1)
  }

  // Pagination handler
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    setSearchFields((prev) => ({
      ...prev,
      page_no: newPage,
    }))
  }

  // Open/close single deletion modal
  const openDeleteModal = (id) => {
    setDeleteId(id)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeleteId(null)
  }

  // Delete a single log
  const handleDelete = async () => {
    try {
      const response = await admindeleteSlotMachineuserloggs(deleteId)
      if (response.data && response.data.status) {
        showToastr('User log deleted successfully.', 'success')
        fetchLogs() // Refresh list
      } else {
        showToastr('Delete failed', 'error')
      }
    } catch (err) {
      showToastr(err.response?.data?.message || 'Error deleting user log', 'error')
    } finally {
      closeDeleteModal()
    }
  }

  // Handle individual checkbox selection
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

  // Handle select all checkbox toggle
  const handleSelectAll = () => {
    if (!isChecked) {
      setSelectedLogs(logs.map((log) => log.id))
    } else {
      setSelectedLogs([])
    }
    setIsChecked(!isChecked)
  }

  // Watch for changes so that the “select all” checkbox is updated
  useEffect(() => {
    if (logs.length > 0 && selectedLogs.length === logs.length) {
      setIsChecked(true)
    } else {
      setIsChecked(false)
    }
  }, [selectedLogs, logs])

  // Multi-action handler for bulk deletion
  const handleMultiAction = async (actionType) => {
    if (selectedLogs.length === 0) {
      showToastr('Please select at least one log to proceed.', 'warning')
      return
    }

    if (actionType === 'delete') {
      await handleMultiDelete()
    } else {
      showToastr('Invalid action selected.', 'error')
    }
  }

  // Bulk delete API call (sends params as { id: selectedLogs })
  const handleMultiDelete = async () => {
    try {
      const params = { id: selectedLogs }
      const response = await admindeleteAllSlotMachineuserloggs(params)
      if (response?.data?.status) {
        showToastr(response?.data?.message || 'Selected logs deleted successfully.', 'success')
        fetchLogs()
        setSelectedLogs([])
      } else {
        showToastr(response?.data?.message || 'Something went wrong', 'error')
      }
    } catch (error) {
      showToastr(error?.response?.data?.message || 'Failed to delete selected logs', 'error')
    }
  }

  // Export logs using searchFields as params (format maintained as in CustomerLogs)
  const handleExport = async () => {
    try {
      console.log('here')
      const response = await adminexportSlotMachineuserloggs(searchFields)
      console.log(response)
      if (response?.data?.status) {
        const filePath = `${API_ENDPOINT}${response?.data?.data?.filePath}` // Assuming API returns the relative path
        const link = document.createElement('a')
        link.href = filePath
        link.download = filePath.split('/').pop()
        link.click()
      } else {
        showToastr(response?.data?.message || 'Failed to export logs', 'error')
      }
    } catch (err) {
      showToastr(err?.response?.data?.message || 'Failed to export logs', 'error')
    }
  }

  if (!canViewUserLoggs) {
    return <div>You dont have permission to view this page.</div>
  }

  return (
    <>
      <CRow>
        <CCol xl={12}>
          <CCard className="user-loggs-card">
            <CCardHeader className="font-weight-bold">User Logs</CCardHeader>
            <CCardBody>
              {/* Search and actions area */}
              <CRow className="mb-3">
                <CInputGroup className="row">
                  <CCol xl={3}>
                    <FormInput
                      id="name"
                      name="name"
                      placeholder="Search name"
                      value={searchFields.name}
                      onChange={handleInputChange}
                      onBlur={fetchLogs}
                    />
                  </CCol>
                  <CCol xl={3}>
                    <FormInput
                      id="mobile"
                      name="mobile"
                      placeholder="Search mobile"
                      value={searchFields.mobile}
                      onChange={handleInputChange}
                      onBlur={fetchLogs}
                    />
                  </CCol>
                  <CCol xl={3}>
                    <CustomButton
                      color="primary"
                      className="btn-sm mr-2"
                      onClick={fetchLogs}
                      text="Search"
                      icon={<FaSearch />}
                    />
                    <CustomButton
                      color="secondary"
                      className="btn-sm mr-2"
                      onClick={handleReset}
                      text="Reset"
                      icon={<GrPowerReset />}
                    />
                  </CCol>
                  <CCol xl={3}>
                    <CustomButton
                      color="primary"
                      className="btn-sm"
                      onClick={handleExport}
                      text="Export"
                      icon={<GrDownload />}
                    />
                  </CCol>
                  {/* Bulk action bar */}
                  {canAccess('spin_customer_logs', 'delete') && (
                    <CRow className="mb-2" style={{ marginTop: '-5px' }}>
                      <MultiActionBar
                        onClick={(name) => handleMultiAction(name)}
                        checkBoxData={selectedLogs}
                        module_name="slotmachine_logs"
                      />
                    </CRow>
                  )}
                </CInputGroup>
              </CRow>

              {/* Logs table with multi-select checkbox column */}
              <div className="table-responsive">
                <table className="table" style={{ textAlign: 'center' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center' }}>
                        <input type="checkbox" checked={isChecked} onChange={handleSelectAll} />
                      </th>
                      <th>#</th>
                      <th onClick={() => handleSort('name')}>
                        Name&nbsp;
                        {searchFields.sort_field === 'name' ? (
                          searchFields.sort_dir === 'asc' ? (
                            <FaSortUp />
                          ) : (
                            <FaSortDown />
                          )
                        ) : (
                          <FaSort />
                        )}
                      </th>
                      <th>Mobile</th>
                      <th>Result</th>
                      <th>Prize</th>
                      <th onClick={() => handleSort('createdAt')}>
                        Played At&nbsp;
                        {searchFields.sort_field === 'createdAt' ? (
                          searchFields.sort_dir === 'asc' ? (
                            <FaSortUp />
                          ) : (
                            <FaSortDown />
                          )
                        ) : (
                          <FaSort />
                        )}
                      </th>
                      {hasDeletePermission && <th style={{ textAlign: 'center' }}>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length > 0 ? (
                      logs.map((log, index) => (
                        <tr key={log.id}>
                          <td style={{ textAlign: 'center' }}>
                            <CheckBoxes
                              _id={log.id}
                              _isChecked={selectedLogs.includes(log.id)}
                              handleCheckChieldElement={handleCheckedElement}
                            />
                          </td>
                          <td>{createListSerialNo(currentPage, index)}</td>
                          <td>{log.name}</td>
                          <td>{log.number}</td>
                          <td>{log.result}</td>
                          <td>{log.prize ? log.prize : '-'}</td>
                          <td>{log.createdAt}</td>
                          {hasDeletePermission && (
                            <td style={{ textAlign: 'center' }}>
                              <CustomButton
                                color="danger"
                                className="btn-sm"
                                onClick={() => openDeleteModal(log.id)}
                                icon={<RiDeleteBin6Line />}
                              />
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={hasDeletePermission ? '8' : '7'}
                          style={{ textAlign: 'center' }}
                        >
                          No user logs found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {pagination && logs.length > 0 && (
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

      {/* Modal for single deletion */}
      <CModal visible={isDeleteModalOpen} onClose={closeDeleteModal} color="danger">
        <CModalHeader closeButton>
          <CModalTitle>Delete User Log</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this user log?</CModalBody>
        <CModalFooter>
          <CustomButton
            color="danger"
            className="btn-sm"
            onClick={handleDelete}
            text="Yes, delete it"
            icon={<RiDeleteBin6Line />}
          />
          <CustomButton
            color="secondary"
            className="btn-sm"
            onClick={closeDeleteModal}
            text="Cancel"
            icon={<IoClose />}
          />
        </CModalFooter>
      </CModal>
    </>
  )
}

export default UserLoggs
