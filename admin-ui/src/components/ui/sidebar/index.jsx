//src/src/components/ui/sidebar/index.jsx
import React from 'react'
import {
  CCloseButton,
  CModalFooter,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
} from '@coreui/react'
import PropTypes from 'prop-types'
import './sidebar.styles.scss'

const width = {
  sm: '25%',
  md: '50%',
  lg: '75%',
  xl: '100%',
}

const SidebarWrapper = ({ children, size = 'md', title, onHide, isShow, footerContent }) => {
  const vars = {
    '--cui-offcanvas-width': width[size] ?? size,
  }

  return (
    <COffcanvas
      className="sidebar-wrapper"
      style={vars}
      placement="end"
      visible={isShow}
      onHide={onHide}
    >
      <COffcanvasHeader className="sidebar-header">
        <COffcanvasTitle>{title}</COffcanvasTitle>
        <CCloseButton className="text-reset" onClick={onHide} />
      </COffcanvasHeader>
      <hr />
      <COffcanvasBody>{children}</COffcanvasBody>
      <hr />
      <CModalFooter className="sidebar-footer">{footerContent}</CModalFooter>
    </COffcanvas>
  )
}

SidebarWrapper.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  isShow: PropTypes.bool,
  onHide: PropTypes.func,
  footerContent: PropTypes.node,
}

export default SidebarWrapper
