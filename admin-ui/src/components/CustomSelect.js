import React, { useRef, useEffect } from 'react'
import Select from 'react-select'
import { CFormFeedback } from '@coreui/react'

const CustomSelect = ({
  name,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  error,
  isMulti = false,
}) => {
  const wrapperRef = useRef(null)
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      // Handle click outside if needed (e.g., close the dropdown)
    }
  }

  return (
    <div ref={wrapperRef} className="custom-select-wrapper">
      <Select
        name={name}
        classNames={{
          control: (state) => (state.isFocused ? 'select-focus' : ''),
        }}
        value={options.filter((o) => (isMulti ? value?.includes(o.value) : o?.value === value))}
        onChange={(selectedOption) => {
          onChange(isMulti ? selectedOption.map((option) => option.value) : selectedOption.value)
        }}
        options={options}
        placeholder={placeholder}
        isMulti={isMulti}
        className="react-select-container"
        classNamePrefix="react-select"
      />
      {error && (
        <CFormFeedback className="invalid-feedback d-block" invalid>
          {error}
        </CFormFeedback>
      )}
    </div>
  )
}

export default CustomSelect
