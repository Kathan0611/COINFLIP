// src/views/pages/coinflip/UserLog.jsx
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
import { FaSort, FaSortDown, FaSortUp, FaSearch } from 'react-icons/fa'
import { GrPowerReset, GrDownload } from 'react-icons/gr'
import { IoClose } from 'react-icons/io5'
import { RiDeleteBin6Line } from 'react-icons/ri'
import CustomButton from '../../../components/Button'
import FormInput from '../../../components/FormInput'
import Pagination from '../../../components/Pagination'
import { showToastr } from '../../../components/ToastrNotification'
import {
  coinflipgetuserlogs,
  coinflipdeleteGameUserLog,
  coinflipdeleteAllGameUserLogs,
  coinflipexportUserLogs,
  API_ENDPOINT,
} from '../../../helpers/apiRequest'
import { createListSerialNo, useCanAccess } from '../../../helpers/common-unitl'
import MultiActionBar from '../../../components/MultiActionBar'
import CheckBoxes from '../../../components/Checkboxes'
import { right } from '@popperjs/core'

const UserLog = () => {
  // State for search fields, user logs list, pagination, modal and page number
  const [fields, setFields] = useState({
    sort_dir: 'ASC',
    sort_field: 'createdAt',
    user_name: '',
    mobile_number: '',
    is_winner: '',
    price: '',
    page_no: 1,
  })
  const [userLogsLists, setUserLogsLists] = useState([])
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)
  const [openPopup, setOpenPopup] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  // New state for multi-select functionality
  const [selectedLogs, setSelectedLogs] = useState([])
  const [isChecked, setIsChecked] = useState(false)

  const canAccess = useCanAccess()

  // --- Pagination Handler ---
  const handlePageChange = (newPage) => {
    setPage(newPage)
    setFields({ ...fields, page_no: newPage })
  }

  // --- Search field change handler ---
  const handleChange = (e) => {
    const { name, value } = e.target
    setPage(1)
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
      page_no: 1,
    }))
  }

  // --- Reset search fields ---
  const handleReset = () => {
    setPage(1)
    setFields({
      sort_dir: 'ASC',
      sort_field: 'createdAt',
      user_name: '',
      mobile_number: '',
      page_no: 1,
    })
  }

  // --- Fetch user logs list from API ---
  const getLists = async () => {
    try {
      const response = await coinflipgetuserlogs(fields)
      if (response?.data?.status) {
        const dataResult = response?.data?.data?.data
        setUserLogsLists(dataResult)
        setPagination({
          current: response?.data?.data?.currentPage,
          totalPage: response?.data?.data?.totalPages,
          totalRecords: response?.data?.data?.totalRecords,
        })
      } else {
        showToastr(response?.data?.message ?? 'Something went wrong', 'error')
      }
    } catch (error) {
      showToastr(error?.response?.data?.message ?? 'Failed to get user logs', 'error')
    }
  }

  // --- Single deletion modal handlers ---
  const openDeletePopup = (id) => {
    setDeleteId(id)
    setOpenPopup(true)
  }

  const closeDeletePopup = () => {
    setOpenPopup(false)
    setDeleteId(null)
  }

  const deleteUserLog = async () => {
    try {
      const response = await coinflipdeleteGameUserLog(deleteId)
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
      setDeleteId(null)
    }
  }

  // --- Sorting handler ---
  const handleColumnSort = (fieldName) => {
    setFields((prevFields) => {
      const newSortDir =
        prevFields.sort_field === fieldName && prevFields.sort_dir === 'ASC' ? 'DESC' : 'ASC'
      return {
        ...prevFields,
        sort_dir: newSortDir,
        sort_field: fieldName,
      }
    })
  }

  // --- Render sorting icon ---
  const renderSortIcon = (fieldName) => {
    if (fields.sort_field !== fieldName) {
      return <FaSort className="ml-2" />
    }
    return fields.sort_dir === 'ASC' ? (
      <FaSortDown className="ml-2" />
    ) : (
      <FaSortUp className="ml-2" />
    )
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

  // Update the "select all" checkbox state based on individual selections
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
      const response = await coinflipdeleteAllGameUserLogs(params)
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
      const response = await coinflipexportUserLogs(fields)
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

  // --- Fetch data when fields change ---
  useEffect(() => {
    getLists()
  }, [fields])

  return (
    <>
      {/* User Logs Table */}
      <CRow>
        <CCol xl={12}>
          <CCard className="user-logs-lists">
            <CCardHeader className="h5 ">Coin Flip Logs</CCardHeader>
            <CCardBody>
              {/* Search and Action Bar */}
              <CRow className="mb-1">
                <CInputGroup className="row">
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
                    <FormInput
                      id="phoneNumber"
                      placeholder="Search phone number"
                      name="phoneNumber"
                      value={fields.phoneNumber}
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
                    {/* <CustomButton
                      type="submit"
                      color="primary"
                      className="btn-sm mr-2"
                      onClick={getLists}
                      labelClass="ml-1"
                      text="Search"
                      icon={<FaSearch className="mb-1" />}
                    /> */}
                    <CustomButton
                      color="secondary"
                      className="btn-sm mr-2"
                      onClick={handleReset}
                      labelClass="ml-1"
                      text="Reset"
                      icon={<GrPowerReset className="mb-1" />}
                    />
                  </CCol>
                  <CCol xl={3}>
                    <CustomButton
                      color="primary"
                      className="btn-sm"
                      onClick={handleExport}
                      labelClass="ml-1"
                      text="Export"
                      icon={<GrDownload className="mb-1" />}
                    />
                  </CCol>
                </CInputGroup>
              </CRow>
              <hr style={{ marginTop: '-7px' }} />
              {canAccess('spin_customer_logs', 'delete') && (
                <CRow className="mb-2" style={{ marginTop: '-5px' }}>
                  <MultiActionBar
                    onClick={(name) => handleMultiAction(name)}
                    checkBoxData={selectedLogs}
                    module_name="coin_flip_logs"
                  />
                </CRow>
              )}
              <div className="position-relative table-responsive">
                <table className="table without-table-action">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center' }}>
                        <input type="checkbox" checked={isChecked} onChange={handleSelectAll} />
                      </th>
                      <th onClick={() => handleColumnSort('user_name')}>
                        Name {userLogsLists.length > 0 && renderSortIcon('user_name')}
                      </th>
                      <th onClick={() => handleColumnSort('mobile_number')}>
                        Mobile Number {userLogsLists.length > 0 && renderSortIcon('mobile_number')}
                      </th>
                      <th>Result</th>
                      <th>Prize</th>
                      <th onClick={() => handleColumnSort('createdAt')}>
                        Created At {userLogsLists.length > 0 && renderSortIcon('createdAt')}
                      </th>
                      {canAccess('coin_flip_logs', 'delete') && (
                        <th width="10%" style={{ textAlign: 'center' }}>
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {userLogsLists?.length > 0 ? (
                      userLogsLists.map((logData, index) => (
                        <tr key={logData.id}>
                          <td style={{ textAlign: 'center' }}>
                            <CheckBoxes
                              _id={logData.id}
                              _isChecked={selectedLogs.includes(logData.id)}
                              handleCheckChieldElement={handleCheckedElement}
                            />
                          </td>
                          <td>{logData.user_name}</td>
                          <td>{logData.mobile_number}</td>
                          <td>{logData.is_winner ? 'win' : 'loss'}</td>
                          <td>{logData.price}</td>
                          <td>
                            {new Date(logData.createdAt).toLocaleDateString('en-GB', {
                              hour12: true,
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                          </td>
                          {canAccess('coin_flip_logs', 'delete') && (
                            <td style={{ textAlign: 'center' }}>
                              <CustomButton
                                color="danger"
                                className="btn-sm"
                                isToolTip={true}
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
                          colSpan={canAccess('coin_flip_logs', 'delete') ? '7' : '6'}
                          style={{ textAlign: 'center' }}
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {pagination && userLogsLists?.length > 0 && (
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

      {/* Modal for Delete Confirmation */}
      <CModal visible={openPopup} onClose={closeDeletePopup} size="md" color="danger">
        <CModalHeader>
          <CModalTitle>Delete User Log</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <span>Are you sure you want to delete this user log?</span>
        </CModalBody>
        <CModalFooter>
          <CustomButton
            color="danger"
            className="btn-sm d-flex align-items-center"
            isToolTip={true}
            toolTipContent="Delete User Log"
            text="Yes, delete it"
            labelClass="ml-1"
            icon={<RiDeleteBin6Line />}
            onClick={deleteUserLog}
          />
          <CustomButton
            color="secondary"
            className="btn-sm d-flex align-items-center"
            isToolTip={true}
            toolTipContent="Cancel"
            text="Cancel"
            labelClass="ml-1"
            icon={<IoClose />}
            onClick={closeDeletePopup}
          />
        </CModalFooter>
      </CModal>
    </>
  )
}

export default UserLog
