import { cilCompass, cilGroup, cilUser, cilList, cilCasino } from '@coreui/icons'
import * as storage from './../helpers/storageRequests'
export const removeAuthAndRedirectToLogin = () => {
  window.location.href = '/login'
  storage.removeAuth()
}

export const generateRouteAndIconMap = (permissions) => {
  return Object.keys(permissions).reduce((acc, key) => {
    let route
    let icon
    let name

    switch (key) {
      case 'admins':
        route = '/admins'
        name = 'Admins'
        icon = cilUser
        break
      case 'admin_groups':
        route = '/groups'
        name = 'Groups'

        icon = cilGroup
        break
      case 'cms_pages':
        route = '/cms'
        name = 'CMS '
        icon = cilCompass
        break
      case 'slotmachine_config':
        route = '/slotmachine_config'
        icon = cilCasino
        name = 'Slot Machine Config'
        break
      case 'memory_config':
        route = '/memory_config'
        name = 'Memory Game Config'
        icon = cilCasino
        break
      case 'memory_logs':
        route = '/memory_logs'
        name = 'Memory Game Logs'
        icon = cilList
        break
      case 'spin_config':
        route = '/spinconfig'
        name = 'Spin Config'
        icon = cilCasino
        break
      case 'spin_customer_logs':
        route = '/spin_customer_logs'
        name = 'Spin Game logs'
        icon = cilList
        break
      case 'plinko_config':
        route = '/plinko_config'
        name = 'Plinko Game config'
        icon = cilCasino
        break
      case 'plinko_logs':
        route = '/plinko_logs'
        name = 'Plinko Game Logs'
        icon = cilList
        break
      case 'coin_flip_logs':
        route = '/coin_flip_logs'
        name = 'Coin Flip Logs'
        icon = cilList
        break
      case 'coin_flip_config':
        route = '/coin_flip_config'
        name = 'Coin Flip Config'
        icon = cilCasino
        break
      default:
        route = '/slotmachine_logs'
        icon = cilList
        name = 'Slot Machine Logs'
        break
    }

    acc[key] = { to: route, icon, name }
    return acc
  }, {})
}
export function authHeaderMutlipart(module_name = '', action = '') {
  const token = storage.getAuth()

  if (token) {
    return {
      method: 'POST',
      authorization: `Bearer ${token}`,
      module_name: module_name,
      action: action,
    }
  } else {
    return { 'Content-Type': 'application/json' }
  }
}

export const TinyReactPlugIns = [
  'advlist',
  'autolink',
  'lists',
  'link',
  'image',
  'charmap',
  'preview',
  'anchor',
  'searchreplace',
  'visualblocks',
  'code',
  'fullscreen',
  'insertdatetime',
  'media',
  'table',
  'code',
  'help',
  'wordcount',
]
