import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'baseURL', // Replace this with your API base URL
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { status }: any = error?.response || { status: '' };
    if (status === 401 && error?.response?.data?.detail?.code == 1) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
