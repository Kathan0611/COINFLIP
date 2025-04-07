import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  let separateWord = s.toLowerCase().split(' ')
  for (let i = 0; i < separateWord.length; i++) {
    separateWord[i] = separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1)
  }
  return separateWord.join(' ')
}
// === Check the seeing data is logged on user's or not  === //
export const isLoggedUserDataOwner = (userData, dataId) => {
  if (userData) {
    return userData?.id == dataId
  }
  return false
}
export const isLoggedAdminGroupDataOwner = (userData, dataId) => {
  if (userData) {
    return userData?.admin_group_id == dataId
  }
  return false
}
// === Create serial number using page and  index === //
export const createListSerialNo = (page, index) => {
  return (page - 1) * 10 + (index + 1)
}

export const useCanAccess = () => {
  const user = useSelector((state) => state?.user)
  const navigate = useNavigate()
  const hasAccess = (module, access = '', redirect = '') => {
    if (user) {
      const permissions = user && JSON.parse(user?.admin_permission)
      if (permissions[module] !== undefined && permissions[module].includes(access)) {
        return true
      } else if (redirect !== '') {
        toast.error('Access Denied Contact to Super User')
        navigate(redirect)
      } else if (redirect === '') {
        return false
      }
    }
    return false
  }
  return hasAccess
}
