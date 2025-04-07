import React from 'react'

const CheckBoxes = ({ _id, _isChecked, handleCheckChieldElement }) => {
  return (
    <input
      key={_id}
      type="checkbox"
      value={_id}
      checked={_isChecked}
      onChange={handleCheckChieldElement}
    />
  )
}

export default CheckBoxes
