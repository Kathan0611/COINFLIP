//src/components/AppSidebar.js
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CCloseButton, CNavItem, CSidebar, CSidebarBrand, CSidebarHeader } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import { generateRouteAndIconMap } from '../utils/common'
import { permissionsArray } from '../_nav'
import { cilSpeedometer } from '@coreui/icons'

const AppSidebar = () => {
  let permissionData = permissionsArray
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const user = useSelector((state) => state?.user)

  const permissions = user && JSON.parse(user?.admin_permission)
  if (permissions) {
    const dashboardItem = {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    }

    const keyToRouteAndIcon = generateRouteAndIconMap(permissions)
    const insertionIndex = permissionData?.findIndex((item) => item?.name === 'Module Access') + 1
    const newItems = Object.keys(permissions)
      .filter((key) => permissions[key].includes('view'))
      .map((key) => ({
        component: CNavItem,
        name: keyToRouteAndIcon[key]?.name,
        to: keyToRouteAndIcon[key]?.to || '/default-route',
        icon: <CIcon icon={keyToRouteAndIcon[key]?.icon} customClassName="nav-icon" />,
      }))

    const filteredNewItems = newItems.filter(
      (newItem) => !permissionData?.some((existingItem) => existingItem?.name === newItem?.name),
    )
    if (filteredNewItems.length > 0) {
      permissionData?.splice(insertionIndex, 0, ...filteredNewItems)
    }
    const dashboardExists = permissionData?.some((item) => item?.name === 'Dashboard')
    if (!dashboardExists) {
      permissionData?.unshift(dashboardItem)
    } else {
      permissionData = permissionData.filter((item) => item?.name !== 'Dashboard')
      permissionData?.unshift(dashboardItem)
    }
    // permissionsArray.unshift(dashboardItem)
  }

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      {user && <AppSidebarNav items={permissionData} />}
      {/* <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter> */}
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
