//src/helpers/apiRequest.js
import { axiosInstance } from '../plugin/axios'
import * as apiUrl from '../constant/urls'
export const API_ENDPOINT = import.meta.env.VITE_APP_API_ENDPOINT

// =================== LOGIN SERVICE  =========================

const API_login = `${API_ENDPOINT}${apiUrl.loginUrl}`
const API_verifyLoginOtp = `${API_ENDPOINT}${apiUrl.verifyLoginOtpUrl}`
const API_resendLoginOtp = `${API_ENDPOINT}${apiUrl.resendLoginOtpUrl}`
const API_resetPassword = `${API_ENDPOINT}${apiUrl.resetPasswordUrl}`
const API_ADMIN_GROUP_LIST = `${API_ENDPOINT}${apiUrl.adminGroupListUrl}`
const API_ADMIN_GROUP_DELETE = `${API_ENDPOINT}${apiUrl.adminGroupDelete}`
const API_ADMIN_FORGOT_PASSWORD = `${API_ENDPOINT}${apiUrl.forgotpasswordUrl}`
const API_ADMIN_RESET_PASSWORD = `${API_ENDPOINT}${apiUrl.resetPasswordUrl}`
const API_ADMIN_GROUP_STATUS_UPDATE = `${API_ENDPOINT}${apiUrl.adminGroupStatusUpdate}`
const API_ADMIN_PROFILE = `${API_ENDPOINT}${apiUrl.adminProfileUrl}`
// ======== ADMIN SERVICE ======= //
const API_ADMIN_CREATE = `${API_ENDPOINT}${apiUrl.createAdmin}`
const API_ADMIN_VIEW = `${API_ENDPOINT}${apiUrl.viewAdmin}`
const API_ADMIN_UPDATE = `${API_ENDPOINT}${apiUrl.updateAdmin}`
const API_ADMIN_SYSTEM_MODULE_LIST = `${API_ENDPOINT}${apiUrl.getSystemModulesList}`
const API_ADMIN_GET_MEDIALIST = `${API_ENDPOINT}${apiUrl.getMediaList}`
const API_ADMIN_DELETEMEDIA = `${API_ENDPOINT}${apiUrl.deleteMedia}`
const API_ADMIN_CREATE_CMS_PAGE = `${API_ENDPOINT}${apiUrl.createcmspage}`
const API_ADMIN_GROUP_ADD = `${API_ENDPOINT}${apiUrl.adminGroupAddUrl}`
const API_ADMIN_GROUP_DETAILS = `${API_ENDPOINT}${apiUrl.adminGroupDetailsUrl}`
const API_ADMIN_GROUP_UPDATE = `${API_ENDPOINT}${apiUrl.adminGroupUpdateUrl}`
const API_ADMIN_DELETE = `${API_ENDPOINT}${apiUrl.deleteAdmin}`
const API_ADMIN_CHANGE_STATUS = `${API_ENDPOINT}${apiUrl.changeAdminStatus}`
const API_ADMIN_DATA_GROUP_LIST = `${API_ENDPOINT}${apiUrl.adminGroupDataList}`
const API_ADMIN_DATA_LIST = `${API_ENDPOINT}${apiUrl.adminDataList}`
const API_ADMIN_CMSPAGE_LIST = `${API_ENDPOINT}${apiUrl.admingetcmspage}`
const API_ADMIN_CMSSTATUS_CHANGE = `${API_ENDPOINT}${apiUrl.admincmspagestatuschange}`
const API_ADMIN_DELETECMSPAGE = `${API_ENDPOINT}${apiUrl.deletecmspage}`
const API_ADMIN_GETCMSPAGEBYID = `${API_ENDPOINT}${apiUrl.getcmsbyid}`
const API_ADMIN_EDITCMSPAGE = `${API_ENDPOINT}${apiUrl.editcmspage}`

