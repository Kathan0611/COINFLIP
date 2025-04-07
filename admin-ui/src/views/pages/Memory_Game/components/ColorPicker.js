import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { CFormLabel, CFormFeedback, CFormInput } from '@coreui/react'

const ColorPicker = ({ label, value, onChange, error, disabled, ...props }) => {
  const [color, setColor] = useState(value || '#000000')

  // Update local state if value prop changes from parent.
  useEffect(() => {
    if (value && value !== color) {
      setColor(value)
    }
  }, [value, color])

  // Handle color picker changes.
  const handleColorChange = (e) => {
    const newColor = e.target.value
    setColor(newColor)
    if (onChange) {
      onChange(newColor)
    }
  }

  // Handle text input changes.
  const handleTextChange = (e) => {
    let newColor = e.target.value
    // Ensure the value starts with '#' if not empty.
    if (newColor && newColor[0] !== '#') {
      newColor = '#' + newColor
    }
    setColor(newColor)
    if (onChange) {
      onChange(newColor)
    }
  }

  return (
    <div className="mb-3">
      {label && <CFormLabel>{label}</CFormLabel>}
      <div className="d-flex align-items-center">
        <input
          type="color"
          value={/^#[0-9A-Fa-f]{6}$/.test(color) ? color : '#000000'}
          onChange={handleColorChange}
          className="border-0 p-0 me-3"
          style={{ width: '40px', height: '40px', cursor: 'pointer' }}
          disabled={disabled}
          {...props}
        />
        <CFormInput
          type="text"
          value={color}
          onChange={handleTextChange}
          placeholder="#000000"
          className="me-3"
          style={{ maxWidth: '120px' }}
          disabled={disabled}
        />
      </div>
      {error && <CFormFeedback className="d-block">{error}</CFormFeedback>}
    </div>
  )
}

ColorPicker.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  disabled: PropTypes.bool,
}

ColorPicker.defaultProps = {
  disabled: false,
}

export default ColorPicker
