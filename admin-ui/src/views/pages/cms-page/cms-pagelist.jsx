import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormSwitch,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CustomButton from '../../../components/Button'
import { CMsPagetitleConstants } from '../../../constant/titleConstant'
import {
  admincmsstatuschange,
  admindeletecmspage,
  admingetcmspages,
} from '../../../helpers/apiRequest'
import { toast } from 'react-toastify'
import FormInput from '../../../components/FormInput'
import { useDebounce } from '../../../hooks/use-debounce'
import { IoClose } from 'react-icons/io5'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { FaSearch, FaSortUp, FaSortDown, FaSort, FaPlus } from 'react-icons/fa'
import { FaPencil } from 'react-icons/fa6'
import { GrPowerReset } from 'react-icons/gr'
import { createListSerialNo, useCanAccess } from '../../../helpers/common-unitl'
import { statusHeader } from '../../../constant/htmlConstant'
import Pagination from '../../../components/Pagination'
const CMSPageList = () => {
  const [fields, setFields] = useState({
    pageNo: 1,
    sort_dir: 'DESC',
    sort_field: 'id',
    title: '',

    totalPage: 1,
  })
  const [cmspagedata, setcmspageData] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const [deleteId, setDeleteId] = useState(null)
  const [page, setPage] = useState(1)
  const canAccess = useCanAccess()
  const fetchcmspages = async (page) => {
    try {
      const payload = {
        page,
        orderBy: fields.sort_dir,
        sortBy: fields.sort_field,
        title: fields.title,
      }
      const response = await admingetcmspages(payload)
      if (response.data.status) {
        setcmspageData(response.data.data.result)
        setFields((prevFields) => ({
          ...prevFields,
          totalPage: response.data.data.totalPage,
        }))
      } else {
        toast.error(response.data?.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }
  const debouncedSearch = useDebounce(() => {
    fetchcmspages(fields.pageNo)
  }, 400)
  useEffect(() => {
    debouncedSearch()
  }, [fields.pageNo, fields.sort_dir, fields.sort_field, fields.title, page])
  const handleSearch = (type) => {
    if (type === 'reset') {
      setFields({
        pageNo: 1,
        sort_dir: 'DESC',
        sort_field: 'id',
        title: '',
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
  const handleChange = (e) => {
    const { name, value } = e.target
    setPage(1)
    setFields((prevFields) => ({
      ...prevFields,
      pageNo: 1,
      [name]: value,
    }))
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
  const handleColumnSort = (fieldName) => {
    setFields((prevFields) => ({
      ...prevFields,
      sort_dir: prevFields.sort_dir === 'ASC' ? 'DESC' : 'ASC',
      sort_field: fieldName,
    }))
  }
  const changeStatus = async (id, status) => {
    try {
      const payload = {
        status,
      }
      const response = await admincmsstatuschange(id, payload)
      if (response.data.status) {
        debouncedSearch()
        toast.success(response.data?.message)
      } else {
        toast.error(response?.data?.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }
  const deletecmspage = async () => {
    try {
      setIsOpen(false)
      const response = await admindeletecmspage(deleteId)
      if (response.data?.status) {
        toast.success(response.data.message)
        debouncedSearch()
      } else {
        toast.error(response.data?.message)
      }
    } catch (error) {
      toast.error(err.message)
    }
  }

  const openDeletePopup = (id) => {
    setDeleteId(id)
    setIsOpen(!isOpen)
  }
  const onclose = () => {
    setIsOpen(false)
    setDeleteId(null)
  }
  return (
    <>
      <CRow>
        <CCol xl={12}>
          <CCard>
            <CCardHeader className={'font-bold font-16'}>
              {CMsPagetitleConstants.CMS_PAGE_MANAGEMENT_TEXT}
              <div className={'card-header-actions'}>
                {canAccess('cms_pages', 'create') && (
                  <Link to="/cms/add">
                    <CustomButton
                      color="primary"
                      active
                      tabIndex={-1}
                      className={'btn-sm'}
                      text={CMsPagetitleConstants.ADD_CMS_TEXT}
                      icon={<FaPlus className="mb-1 mr-1" />}
                    />
                  </Link>
                )}
              </div>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-4 custom-bottom-boder">
                <CCol xl={3}>
                  <FormInput
                    id="title"
                    placeholder="Search By Title"
                    name="title"
                    value={fields.title}
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
                    className="btn-sm mr-2   "
                    onClick={() => handleSearch('search')}
                    labelClass={'ml-1'}
                    text="Search"
                    icon={<FaSearch className="mb-1" />}
                  />
                  <CustomButton
                    type={'button'}
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
                      <th onClick={() => handleColumnSort('title')} width="70%">
                        <span className="sortCls">
                          <span className="table-header-text-mrg">Title</span>
                          {fields.sort_field !== 'title' && cmspagedata?.length > 0 && <FaSort />}
                          {fields.sort_dir === 'ASC' &&
                            fields.sort_field === 'title' &&
                            cmspagedata?.length > 0 && <FaSortUp />}
                          {fields.sort_dir === 'DESC' &&
                            fields.sort_field === 'title' &&
                            cmspagedata?.length > 0 && <FaSortDown />}
                        </span>
                      </th>
                      <th
                        onClick={() => handleColumnSort('status')}
                        width="10%"
                        style={{ textAlign: 'center' }}
                      >
                        {statusHeader(fields, cmspagedata)}
                      </th>
                      {(canAccess('cms_pages', 'update') || canAccess('cms_pages', 'delete')) && (
                        <th width="10%" style={{ textAlign: 'center' }}>
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {cmspagedata?.length > 0 ? (
                      cmspagedata?.map((u, index) => (
                        <tr key={u?.id}>
                          <td>{createListSerialNo(page, index)}</td>
                          <td>{u?.title}</td>
                          <td style={{ textAlign: 'center' }}>
                            <CFormSwitch
                              id="status"
                              type="checkbox"
                              name="status"
                              checked={u?.status}
                              onChange={() => changeStatus(u?.id, !u.status)}
                              disabled={!canAccess('cms_pages', 'update')}
                            />
                          </td>
                          {(canAccess('cms_pages', 'update') ||
                            canAccess('cms_pages', 'delete')) && (
                            <td style={{ textAlign: 'center' }}>
                              {canAccess('cms_pages', 'update') && (
                                <Link to={`/cms/edit/${u?.id}`}>
                                  <CustomButton
                                    color="primary"
                                    size="sm"
                                    type={'button'}
                                    className="ml-1 btn-sm  "
                                    isToolTip={true}
                                    toolTipContent={CMsPagetitleConstants.CMS_EDIT_TEXT}
                                    text={<FaPencil size={'12px'} />}
                                  />
                                </Link>
                              )}
                              {canAccess('cms_pages', 'delete') && (
                                <CustomButton
                                  onClick={() => openDeletePopup(u?.id)}
                                  color="danger"
                                  size="sm"
                                  type={'button'}
                                  className="ml-1  btn-sm"
                                  isToolTip={true}
                                  toolTipContent={CMsPagetitleConstants.CMS_DELETE_TEXT}
                                  text={<RiDeleteBin6Line size={'12px'} />}
                                />
                              )}
                            </td>
                          )}
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
              {cmspagedata?.length > 0 && (
                <Pagination page={page} fields={fields} handlePageChange={handlePageChange} />
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={isOpen} onClose={onclose} backdrop="static">
        <CModalHeader>
          <CModalTitle>Confirm</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this cmspage?</CModalBody>
        <CModalFooter>
          <CustomButton
            color="danger"
            className="btn-sm d-flex align-items-center"
            onClick={deletecmspage}
            labelClass={'ml-1'}
            text="Yes, delete it."
            icon={<RiDeleteBin6Line />}
          />
          <CustomButton
            color="secondary"
            className="btn-sm d-flex align-items-center "
            onClick={onclose}
            labelClass={'ml-1'}
            text="Cancel"
            icon={<IoClose />}
          />
        </CModalFooter>
      </CModal>
    </>
  )
}

export default CMSPageList