const API_ADMIN_SETSLOT_MACHINEGAMECONFIG = `${API_ENDPOINT}${apiUrl.setSlotMachinegameconfig}` //for setrequest
const API_ADMIN_GETSLOT_MACHINEGAMECONFIG = `${API_ENDPOINT}${apiUrl.getSlotMachinegameconfigcontent}` //for getrequest
const API_ADMIN_DELETESLOT_MACHINEUSERLOGGS = `${API_ENDPOINT}${apiUrl.deleteSlotMachineuserloggs}` //for getrequest
const API_ADMIN_GETSLOT_MACHINEUSERLOGGS = `${API_ENDPOINT}${apiUrl.getSlotMachineuserloggs}`
const API_ADMIN_DELETEALLSLOT_MACHINEUSERLOGGS = `${API_ENDPOINT}${apiUrl.deleteAllSlotMachineuserloggs}` //for getrequest
const API_ADMIN_EXPORTSLOT_MACHINEUSERLOGGS = `${API_ENDPOINT}${apiUrl.exportSlotMachineuserloggs}` //for getrequest

const API_ADMIN_SETMEMORYGAMECONFIG = `${API_ENDPOINT}${apiUrl.setMemoryGameConfig}`
const API_ADMIN_GETMEMORYGAMECONFIG = `${API_ENDPOINT}${apiUrl.getMemoryGameConfig}`
const API_ADMIN_GETMEMORYGAMEUSERLOGS = `${API_ENDPOINT}${apiUrl.getMemoryGameuserlogs}`
const API_ADMIN_DELETEMEMORYGAMEUSERLOGS = `${API_ENDPOINT}${apiUrl.deleteMemoryGameUserLog}`
const API_ADMIN_DELETEALLMEMORYGAMEUSERLOGGS = `${API_ENDPOINT}${apiUrl.deleteAllMemoryGameUserLogs}` //for getrequest
const API_ADMIN_EXPORTMEMORYGAMEUSERLOGS = `${API_ENDPOINT}${apiUrl.exportMemoryGameUserLogs}` //for getrequest

const API_SPIN_TEMPLATEDATA = `${API_ENDPOINT}${apiUrl.getSpinTemplatedata}`
const API_SPIN_CONFIG = `${API_ENDPOINT}${apiUrl.getSpinConfig}`
const API_CUSTOMER_LIST = `${API_ENDPOINT}${apiUrl.customerLogs}`
const API_CUSTOMER_DELETE = `${API_ENDPOINT}${apiUrl.deleteCustomerLogs}`
const API_ALL_CUSTOMER_DELETE = `${API_ENDPOINT}${apiUrl.deleteAllCustomerLogs}`
const API_CUSTOMER_LOGS = `${API_ENDPOINT}${apiUrl.exportCustomerLogs}`
const API_SPIN_UPDATE = `${API_ENDPOINT}${apiUrl.Spinconfig}`

const API_ADMIN_SETPLINKOGAMECONFIG = `${API_ENDPOINT}${apiUrl.setPlinkoGameConfig}`
const API_ADMIN_GETPLINKOGAMECONFIG = `${API_ENDPOINT}${apiUrl.getPlinkoGameConfig}`
const API_ADMIN_GETPLINKOGAMEUSERLOGS = `${API_ENDPOINT}${apiUrl.getPlinkoGameuserlogs}`
const API_ADMIN_DELETEPLINKOGAMEUSERLOGS = `${API_ENDPOINT}${apiUrl.deletePlinkoGameUserLog}`
const API_ADMIN_DELETEALLPLINKOGAMEUSERLOGS = `${API_ENDPOINT}${apiUrl.deleteAllPlinkoGameUserLogs}`
const API_ADMIN_EXPORTPLINKOGAMEUSERLOGS = `${API_ENDPOINT}${apiUrl.exportPlinkoGameUserLogs}`

