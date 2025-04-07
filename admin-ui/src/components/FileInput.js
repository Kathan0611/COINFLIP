import React from 'react'
import PropTypes from 'prop-types'
import { CFormFeedback, CFormLabel, CInputGroup, CInputGroupText } from '@coreui/react'

const FileInput = React.forwardRef(({ icon, label, error, onChange, accept, ...props }, ref) => {
  return (
    <div className="form-group w-100">
      {label && <CFormLabel htmlFor={props.id || props.name}>{label}</CFormLabel>}
      <div>
        <CInputGroup>
          {icon && <CInputGroupText>{icon}</CInputGroupText>}
          <input
            type="file"
            ref={ref}
            accept={accept}
            onChange={onChange}
            {...props}
            className={`form-control ${error ? 'is-invalid' : ''}`}
          />
        </CInputGroup>
      </div>
      {error && <CFormFeedback className="invalid-feedback d-block">{error}</CFormFeedback>}
    </div>
  )
})

FileInput.displayName = 'FileInput'

FileInput.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  name: PropTypes.string.isRequired,
  icon: PropTypes.node,
  id: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  accept: PropTypes.string,
}

FileInput.defaultProps = {
  accept: '*/*', // Default to accept all file types
}

export default FileInput
