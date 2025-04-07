import React from 'react'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'

const CustomTable = ({ columns, data, pagination, onPageChange, onEdit, onDelete }) => {
  const getCellValue = (column, item) => {
    if (column.key === 'status') {
      return item[column.key] ? 'Active' : 'Inactive'
    }
    return item[column.key]
  }

  return (
    <div>
      <CTable hover responsive>
        <CTableHead>
          <CTableRow>
            {columns?.map((column) => (
              <CTableHeaderCell key={column.key}>{column.label}</CTableHeaderCell>
            ))}
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data?.map((item) => (
            <CTableRow key={item.id}>
              {columns?.map((column) => (
                <CTableDataCell key={column.key}>{getCellValue(column, item)}</CTableDataCell>
              ))}
              <CTableDataCell>
                <CButton color="primary" size="sm" className="me-2" onClick={() => onEdit(item)}>
                  <CIcon icon={cilPencil} size="sm" /> Edit
                </CButton>
                <CButton color="danger" size="sm" onClick={() => onDelete(item)}>
                  <CIcon icon={cilTrash} size="sm" /> Delete
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      {pagination && (
        <div className="d-flex justify-content-end">
          <CPagination aria-label="Page navigation">
            <CPaginationItem
              aria-label="Previous"
              disabled={pagination.current === 1}
              onClick={() => onPageChange(pagination.current - 1)}
            >
              <span aria-hidden="true">&laquo;</span>
            </CPaginationItem>
            {[...Array(pagination?.total)].map((_, index) => (
              <CPaginationItem
                key={`page-${index + 1}`}
                active={index + 1 === pagination.current}
                onClick={() => onPageChange(index + 1)}
              >
                {index + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              aria-label="Next"
              disabled={pagination?.current === pagination.total}
              onClick={() => onPageChange(pagination?.current + 1)}
            >
              <span aria-hidden="true">&raquo;</span>
            </CPaginationItem>
          </CPagination>
        </div>
      )}
    </div>
  )
}

export default CustomTable
