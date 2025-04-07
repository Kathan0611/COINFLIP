import { cilDrop, cilPencil, cilUser, cilUserFollow } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavItem, CNavTitle } from '@coreui/react'
import React from 'react'

const _nav = [
  {
    component: CNavTitle,
    name: 'Access',
  },
  {
    component: CNavItem,
    name: 'Colors',
    to: '/theme/colors',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Typography',
    to: '/theme/typography',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Admins',
  },
  {
    component: CNavItem,
    name: 'Admins',
    to: '/admins',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Groups',
    to: '/groups',
    icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
  },
]

export default _nav

export const permissionsArray = []
