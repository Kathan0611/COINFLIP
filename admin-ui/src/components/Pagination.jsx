import React from 'react'
import { CPagination, CPaginationItem } from '@coreui/react'
import PropTypes from 'prop-types'

const Pagination = ({ page, fields, handlePageChange }) => {
  const { totalPage } = fields
  const maxPagesToShow = 4 // Limit to 4 page numbers at a time

  let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2))
  let endPage = startPage + maxPagesToShow - 1

  if (endPage > totalPage) {
    endPage = totalPage
    startPage = Math.max(1, endPage - maxPagesToShow + 1)
  }

  const pageNumbers = []
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  return (
    <CPagination align="end" aria-label="Page navigation example" className="mt-3">
      {/* Previous Button */}
      <CPaginationItem
        aria-label="Previous"
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
      >
        &laquo;
      </CPaginationItem>

      {/* Show "1 ..." when pages are skipped */}
      {startPage > 1 && (
        <>
          <CPaginationItem onClick={() => handlePageChange(1)}>1</CPaginationItem>
          {startPage > 2 && <CPaginationItem disabled>...</CPaginationItem>}
        </>
      )}

      {/* Show limited page numbers */}
      {pageNumbers.map((pageNum) => (
        <CPaginationItem
          key={pageNum}
          active={pageNum === page}
          onClick={() => handlePageChange(pageNum)}
        >
          {pageNum}
        </CPaginationItem>
      ))}

      {/* Show "... lastPage" when pages are skipped */}
      {endPage < totalPage && (
        <>
          {endPage < totalPage - 1 && <CPaginationItem disabled>...</CPaginationItem>}
          <CPaginationItem onClick={() => handlePageChange(totalPage)}>{totalPage}</CPaginationItem>
        </>
      )}

      {/* Next Button */}
      <CPaginationItem
        aria-label="Next"
        disabled={page === totalPage}
        onClick={() => handlePageChange(page + 1)}
      >
        &raquo;
      </CPaginationItem>
    </CPagination>
  )
}

Pagination.propTypes = {
  fields: PropTypes.shape({
    totalPage: PropTypes.number.isRequired,
  }).isRequired,
  page: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
}

export default Pagination
