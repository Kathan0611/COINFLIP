import axios from 'axios';

// define API_URL and APP ID in env file
export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});
