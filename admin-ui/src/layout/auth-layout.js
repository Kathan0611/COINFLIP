//src/layout/auth-layout.js
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AUTH_KEY } from '../helpers/storageRequests'

const AuthLayout = () => {
  const token = localStorage.getItem(AUTH_KEY)

  if (token) {
    return <Navigate to={'/dashboard'} />
  }
  return (
    <main>
      <Outlet />
    </main>
  )
}

export default AuthLayout
