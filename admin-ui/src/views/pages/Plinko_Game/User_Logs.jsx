// src/views/pages/game-user-log-management/GameUserLogManagement.jsx
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
import React, { useEffect, useState } from 'react'
import { FaSearch, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
import { GrPowerReset, GrDownload } from 'react-icons/gr'
import { IoClose } from 'react-icons/io5'
import { RiDeleteBin6Line } from 'react-icons/ri'
import CustomButton from '../../../components/Button'
import FormInput from '../../../components/FormInput'
import Pagination from '../../../components/Pagination'
import { showToastr } from '../../../components/ToastrNotification'
import { titleConstants } from '../../../constant/titleConstant'
import {
  plinkogetuserlogs,
  plinkodeleteGameUserLog,
  plinkodeleteAllGameUserLogs, // new multi-delete API call
  plinkoexportUserLogs,
  API_ENDPOINT, // new export API call
} from '../../../helpers/apiRequest'
import { createListSerialNo, useCanAccess } from '../../../helpers/common-unitl'
import { getAuth } from '../../../helpers/storageRequests'
import MultiActionBar from '../../../components/MultiActionBar'
import CheckBoxes from '../../../components/Checkboxes'

const GameUserLogManagement = () => {
  // State variables for search, pagination, deletion, and multi-select
  const [openPopup, setOpenPopup] = useState(false)
  const [deleteData, setDeleteData] = useState(null)
  const [fields, setFields] = useState({
    sort_dir: 'desc',
    sort_field: 'phoneNumber',
    name: '',
    phoneNumber: '',
    page_no: 1,
  })
  const [isReset, setIsReset] = useState(true)
  const [GameUserDataLists, setGameUserDataLists] = useState([])
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)

  // New state for multi-select functionality
  const [selectedGameLogs, setSelectedGameLogs] = useState([])
  const [isChecked, setIsChecked] = useState(false)

  const canAccess = useCanAccess()
  const canViewUserLoggs = canAccess('plinko_logs', 'view')
  const hasDeletePermission = canAccess('plinko_logs', 'delete')

  // --- Pagination ---
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
    setIsReset(!isReset)
    setPage(1)
    setFields({
      sort_dir: 'desc',
      sort_field: 'id',
      name: '',
      phoneNumber: '',
      page_no: 1,
    })
  }

  // --- Fetch logs list using API ---
  const getLists = async () => {
    try {
      setGameUserDataLists([])
      const response = await plinkogetuserlogs(fields)
      const result = response.data
      if (response?.status) {
        const dataResult = result.data.result
        setGameUserDataLists(dataResult)
        setPagination({
          current: result.data?.page,
          totalPage: result.data?.totalPage,
          totalRecords: result.data?.totalRecords,
        })
      } else {
        showToastr(response?.data?.message ?? 'Something went wrong', 'error')
      }
    } catch (error) {
      console.error('error', error)
      showToastr(error?.response?.data?.message ?? 'Failed to get user logs', 'error')
    }
  }

  // --- Single deletion modal handlers ---
  const openDeletePopup = (data, visible) => {
    // Prepare URL-friendly date (if needed)
    const date = new Date(data.updatedat)
    const urlFriendlyDate = date
      .toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      .replace(',', '')
    const formattedDate = urlFriendlyDate.replace(/\/|\s+/g, '-').replace(/:/g, '-')
    const finalDate = formattedDate.replace(/(\d{2})-(\d{2})-(\d{4})/, '$3-$1-$2')

    setDeleteData({
      ...data,
      urlFriendlyDate: finalDate,
    })
    setOpenPopup(!visible)
  }

  const closeDeletePopup = () => {
    setOpenPopup(false)
    setDeleteData(null)
  }

  const handleDeleteGameUserLog = async () => {
    try {
      setOpenPopup(false)
      const { id } = deleteData
      const response = await plinkodeleteGameUserLog(id)
      if (response?.data?.status) {
        showToastr(response?.data?.message ?? 'User log deleted successfully.', 'success')
        getLists() // Refresh list
      } else {
        showToastr(response?.data?.message ?? 'Something went wrong', 'error')
      }
    } catch (error) {
      console.error('Delete error:', error)
      showToastr(error?.response?.data?.message ?? 'Failed to delete user log', 'error')
    }
  }

  // --- Sorting handler ---
  const handleGameUserColumnSort = (columnName) => {
    setPage(1)
    setFields((prevFields) => ({
      ...prevFields,
      sort_field: columnName,
      sort_dir:
        prevFields.sort_field === columnName && prevFields.sort_dir === 'asc' ? 'desc' : 'asc',
      page_no: 1,
    }))
  }

  // --- Multi-select handlers ---
  const handleCheckedElement = (e) => {
    const { value, checked } = e.target
    setSelectedGameLogs((prevSelected) => {
      if (checked) {
        return [...prevSelected, parseInt(value)]
      } else {
        return prevSelected.filter((id) => id !== parseInt(value))
      }
    })
  }

  const handleSelectAll = () => {
    if (!isChecked) {
      setSelectedGameLogs(GameUserDataLists.map((log) => log.id))
    } else {
      setSelectedGameLogs([])
    }
    setIsChecked(!isChecked)
  }

  // Keep the select-all checkbox updated when individual selections change
  useEffect(() => {
    if (GameUserDataLists.length > 0 && selectedGameLogs.length === GameUserDataLists.length) {
      setIsChecked(true)
    } else {
      setIsChecked(false)
    }
  }, [selectedGameLogs, GameUserDataLists])

  // --- Bulk action handlers ---
  const handleMultiAction = async (actionType) => {
    if (selectedGameLogs.length === 0) {
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
      const params = { id: selectedGameLogs }
      const response = await plinkodeleteAllGameUserLogs(params)
      if (response?.data?.status) {
        showToastr(response?.data?.message || 'Selected user logs deleted successfully.', 'success')
        getLists()
        setSelectedGameLogs([])
      } else {
        showToastr(response?.data?.message || 'Something went wrong', 'error')
      }
    } catch (error) {
      showToastr(error?.response?.data?.message || 'Failed to delete selected logs', 'error')
    }
  }

  // --- Export functionality ---
  const handleExport = async () => {
    try {
      const response = await plinkoexportUserLogs(fields)
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

  // --- Fetch logs on mount and when dependencies change ---
  useEffect(() => {
    getLists()
  }, [page, fields.sort_dir, fields.sort_field, isReset])

  if (!canViewUserLoggs) {
    return <div>You dont have permission to view this page.</div>
  }

  return (
    <>
      <CRow>
        <CCol xl={12}>
          <CCard className="game-user-lists">
            <CCardHeader className="font-weight-bold h5">User Logs</CCardHeader>
            <CCardBody>
              {/* Search and action bar */}
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
                    <CustomButton
                      type="submit"
                      color="primary"
                      className="btn-sm mr-2"
                      onClick={getLists}
                      labelClass="ml-1"
                      text="Search"
                      icon={<FaSearch className="mb-1" />}
                    />
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
              {/* Bulk action bar */}
              {canAccess('spin_customer_logs', 'delete') && (
                <CRow className="mb-2" style={{ marginTop: '-5px' }}>
                  <MultiActionBar
                    onClick={(name) => handleMultiAction(name)}
                    checkBoxData={selectedGameLogs}
                    module_name="plinko_logs"
                  />
                </CRow>
              )}
              {/* Logs table with multi-select checkboxes */}
              <div className="position-relative table-responsive">
                <table className="table without-table-action">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center' }}>
                        <input type="checkbox" checked={isChecked} onChange={handleSelectAll} />
                      </th>
                      <th>#</th>
                      <th onClick={() => handleGameUserColumnSort('name')}>
                        <span className="table-header-text-mrg">Name</span>
                        {fields.sort_field !== 'name' && GameUserDataLists.length > 0 && <FaSort />}
                        {fields.sort_dir === 'asc' &&
                          fields.sort_field === 'name' &&
                          GameUserDataLists.length > 0 && <FaSortUp />}
                        {fields.sort_dir === 'desc' &&
                          fields.sort_field === 'name' &&
                          GameUserDataLists.length > 0 && <FaSortDown />}
                      </th>
                      <th onClick={() => handleGameUserColumnSort('phoneNumber')}>
                        <span className="table-header-text-mrg">Phone Number</span>
                        {fields.sort_field !== 'phoneNumber' && GameUserDataLists.length > 0 && (
                          <FaSort />
                        )}
                        {fields.sort_dir === 'asc' &&
                          fields.sort_field === 'phoneNumber' &&
                          GameUserDataLists.length > 0 && <FaSortUp />}
                        {fields.sort_dir === 'desc' &&
                          fields.sort_field === 'phoneNumber' &&
                          GameUserDataLists.length > 0 && <FaSortDown />}
                      </th>
                      <th>
                        <span className="table-header-text-mrg">Reward</span>
                      </th>
                      <th onClick={() => handleGameUserColumnSort('updatedat')}>
                        <span className="table-header-text-mrg">Played At</span>
                        {fields.sort_field !== 'updatedat' && GameUserDataLists.length > 0 && (
                          <FaSort />
                        )}
                        {fields.sort_dir === 'asc' &&
                          fields.sort_field === 'updatedat' &&
                          GameUserDataLists.length > 0 && <FaSortUp />}
                        {fields.sort_dir === 'desc' &&
                          fields.sort_field === 'updatedat' &&
                          GameUserDataLists.length > 0 && <FaSortDown />}
                      </th>
                      {hasDeletePermission && (
                        <th width="10%" style={{ textAlign: 'center' }}>
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {GameUserDataLists.length > 0 ? (
                      GameUserDataLists.map((result, index) => (
                        <tr key={result.id}>
                          <td style={{ textAlign: 'center' }}>
                            <CheckBoxes
                              _id={result.id}
                              _isChecked={selectedGameLogs.includes(result.id)}
                              handleCheckChieldElement={handleCheckedElement}
                            />
                          </td>
                          <td>{createListSerialNo(page, index)}</td>
                          <td>{result.name}</td>
                          <td>{result.phoneNumber}</td>
                          <td>{result.reward}</td>
                          <td>
                            {new Date(result.updatedat)
                              .toLocaleString('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true,
                              })
                              .replace(' ', '-')
                              .replace(',', '')}
                          </td>
                          {hasDeletePermission && (
                            <td style={{ textAlign: 'center' }}>
                              <CustomButton
                                color="danger"
                                className="ml-1 btn-sm"
                                isToolTip={true}
                                size="sm"
                                toolTipContent={titleConstants.ADMIN_DELETE_TITLE}
                                text={<RiDeleteBin6Line size={'13px'} />}
                                onClick={() => openDeletePopup({ id: result.id }, openPopup)}
                              />
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={hasDeletePermission ? '7' : '6'}
                          style={{ textAlign: 'center' }}
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {pagination && GameUserDataLists.length > 0 && (
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
      {/* Modal for deleting a user log */}
      <CModal visible={openPopup} onClose={closeDeletePopup} size="md" color="danger">
        <CModalHeader closeButton>
          <CModalTitle>Delete User Log</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <span>Are you sure you want to delete this User Log?</span>
        </CModalBody>
        <CModalFooter>
          <CustomButton
            color="danger"
            className="btn-sm d-flex align-items-center"
            isToolTip={true}
            toolTipContent="User log"
            text="Yes, delete it."
            labelClass="ml-1"
            icon={<RiDeleteBin6Line />}
            onClick={handleDeleteGameUserLog}
          />
          <CustomButton
            color="secondary"
            className="btn-sm d-flex align-items-center"
            isToolTip={true}
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

export default GameUserLogManagement
