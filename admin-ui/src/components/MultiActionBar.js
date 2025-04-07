import React, { useState } from 'react'
import {
  CCol,
  CRow,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CButton,
  CModalBody,
  CTooltip,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { useCanAccess } from '../helpers/common-unitl'

const globalConstants = {
  SINGLE_DELETE_MSG: 'Are you sure you want to delete this record?',
  MULTI_DELETE_MSG: 'Are you sure you want to delete these records?',
}

const MultiActionBar = ({ onClick, checkBoxData, module_name }) => {
  const canAccess = useCanAccess
  const [openPopup, setOpenPopup] = useState(false)
  const [actionName, setActionName] = useState('')
  const [popupMessage, setPopupMessage] = useState('')

  const selectedItems = Object.keys(checkBoxData).filter((key) => checkBoxData[key])

  const handleChange = (event) => {
    setActionName(event.target.value)
  }

  const handleApplyAction = () => {
    onClick(actionName)
    setOpenPopup(false)
  }

  const handleApplyButtonClick = () => {
    if (!selectedItems.length) {
      return toast.error('Please select at least one record.')
    }

    if (!actionName) {
      return toast.error('Please select an action.')
    }

    const modelPopupMessage =
      selectedItems.length === 1
        ? globalConstants.SINGLE_DELETE_MSG
        : globalConstants.MULTI_DELETE_MSG
    setPopupMessage(modelPopupMessage)
    setOpenPopup(true)
  }

  return (
    (canAccess(module_name, 'delete') || canAccess(module_name, 'update')) && (
      <>
        <CRow className="align-items-center">
          <CCol xs="3">
            <CFormSelect
              id="action_name"
              name="action_name"
              className="form-control rounded"
              onChange={handleChange}
              value={actionName}
            >
              <option value="">-- Bulk Action --</option>
              {canAccess(module_name, 'delete') && module_name !== 'user_groups' && (
                <option value="delete">Delete</option>
              )}
            </CFormSelect>
          </CCol>
          <CCol xs="2">
            <CTooltip content="Apply selected action">
              <CButton
                color="primary"
                className="w-100 rounded shadow-sm"
                onClick={handleApplyButtonClick}
                disabled={!actionName || !selectedItems.length}
              >
                Apply
              </CButton>
            </CTooltip>
          </CCol>
        </CRow>

        <CModal visible={openPopup} onClose={() => setOpenPopup(false)} color="danger">
          <CModalHeader closeButton>
            <CModalTitle>Bulk Action</CModalTitle>
          </CModalHeader>
          <CModalBody>{popupMessage}</CModalBody>
          <CModalFooter>
            <CButton color="danger" onClick={handleApplyAction}>
              Apply
            </CButton>
            <CButton color="secondary" onClick={() => setOpenPopup(false)}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      </>
    )
  )
}

export default MultiActionBar
