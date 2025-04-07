//App.js
import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import AuthLayout from './layout/auth-layout'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const ForgotPasswordPage = React.lazy(() => import('./views/pages/forgot-password/forgot-password'))
const ReSetPasswordPage = React.lazy(() => import('./views/pages/reset-password/reset-password'))

const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme =
      urlParams.get('theme') && RegExp(/^[A-Za-z0-9\s]+/).exec(urlParams.get('theme'))[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route element={<AuthLayout />}>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route
              path="/forgot-password"
              name="For Got Password Page"
              element={<ForgotPasswordPage />}
            />
            <Route
              path="/reset-password/:token"
              name="Reset Password Page"
              element={<ReSetPasswordPage />}
            />
          </Route>

          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        theme="light"
      />
    </BrowserRouter>
  )
}

export default App
