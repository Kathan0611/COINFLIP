// import React from 'react'
// import { CButton, CTooltip } from '@coreui/react'
// import PropTypes from 'prop-types'

// const CustomButton = ({
//   text,
//   color,
//   className,
//   disabled,
//   type,
//   onClick,
//   icon,
//   labelClass,
//   isToolTip = false,
//   toolTipContent = '',
//   id,
// }) => {
//   const button = (
//     <CButton
//       color={color}
//       id={id}
//       className={className}
//       disabled={disabled}
//       type={type}
//       onClick={onClick}
//     >
//       {icon ?? ''}
//       <span className={labelClass}>{text}</span>
//     </CButton>
//   )
//   return <>{!isToolTip ? button : <CTooltip content={toolTipContent}>{button}</CTooltip>}</>
// }

// CustomButton.propTypes = {
//   text: PropTypes.string,
//   color: PropTypes.string,
//   className: PropTypes.string,
//   labelClass: PropTypes.string,
//   disabled: PropTypes.bool,
//   type: PropTypes.string,
//   onClick: PropTypes.func,
//   icon: PropTypes.element,
//   isToolTip: PropTypes.bool,
//   toolTipContent: PropTypes.string,
//   id: PropTypes.string,
// }

// CustomButton.defaultProps = {
//   color: 'primary',
//   className: '',
//   disabled: false,
//   type: 'button',
//   labelClass: '',
// }

// export default CustomButton
import React from 'react'
import { CButton, CTooltip } from '@coreui/react'
import PropTypes from 'prop-types'

const CustomButton = ({
  text,
  color = 'primary',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  icon,
  labelClass = '',
  isToolTip = false,
  toolTipContent = '',
  id,
}) => {
  const button = (
    <CButton
      color={color}
      id={id}
      className={className}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {icon ?? ''}
      <span className={labelClass}>{text}</span>
    </CButton>
  )
  return <>{!isToolTip ? button : <CTooltip content={toolTipContent}>{button}</CTooltip>}</>
}

CustomButton.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
  labelClass: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.element,
  isToolTip: PropTypes.bool,
  toolTipContent: PropTypes.string,
  id: PropTypes.string,
}

export default CustomButton
