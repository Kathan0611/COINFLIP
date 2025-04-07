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
import { GrDownload, GrPowerReset } from 'react-icons/gr'
import { IoClose } from 'react-icons/io5'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import CustomButton from '../../../components/Button'
import CustomSelect from '../../../components/CustomSelect'
import FormInput from '../../../components/FormInput'
import Pagination from '../../../components/Pagination'
import { showToastr } from '../../../components/ToastrNotification'
import { CustomerPageCosntants } from '../../../constant/titleConstant'
import {
  API_ENDPOINT,
  customerLogs,
  deleteCustomer,
  deleteAllCustomer,
  exportCustomerLogs,
} from '../../../helpers/apiRequest'
import CheckBoxes from '../../../components/Checkboxes'
import {
  createListSerialNo,
  isLoggedUserDataOwner,
  useCanAccess,
} from '../../../helpers/common-unitl'
import MultiActionBar from '../../../components/MultiActionBar'
const CustomerLogs = () => {
  const [fields, setFields] = useState({
    sort_dir: 'desc',
    sort_field: 'id',
    mobile_number: '',
    store_name: '',
    page: 1,
  })
  const [isReset, setIsReset] = useState(true)
  const [customerLists, setCustomerLists] = useState([])
  const [openPopup, setOpenPopup] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)
  const canAccess = useCanAccess()
  // === Get logged user data from state === //
  const userData = useSelector((state) => state.user)
  const [selectedCustomers, setselectedCustomers] = useState([])
  const [isChecked, setIsChecked] = useState(false)

  // === Pagination function === //
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPage) return // Prevent out-of-range navigation

    setPage(newPage) // Update page state
    setFields((prevFields) => ({
      ...prevFields,
      page: newPage,
    }))
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
      page: 1,
    }))
  }

  const handleCheckedElement = (e) => {
    const { value, checked } = e.target
    setselectedCustomers((prevSelected) => {
      if (checked) {
        return [...prevSelected, parseInt(value)]
      } else {
        return prevSelected.filter((id) => id !== parseInt(value))
      }
    })
  }

  const handleSelectAll = () => {
    if (!isChecked) {
      setselectedCustomers(customerLists.map((customer) => customer.id))
    } else {
      setselectedCustomers([])
    }
    setIsChecked(!isChecked)
  }

  // === Reset function === //
  const handleReset = () => {
    setIsReset(!isReset)
    setPage(1)
    setFields({
      sort_dir: 'desc',
      sort_field: 'id',
      mobile_number: '',
      store_name: '',
      page: 1,
    })
  }

  // Get list of stores
  const getLists = async (
    page = fields?.page,
    sort_dir = fields?.sort_dir,
    sort_field = fields?.sort_field,
    mobile_number = fields?.mobile_number,
    store_name = fields?.store_name,
  ) => {
    try {
      const response = await customerLogs({ page, sort_dir, sort_field, mobile_number, store_name })
      if (response?.data?.status) {
        const dataResult = response?.data?.data
        setCustomerLists(dataResult?.customers)
        setPagination({
          current: dataResult?.pagination.current_page,
          totalPage: dataResult?.pagination.last_page,
          totalRecords: dataResult?.pagination.total,
        })
      } else {
        showToastr(response?.data?.message ?? 'Something went wrong', 'error')
      }
    } catch (error) {
      showToastr(error?.response?.data?.message ?? 'Failed to get customer logs', 'error')
    }
  }

  // === Delete data of store === //
  const deleteStore = async () => {
    try {
      setOpenPopup(false)
      const response = await deleteCustomer(deleteId)
      if (response?.data?.status) {
        showToastr(response?.data?.message ?? 'Customer logs deleted successfully.', 'success')
        getLists()
      } else {
        showToastr(response?.data?.message ?? 'Someting went wrong', 'error')
      }
    } catch (error) {
      showToastr(error?.response?.data?.message ?? 'Failed to delete Customer', 'success')
    } finally {
      setOpenPopup(false)
    }
  }

  const deleteAllCustomers = async () => {
    try {
      if (selectedCustomers.length === 0) {
        showToastr('Please select at least one customer to delete.', 'warning')
        return
      }
      const response = await deleteAllCustomer({ id: selectedCustomers })
      if (response?.data?.status) {
        showToastr(
          response?.data?.message ?? 'Selected Customer logs deleted successfully.',
          'success',
        )
        getLists(1)
        setselectedCustomers([])
      } else {
        showToastr(response?.data?.message ?? 'Someting went wrong', 'error')
      }
    } catch (error) {
      showToastr(error?.response?.data?.message ?? 'Failed to delete selected Customer', 'success')
    } finally {
    }
  }

  const handleMultiAction = async (actionType) => {
    if (selectedCustomers.length === 0) {
      showToastr('Please select at least one customer to proceed.', 'warning')
      return
    }

    if (actionType === 'delete') {
      await deleteAllCustomers()
    } else {
      showToastr('Invalid action selected.', 'error')
    }
  }

  const handleExport = async () => {
    try {
      const response = await exportCustomerLogs(fields)
      if (response?.data?.status) {
        const filePath = `${response?.data?.data?.relativePath}`
        console.log('filePath', filePath)
        const link = document.createElement('a')
        link.href = filePath
        link.download = filePath.split('/').pop()
        link.click()
      } else {
        showToastr(response?.data?.message ?? 'Failed to export customer logs', 'error')
      }
    } catch (err) {
      showToastr(err?.response?.data?.message ?? 'Failed to export customer logs', 'error')
    }
  }
  useEffect(() => {
    getLists()
  }, [fields.page, fields.sort_dir, fields.sort_field, isReset])

  useEffect(() => {
    if (selectedCustomers.length === customerLists.length) {
      setIsChecked(true)
    } else {
      setIsChecked(false)
    }
  }, [selectedCustomers, customerLists])
  return (
    <>
      <CRow>
        <CCol xl={12}>
          <CCard className="cus">
            <CCardHeader className={'font-weight-bold h5'}>
              {CustomerPageCosntants.CUSTOMER_LIST_TITLE}
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CInputGroup className="row d-flex align-items-center">
                  <CCol xl={3}>
                    <FormInput
                      id="mobile_number"
                      placeholder="Search mobile no"
                      name="mobile_number"
                      value={fields.mobile_number}
                      onChange={(e) => setFields({ ...fields, mobile_number: e.target.value })}
                    />
                  </CCol>
                  <CCol
                    xl={6}
                    style={{
                      marginTop: '-10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '15px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <CustomButton
                        type={'submit'}
                        color="primary"
                        className="btn-sm mr-2"
                        onClick={() => {
                          setFields((pre) => {
                            return {
                              ...pre,
                              page: 1,
                            }
                          })
                          getLists(1)
                        }}
                        labelClass={'ml-1'}
                        text="Search"
                        icon={<FaSearch className="mb-1" />}
                      />
                      <CustomButton
                        color="secondary"
                        className="btn-sm mr-2"
                        onClick={handleReset}
                        labelClass={'ml-1'}
                        text="Reset"
                        icon={<GrPowerReset className="mb-1" />}
                      />
                    </div>
                    <CRow>
                      <div>
                        <CustomButton
                          color="primary"
                          className="btn-sm"
                          onClick={handleExport}
                          labelClass={'ml-1'}
                          text="Export"
                          icon={<GrDownload className="mb-1" />}
                        />
                      </div>
                    </CRow>
                  </CCol>
                </CInputGroup>
              </CRow>
              <hr style={{ marginTop: '-7px' }} />
              {canAccess('spin_customer_logs', 'delete') && (
                <CRow className="mb-2" style={{ marginTop: '-5px' }}>
                  <MultiActionBar
                    onClick={(name) => handleMultiAction(name)}
                    checkBoxData={selectedCustomers}
                    module_name="spin_customer_logs"
                  />
                </CRow>
              )}
              <div className="position-relative table-responsive">
                <table className="table without-table-action">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center' }}>
                        {' '}
                        <input type="checkbox" checked={isChecked} onChange={handleSelectAll} />
                      </th>
                      <th>Customer name</th>
                      <th onClick={() => handleAdminColumnSort('mobile_number')}>
                        <span className="sortCls">
                          <span className="table-header-text-mrg">Mobile number</span>
                          {fields.sort_field !== 'mobile_number' && customerLists.length > 0 && (
                            <FaSort />
                          )}
                          {fields.sort_dir === 'asc' &&
                            fields.sort_field === 'mobile_number' &&
                            customerLists.length > 0 && <FaSortUp />}
                          {fields.sort_dir === 'desc' &&
                            fields.sort_field === 'mobile_number' &&
                            customerLists.length > 0 && <FaSortDown />}
                        </span>
                      </th>
                      <th>Prize</th>
                      <th onClick={() => handleAdminColumnSort('updatedAt')}>
                        <span className="sortCls">
                          <span className="table-header-text-mrg">Played at</span>
                          {fields.sort_field !== 'updatedAt' && customerLists.length > 0 && (
                            <FaSort />
                          )}
                          {fields.sort_dir === 'asc' &&
                            fields.sort_field === 'updatedAt' &&
                            customerLists.length > 0 && <FaSortUp />}
                          {fields.sort_dir === 'desc' &&
                            fields.sort_field === 'updatedAt' &&
                            customerLists.length > 0 && <FaSortDown />}
                        </span>
                      </th>
                      {canAccess('spin_customer_logs', 'delete') && (
                        <th width="10%" style={{ textAlign: 'center' }}>
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {customerLists.length > 0 ? (
                      customerLists.map((customerData, index) => (
                        <tr key={index}>
                          <td style={{ textAlign: 'center' }}>
                            <CheckBoxes
                              _id={customerData?.id}
                              _isChecked={selectedCustomers.includes(customerData?.id)}
                              handleCheckChieldElement={handleCheckedElement}
                            />
                          </td>
                          <td>{customerData.name ? customerData.name : '-'}</td>
                          <td>{customerData.mobile_number ? customerData.mobile_number : '-'}</td>
                          <td>{customerData.prize ? customerData.prize : '-'}</td>
                          <td>
                            {customerData?.updatedAt
                              ? new Date(customerData.updatedAt).toLocaleString()
                              : '-'}
                          </td>
                          <>
                            {canAccess('spin_customer_logs', 'delete') && (
                              <td style={{ textAlign: 'center' }}>
                                {canAccess('spin_customer_logs', 'delete') && (
                                  <CustomButton
                                    color="danger"
                                    className="ml-1 btn-sm"
                                    isToolTip={true}
                                    size="sm"
                                    toolTipContent={CustomerPageCosntants.CUSTOMER_DELETE_TITLE}
                                    text={<RiDeleteBin6Line size={'13px'} />}
                                    onClick={() => openDeletePopup(customerData.id)}
                                  />
                                )}
                              </td>
                            )}
                          </>
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
                {pagination && customerLists.length > 0 && (
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
          <CModalTitle>Delete customer logs</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <span>Are you sure you want to delete the customer logs? </span>
        </CModalBody>
        <CModalFooter>
          <CustomButton
            color="danger"
            className="btn-sm d-flex align-items-center "
            isToolTip={true}
            toolTipContent={CustomerPageCosntants.CUSTOMER_DELETE_TITLE}
            text="Yes, delete it."
            labelClass="ml-1"
            icon={<RiDeleteBin6Line />}
            onClick={deleteStore}
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

export default CustomerLogs
