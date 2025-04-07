import React from 'react'
import PropTypes from 'prop-types'
import { CFormFeedback, CFormInput, CFormLabel, CInputGroup, CInputGroupText } from '@coreui/react'

const FormInput = React.forwardRef(({ icon, label, error, ...props }, ref) => {
  return (
    <div className="form-group w-100">
      {label && <CFormLabel htmlFor={props.id || props.name}>{label}</CFormLabel>}
      <div>
        <CInputGroup>
          {icon && <CInputGroupText>{icon}</CInputGroupText>}
          <CFormInput ref={ref} invalid={!!error} {...props} />
        </CInputGroup>
      </div>

      {error && <CFormFeedback className="invalid-feedback d-block">{error}</CFormFeedback>}
    </div>
  )
})

FormInput.displayName = 'FormInput'

FormInput.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  icon: PropTypes.node,
  id: PropTypes.string,
}

FormInput.defaultProps = {
  type: 'text',
}

export default FormInput
