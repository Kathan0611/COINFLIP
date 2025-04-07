import { toast } from 'react-toastify'
import 'react-toastify/ReactToastify.css'

export function showToastr(message, type, callBackFunction = () => {}) {
  const options = {
    autoClose: 2000,
    type: type,
    hideProgressBar: false,
    position: 'top-right',
    pauseOnHover: true,
    closeOnClick: true,
    onClose: callBackFunction,
  }
  return toast(message, options)
}
