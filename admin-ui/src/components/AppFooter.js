import React from 'react'
import { CFooter } from '@coreui/react'
export const APP_NAME = import.meta.env.VITE_APP_NAME
const AppFooter = () => {
  const currentYear = new Date().getFullYear()
  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1">
          &copy; {currentYear} {APP_NAME}
        </span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
