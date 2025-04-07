import { axiosInstance } from '../plugin/axios'
import * as apiUrl from '../constant/urls'
export const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

//-------------------------API_GAME_CREATE API SERVICE-------------------------------------//
const API_GAMEDATA_SET = `${API_ENDPOINT}/${apiUrl.gameapidata}`
const API_GAME_CREATE = `${API_ENDPOINT}/${apiUrl.createAdmin}`
const API_GAME_OTP_VERIFY=`${API_ENDPOINT}/${apiUrl.verifyOtp}`
//@Post coin-Flip game-page 
export const coinfilpgamepage = (payload) => {
  return axiosInstance.post(`${API_GAME_CREATE}`, payload)
}

//@GET  coin-Flip game-page
export const gameapidata = () => {
  return axiosInstance.get(API_GAMEDATA_SET)
}


export const verifyOtpAPI =(payload)=>{
  return axiosInstance.post(`${API_GAME_OTP_VERIFY}`, payload)
}

export  const apiRequest={
    coinfilpgamepage,
    gameapidata,
    verifyOtpAPI
}