const API_ADMIN_SETCOINFLIPGAMECONFIG = `${API_ENDPOINT}${apiUrl.setCoinFlipGameConfig}`
const API_ADMIN_GETCOINFLIPGAMECONFIG = `${API_ENDPOINT}${apiUrl.getCoinFlipGameConfig}`
const API_ADMIN_GETCOINFLIPGAMEUSERLOGS = `${API_ENDPOINT}${apiUrl.getCoinFlipuserlogs}`
const API_ADMIN_DELETECOINFLIPGAMEUSERLOGS = `${API_ENDPOINT}${apiUrl.deleteCoinFlipGameUserLogs}`
const API_ADMIN_DELETEALLCOINFLIPGAMEUSERLOGS = `${API_ENDPOINT}${apiUrl.deleteAllCoinFlipGameUserLogs}`
const API_ADMIN_EXPORTCOINFLIPGAMEUSERLOGS = `${API_ENDPOINT}${apiUrl.exportCoinFlipGameUserLogs}`
// ----------------------------- LOGIN ---------------------------------------

// POST @login API
// @params email, password
export const loginUser = (creds) => {
  return axiosInstance.post(API_login, creds)
}

export const AdminForgotPassword = (data) => {
  return axiosInstance.post(API_ADMIN_FORGOT_PASSWORD, data)
}

export const AdminResetPassword = (data) => {
  return axiosInstance.post(API_ADMIN_RESET_PASSWORD, data)
}
// POST @verifyLoginOtp API
// @params mobile_number, user_otp
export const verifyLoginOtp = (params) => {
  return axiosInstance.post(`${API_verifyLoginOtp}`, params)
}

// POST @resendLoginOtp API
// @params mobile_number, user_otp
export const resendLoginOtp = (params) => {
  return axiosInstance.post(`${API_resendLoginOtp}`, params)
}

//POST @resetPassword API
// @params email
export const resetPassword = (params) => {
  return axiosInstance.post(`${API_resetPassword}`, params)
}

//User Profile APIs
export const getAdminProfileData = () => {
  return axiosInstance.get(API_ADMIN_PROFILE)
}
export const updateUserProfileData = (params) => {
  return axiosInstance.post(`${API_ADMIN_PROFILE}`, params)
}

export const adminGroupList = (payload) => {
  return axiosInstance.post(`${API_ADMIN_GROUP_LIST}`, payload)
}

export const deleteAdminGroup = (id) => {
  return axiosInstance.delete(`${API_ADMIN_GROUP_DELETE}/${id}`)
}

export const changeAdminGroupStatus = (id, payload) => {
  return axiosInstance.patch(`${API_ADMIN_GROUP_STATUS_UPDATE}/${id}`, payload)
}
//Admin module API calls
export const createNewAdmin = (params) => {
  return axiosInstance.post(`${API_ADMIN_CREATE}`, params)
}
export const getAdminData = (id) => {
  return axiosInstance.get(`${API_ADMIN_VIEW}${id}`)
}
export const updateAdminData = (id, params) => {
  return axiosInstance.post(`${API_ADMIN_UPDATE}${id}`, params)
}
export const deleteAdminData = (id) => {
  return axiosInstance.delete(`${API_ADMIN_DELETE}${id}`)
}
export const changeAdminStatus = (id, params) => {
  return axiosInstance.post(`${API_ADMIN_CHANGE_STATUS}${id}`, params)
}
export const getAdminDataList = (params) => {
  return axiosInstance.post(`${API_ADMIN_DATA_LIST}`, params)
}
export const getAdminGroupData = () => {
  return axiosInstance.get(`${API_ADMIN_DATA_GROUP_LIST}`)
}

//System module API calls
export const getSystemModulesList = () => {
  return axiosInstance.get(`${API_ADMIN_SYSTEM_MODULE_LIST}`)
}

export const getMedia = () => {
  return axiosInstance.get(API_ADMIN_GET_MEDIALIST)
}

export const deleteMedia = (id) => {
  return axiosInstance.delete(`${API_ADMIN_DELETEMEDIA}/${id}`)
}

export const admincreateNewCMSPages = (data) => {
  return axiosInstance.post(API_ADMIN_CREATE_CMS_PAGE, data)
}
export const createAdminGroup = (payload) => {
  return axiosInstance.post(`${API_ADMIN_GROUP_ADD}`, payload)
}

