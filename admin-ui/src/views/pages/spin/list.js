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
import React, { useEffect, useState } from 'react'
import { FaPlus, FaSearch, FaSort, FaSortDown, FaSortUp, FaCogs } from 'react-icons/fa'
import { FaPencil } from 'react-icons/fa6'
import { GrPowerReset } from 'react-icons/gr'
import { IoClose, IoSettingsOutline, IoReloadOutline } from 'react-icons/io5'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import CustomButton from '../../../components/Button'
import FormInput from '../../../components/FormInput'
import Pagination from '../../../components/Pagination'
import { showToastr } from '../../../components/ToastrNotification'
import { statusHeader } from '../../../constant/htmlConstant'
import { StorePagetitleConstants } from '../../../constant/titleConstant'
import {
  changeStoreStatus,
  deleteStoreData,
  deleteAllStoreData,
  getStoreDataList,
  resetSpinconfig,
} from '../../../helpers/apiRequest'
import { useCanAccess } from '../../../helpers/common-unitl'
import { useNavigate } from 'react-router-dom'
import '../../../scss/style.scss'
import CheckBoxes from '../../../components/Checkboxes'
import MultiActionBar from '../../../components/MultiActionBar'
const StoreManagements = () => {
  const [fields, setFields] = useState({
    sort_dir: 'desc',
    sort_field: 'id',
    store_name: '',
    store_owner: '',
    page: 1,
  })
  const [isReset, setIsReset] = useState(true)
  const [storeDataLists, setStoreDataLists] = useState([])
  const [openPopup, setOpenPopup] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)
  const canAccess = useCanAccess()
  // === Get logged user data from state === //
  const userData = useSelector((state) => state.user)
  const navigate = useNavigate()
  const [selectedStores, setselectedStores] = useState([])
  const [isChecked, setIsChecked] = useState(false)
  const [modalType, setModalType] = useState(null) // "delete" or "reset"
  const [selectedStoreId, setSelectedStoreId] = useState(null)

  // === Pagination function === //
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPage) return // Prevent out-of-range navigation

    setPage(newPage) // Update page state
    setFields((prevFields) => ({
      ...prevFields,
      page: newPage,
    }))
  }

  const openDeletePopup = (storeId, type) => {
    setSelectedStoreId(storeId)
    setModalType(type) // "delete" or "reset"
    setOpenPopup(true)
  }

  const closeDeletePopup = () => {
    setOpenPopup(false)
    setModalType(null)
    setSelectedStoreId(null)
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

  // === Reset function === //
  const handleReset = () => {
    setIsReset(!isReset)
    setPage(1)
    setFields({
      sort_dir: 'desc',
      sort_field: 'id',
      store_name: '',
      store_owner: '',
      page: 1,
    })
  }

  const handleCheckedElement = (e) => {
    const { value, checked } = e.target
    console.log(checked)
    console.log(value)
    setselectedStores((prevSelected) => {
      if (checked) {
        return [...prevSelected, parseInt(value)]
      } else {
        return prevSelected.filter((id) => id !== parseInt(value))
      }
    })
  }

  const handleSelectAll = () => {
    if (!isChecked) {
      setselectedStores(storeDataLists.map((store) => store.id))
    } else {
      setselectedStores([])
    }
    setIsChecked(!isChecked)
  }

  //Get list of stores
  const getLists = async (
    page = fields?.page,
    sort_dir = fields?.sort_dir,
    sort_field = fields?.sort_field,
    store_owner = fields?.store_owner,
    store_name = fields?.store_name,
  ) => {
    try {
      const response = await getStoreDataList({
        page,
        sort_dir,
        sort_field,
        store_owner,
        store_name,
      })
      if (response?.data?.status) {
        const dataResult = response?.data?.data
        setStoreDataLists(dataResult?.stores ?? [])
        // Ensure `result` exists
        console.log('storedata', dataResult)

        setPagination({
          current: dataResult?.pagination.current_page,
          totalPage: dataResult?.pagination.last_page,
          totalRecords: dataResult?.pagination.total,
        })
      } else {
        showToastr(response?.data?.message ?? 'Something went wrong', 'error')
      }
    } catch (error) {
      showToastr(error?.response?.data?.message ?? 'Failed to get store data', 'error')
    }
  }
  /*const getLists = async (
    page = fields?.page,
    sort_dir = fields?.sort_dir,
    sort_field = fields?.sort_field,
    store_owner = fields?.store_owner,
    store_name = fields?.store_name,
  ) => {
    try {
      const response = await getStoreDataList({
        page,
        sort_dir,
        sort_field,
        store_owner,
        store_name,
      })
      if (response?.data?.status) {
        const dataResult = response?.data?.data
        console.log('Fetched Stores:', dataResult?.stores)

        const filteredStores = (dataResult?.stores ?? []).filter((store) => store.id === 23)
        setStoreDataLists(filteredStores) // Only set stores with ID 23
        setPagination({
          current: dataResult?.pagination.current_page,
          totalPage: dataResult?.pagination.last_page,
          totalRecords: dataResult?.pagination.total,
        })
        console.log('resultData', dataResult)
      } else {
        showToastr(response?.data?.message ?? 'Something went wrong', 'error')
      }
    } catch (error) {
      showToastr(error?.response?.data?.message ?? 'Failed to get store data', 'error')
    }
  } */

  // === Change status of store === //
  const changeStoreStatusData = async (statusValue, id) => {
    try {
      const response = await changeStoreStatus(id, { status: statusValue })
      if (response?.data?.status) {
        showToastr(response?.data?.message, 'success', getLists())
      } else {
        showToastr(response?.data?.message ?? 'Someting went wrong', 'error')
      }
    } catch (error) {
      showToastr(error?.response?.data?.message ?? 'Failed to change admin status data', 'error')
    }
  }

  //Delete and resent submit in modal on submit
  const onConfirm = async () => {
    if (!selectedStoreId) {
      showToastr('Invalid store ID.', 'error')
      return
    }

    try {
      let response
      if (modalType === 'delete') {
        response = await deleteStoreData(selectedStoreId)
      } else if (modalType === 'reset') {
        response = await resetSpinconfig({ store_ids: [selectedStoreId] })
      }

      if (response?.data?.status) {
        showToastr(response?.data?.message ?? `${modalType} successful.`, 'success')
        getLists() // Refresh list after action
        closeDeletePopup()
      } else {
        showToastr(response?.data?.message ?? `Failed to ${modalType}.`, 'error')
      }
    } catch (error) {
      showToastr(error?.response?.data?.message ?? `Error in ${modalType}.`, 'error')
    }
  }

  //Delete all stores together
  const deleteAllStores = async () => {
    try {
      if (selectedStores.length === 0) {
        showToastr('Please select at least one store to delete.', 'warning')
        return
      }
      const response = await deleteAllStoreData({ id: selectedStores })
      if (response?.data?.status) {
        showToastr(
          response?.data?.message ?? 'Selected stores are deleted successfully.',
          'success',
        )
        getLists()
        setselectedStores([])
      } else {
        showToastr(response?.data?.message ?? 'Someting went wrong', 'error')
      }
    } catch (error) {
      showToastr(error?.response?.data?.message ?? 'Failed to delete selected stores', 'success')
    } finally {
    }
  }

  const handleMultiAction = async (actionType) => {
    if (selectedStores.length === 0) {
      showToastr('Please select at least one stores to proceed.', 'warning')
      return
    }

    if (actionType === 'delete') {
      await deleteAllStores()
    } else {
      showToastr('Invalid action selected.', 'error')
    }
  }

  useEffect(() => {
    getLists()
  }, [fields.page, fields.sort_dir, fields.sort_field, isReset])

  useEffect(() => {
    if (selectedStores.length === storeDataLists.length) {
      setIsChecked(true)
    } else {
      setIsChecked(false)
    }
  }, [selectedStores, storeDataLists])
  return (
    <>
      <CRow>
        <CCol xl={12}>
          <CCard className="admin-lists">
            <CCardHeader className={'font-weight-bold h5'}>
              {StorePagetitleConstants.STORE_LIST_TITLE}
              <div className={'card-header-actions'}>
                {canAccess('store', 'create') && (
                  <Link to="/stores/add">
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
              <CRow>
                <CInputGroup className="row">
                  <CCol xl={3}>
                    <FormInput
                      id="store_name"
                      placeholder="Search store name"
                      name="store_name"
                      value={fields.store_name}
                      onChange={(e) => setFields({ ...fields, store_name: e.target.value })}
                    />
                  </CCol>
                  <CCol xl={3}>
                    <FormInput
                      id="store_owner"
                      placeholder="Search owner name"
                      name="store_owner"
                      value={fields.store_owner}
                      onChange={(e) => setFields({ ...fields, store_owner: e.target.value })}
                    />
                  </CCol>
                  <CCol xl={3}>
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
                      className="btn-sm"
                      onClick={handleReset}
                      labelClass={'ml-1'}
                      text="Reset"
                      icon={<GrPowerReset className="mb-1" />}
                    />
                  </CCol>
                </CInputGroup>
              </CRow>
              <hr style={{ marginTop: '-7px' }} />
              {canAccess('store', 'delete') && (
                <CRow className="mb-2" style={{ marginTop: '-5px' }}>
                  <MultiActionBar
                    onClick={(name) => handleMultiAction(name)}
                    checkBoxData={selectedStores}
                    module_name="customer_logs"
                  />
                </CRow>
              )}
              <div className="position-relative table-responsive">
                <table className="table without-table-action">
                  <thead>
                    <tr>
                      {canAccess('store', 'delete') && (
                        <th>
                          <input type="checkbox" checked={isChecked} onChange={handleSelectAll} />
                        </th>
                      )}
                      <th onClick={() => handleAdminColumnSort('store_name')}>
                        <span className="sortCls">
                          <span className="table-header-text-mrg">Store name</span>
                          {fields.sort_field !== 'store_name' && storeDataLists.length > 0 && (
                            <FaSort />
                          )}
                          {fields.sort_dir === 'asc' &&
                            fields.sort_field === 'store_name' &&
                            storeDataLists.length > 0 && <FaSortUp />}
                          {fields.sort_dir === 'desc' &&
                            fields.sort_field === 'store_name' &&
                            storeDataLists.length > 0 && <FaSortDown />}
                        </span>
                      </th>
                      <th onClick={() => handleAdminColumnSort('store_owner')}>
                        <span className="sortCls">
                          <span className="table-header-text-mrg">Owner name</span>
                          {fields.sort_field !== 'store_owner' && storeDataLists.length > 0 && (
                            <FaSort />
                          )}
                          {fields.sort_dir === 'asc' &&
                            fields.sort_field === 'store_owner' &&
                            storeDataLists.length > 0 && <FaSortUp />}
                          {fields.sort_dir === 'desc' &&
                            fields.sort_field === 'store_owner' &&
                            storeDataLists.length > 0 && <FaSortDown />}
                        </span>
                      </th>
                      <th>Location</th>
                      <th>Mobile</th>
                      <th style={{ textAlign: 'center' }}>Min spend amount</th>
                      <th width="15%" style={{ textAlign: 'center' }}>
                        Active Template
                      </th>

                      <th
                        onClick={() => handleAdminColumnSort('status')}
                        width="10%"
                        style={{ textAlign: 'center' }}
                      >
                        {statusHeader(fields, storeDataLists)}
                      </th>
                      {(canAccess('store', 'update') ||
                        canAccess('store', 'delete') ||
                        canAccess('store', 'spin_config')) && (
                        <th width="15%" style={{ textAlign: 'center' }}>
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {storeDataLists.length > 0 ? (
                      storeDataLists.map((storeData, index) => (
                        <tr key={index}>
                          {canAccess('store', 'delete') && (
                            <td style={{ textAlign: 'center' }}>
                              <CheckBoxes
                                _id={storeData?.id}
                                _isChecked={selectedStores.includes(storeData?.id)}
                                handleCheckChieldElement={handleCheckedElement}
                              />
                            </td>
                          )}
                          <td>{storeData.store_name}</td>
                          <td>{storeData.store_owner}</td>
                          <td>{storeData.location}</td>
                          <td>{storeData.mobile}</td>
                          <td style={{ textAlign: 'center' }}>{storeData.min_spend_amount}</td>
                          <td style={{ textAlign: 'center' }}>
                            {storeData.template.length === 0
                              ? '-'
                              : storeData.template[0].allTemplates?.slice_name || '-'}
                          </td>
                          <>
                            <td style={{ textAlign: 'center' }}>
                              <CFormSwitch
                                name="status"
                                className="mr-1"
                                color="primary"
                                size="md"
                                checked={storeData.status}
                                onChange={() =>
                                  changeStoreStatusData(!storeData.status, storeData.id)
                                }
                                disabled={!canAccess('store', 'update')}
                              />
                            </td>

                            {(canAccess('store', 'update') ||
                              canAccess('store', 'delete') ||
                              canAccess('store', 'spin_config')) && (
                              <td style={{ textAlign: 'center' }}>
                                {canAccess('store', 'update') && (
                                  <Link to={`/stores/edit/${storeData.id}`}>
                                    <CustomButton
                                      color="primary"
                                      className="ml-1 btn-sm"
                                      isToolTip={true}
                                      size="sm"
                                      toolTipContent={StorePagetitleConstants.STORE_EDIT_TITLE}
                                      text={<FaPencil size={'13px'} />}
                                    />
                                  </Link>
                                )}
                                {canAccess('store', 'delete') && (
                                  <CustomButton
                                    color="danger"
                                    className="ml-1 btn-sm"
                                    isToolTip={true}
                                    size="sm"
                                    toolTipContent={StorePagetitleConstants.STORE_DELETE_TITLE}
                                    text={<RiDeleteBin6Line size={'13px'} />}
                                    onClick={() => openDeletePopup(storeData.id, 'delete')}
                                  />
                                )}
                       
                                {canAccess('store', 'spin_config') && (
                                  <CustomButton
                                    color="warning"
                                    className="ml-1 btn-sm"
                                    isToolTip={true}
                                    size="sm"
                                    toolTipContent={StorePagetitleConstants.STORE_SPIN_CONFIG_TITLE}
                                    text={
                                      <IoSettingsOutline size={'13px'} style={{ color: 'white' }} />
                                    }
                                    onClick={() => navigate(`/stores/spinconfig/${storeData.id}`)}
                                  />
                                )}
                                {storeData.template.length > 0 &&
                                  canAccess('store', 'spin_config') && (
                                    <CustomButton
                                      color="danger"
                                      className="ml-1 btn-sm"
                                      isToolTip={true}
                                      size="sm"
                                      toolTipContent={
                                        StorePagetitleConstants.STORE_RESET_SPIN_CONFIG
                                      }
                                      text={<IoReloadOutline size={'13px'} />}
                                      onClick={() => openDeletePopup(storeData.id, 'reset')}
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
                {pagination && storeDataLists.length > 0 && (
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
          <CModalTitle>
            {modalType === 'delete' ? 'Delete Store' : 'Reset Configuration'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <span>
            {modalType === 'delete'
              ? 'Are you sure you want to delete this store?'
              : 'Are you sure you want to reset the spin rewards?'}
          </span>
        </CModalBody>
        <CModalFooter>
          <CustomButton
            color="danger"
            className="btn-sm d-flex align-items-center"
            text={modalType === 'delete' ? 'Yes, delete it.' : 'Yes, reset it.'}
            labelClass="ml-1"
            onClick={onConfirm} // Calls the appropriate API
          />
          <CustomButton
            color="secondary"
            className="btn-sm d-flex align-items-center"
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

export default StoreManagements
