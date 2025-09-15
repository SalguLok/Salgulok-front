import axios from "axios";
import { reissue } from "./auth/reissue";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 동시 요청 처리 관련 변수
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

// 응답 인터셉터
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;

    if (response?.status === 401 && !config._retry) {
      config._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newAccessToken = await reissue();
          onTokenRefreshed(newAccessToken);
          isRefreshing = false;

          config.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(config);
        } catch (err) {
          isRefreshing = false;
          throw err;
        }
      }

      // 다른 요청은 토큰 갱신 기다림
      return new Promise((resolve) => {
        addRefreshSubscriber((token) => {
          config.headers.Authorization = `Bearer ${token}`;
          resolve(api(config));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;