export const getAdminGroupDetails = (id) => {
  return axiosInstance.get(`${API_ADMIN_GROUP_DETAILS}/${id}`)
}
export const updateAdminGroup = (id, payload) => {
  return axiosInstance.put(`${API_ADMIN_GROUP_UPDATE}/${id}`, payload)
}

export const admingetcmspages = (data) => {
  return axiosInstance.post(API_ADMIN_CMSPAGE_LIST, data)
}
export const admincmsstatuschange = (id, data) => {
  return axiosInstance.patch(`${API_ADMIN_CMSSTATUS_CHANGE}/${id}`, data)
}

export const admindeletecmspage = (id) => {
  return axiosInstance.delete(`${API_ADMIN_DELETECMSPAGE}/${id}`)
}
export const admingetcmsPagecontentbyid = (id) => {
  return axiosInstance.get(`${API_ADMIN_GETCMSPAGEBYID}/${id}`)
}
export const admineditcmspagecontent = (id, payload) => {
  return axiosInstance.put(`${API_ADMIN_EDITCMSPAGE}/${id}`, payload)
}

/*Slot_machine Game API*/

export const adminsetSlotMachineconfig = (payload) => {
  return axiosInstance.post(`${API_ADMIN_SETSLOT_MACHINEGAMECONFIG}`, payload)
}

export const admingetSlotMachineconfigcontent = () => {
  return axiosInstance.get(`${API_ADMIN_GETSLOT_MACHINEGAMECONFIG}`)
}

export const admindeleteSlotMachineuserloggs = (id) => {
  return axiosInstance.delete(`${API_ADMIN_DELETESLOT_MACHINEUSERLOGGS}/${id}`)
}

export const admingetSlotMachineuserloggs = (queryParams) => {
  return axiosInstance.post(`${API_ADMIN_GETSLOT_MACHINEUSERLOGGS}`, queryParams)
}

export const admindeleteAllSlotMachineuserloggs = (queryParams) => {
  return axiosInstance.post(`${API_ADMIN_DELETEALLSLOT_MACHINEUSERLOGGS}`, queryParams)
}

export const adminexportSlotMachineuserloggs = (queryParams) => {
  return axiosInstance.post(`${API_ADMIN_EXPORTSLOT_MACHINEUSERLOGGS}`, queryParams)
}

/*Memory Game API*/
export const adminSetMemoryGameConfig = (payload) => {
  return axiosInstance.post(`${API_ADMIN_SETMEMORYGAMECONFIG}`, payload)
}
export const adminGetMemoryGameConfig = (payload) => {
  return axiosInstance.get(`${API_ADMIN_GETMEMORYGAMECONFIG}`, payload)
}
export const adminGetMemoryGameUserlogs = (payload) => {
  return axiosInstance.post(`${API_ADMIN_GETMEMORYGAMEUSERLOGS}`, payload)
}
export const deleteMemoryGameUserLogs = (id) => {
  return axiosInstance.delete(`${API_ADMIN_DELETEMEMORYGAMEUSERLOGS}/${id}`)
}
export const adminDeleteAllMemoryGameUserLogs = (params) => {
  return axiosInstance.post(`${API_ADMIN_DELETEALLMEMORYGAMEUSERLOGGS}`, params)
}
export const adminExportMemoryGameUserlogs = (params) => {
  return axiosInstance.post(`${API_ADMIN_EXPORTMEMORYGAMEUSERLOGS}`, params)
}
// Spin Game
export const getTemplateData = (storeId) => {
  return axiosInstance.get(`${API_SPIN_TEMPLATEDATA}/template`)
}

export const getConfig = (storeId, templateId) => {
  return axiosInstance.get(`${API_SPIN_CONFIG}/template/${templateId}`)
}
export const customerLogs = (params) => {
  return axiosInstance.post(`${API_CUSTOMER_LIST}`, params)
}

export const deleteCustomer = (id) => {
  return axiosInstance.delete(`${API_CUSTOMER_DELETE}${id}`)
}

