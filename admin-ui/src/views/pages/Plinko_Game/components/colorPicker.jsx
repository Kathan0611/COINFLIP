import React from 'react'

const FullColorPicker = ({ selectedColor, onChange }) => {
  return (
    <input
      type="color"
      value={selectedColor}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '50px',
        height: '50px',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        background: 'none',
      }}
    />
  )
}

export default FullColorPicker