export const deleteAllCustomer = (params) => {
  return axiosInstance.post(`${API_ALL_CUSTOMER_DELETE}`, params)
}

export const exportCustomerLogs = (params) => {
  return axiosInstance.post(`${API_CUSTOMER_LOGS}`, params)
}

export const updateTemplateConfig = (storeId, templateId, data) => {
  return axiosInstance.put(`${API_SPIN_UPDATE}/template/${templateId}`, data)
}

/*PLinko Game api*/

export const plinkodeleteGameUserLog = (id) => {
  return axiosInstance.delete(`${API_ADMIN_DELETEPLINKOGAMEUSERLOGS}/${id}`)
}

export const plinkogetuserlogs = (data) => {
  return axiosInstance.post(`${API_ADMIN_GETPLINKOGAMEUSERLOGS}`, data)
}

export const plinkosetgameconfig = (formData) => {
  return axiosInstance.post(`${API_ADMIN_SETPLINKOGAMECONFIG}`, formData)
}

export const plinkogetgameconfig = () => {
  return axiosInstance.get(`${API_ADMIN_GETPLINKOGAMECONFIG}`)
}

export const plinkodeleteAllGameUserLogs = (params) => {
  return axiosInstance.post(`${API_ADMIN_DELETEALLPLINKOGAMEUSERLOGS}`, params)
}

export const plinkoexportUserLogs = (params) => {
  return axiosInstance.post(`${API_ADMIN_EXPORTPLINKOGAMEUSERLOGS}`, params)
}

/*coinFLip Game api*/

export const coinflipsetgameconfig = (payload) => {
  return axiosInstance.post(`${API_ADMIN_SETCOINFLIPGAMECONFIG}`, payload)
}

export const coinflipgetgameconfig = () => {
  return axiosInstance.get(`${API_ADMIN_GETCOINFLIPGAMECONFIG}`)
}

export const coinflipgetuserlogs = (payload) => {
  return axiosInstance.post(`${API_ADMIN_GETCOINFLIPGAMEUSERLOGS}`, payload)
}

export const coinflipdeleteGameUserLog = (id) => {
  return axiosInstance.delete(`${API_ADMIN_DELETECOINFLIPGAMEUSERLOGS}/${id}`)
}

export const coinflipdeleteAllGameUserLogs = (params) => {
  return axiosInstance.post(`${API_ADMIN_DELETEALLCOINFLIPGAMEUSERLOGS}`, params)
}

export const coinflipexportUserLogs = (params) => {
  return axiosInstance.post(`${API_ADMIN_EXPORTCOINFLIPGAMEUSERLOGS}`, params)
}
export const apiRequest = {
  loginUser,
  verifyLoginOtp,
  resendLoginOtp,
  resetPassword,
  adminGroupList,
  deleteAdminGroup,
  AdminForgotPassword,
  changeAdminGroupStatus,
  createNewAdmin,
  getAdminData,
  updateAdminData,
  getSystemModulesList,
  getMedia,
  deleteMedia,
  admincreateNewCMSPages,
  createAdminGroup,
  getAdminGroupDetails,
  updateAdminGroup,
  getAdminGroupData,
  deleteAdminData,
  changeAdminStatus,
  getAdminDataList,
  admingetcmspages,
  admincmsstatuschange,
  admindeletecmspage,
  admingetcmsPagecontentbyid,
  admineditcmspagecontent,
  updateUserProfileData,
  adminsetSlotMachineconfig,
  admingetSlotMachineconfigcontent,
  admindeleteSlotMachineuserloggs,
  admingetSlotMachineuserloggs,
  adminSetMemoryGameConfig,
  adminGetMemoryGameConfig,
  adminGetMemoryGameUserlogs,
  deleteMemoryGameUserLogs,
  coinflipsetgameconfig,
  coinflipgetgameconfig,
  coinflipgetuserlogs,
  coinflipdeleteGameUserLog,
  adminExportMemoryGameUserlogs,
}
