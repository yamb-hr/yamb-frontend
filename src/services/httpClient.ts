import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: any = null) => {
	failedQueue.forEach(prom => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

const instance: AxiosInstance = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
});

instance.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const language = localStorage.getItem('i18nextLng');
		if (language) {
			config.headers['Accept-Language'] = language;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

instance.interceptors.response.use(
	(response: AxiosResponse) => response,
	(error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
		if (error.response && error.response.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				}).then(() => {
					instance(originalRequest);
				}).catch(err => Promise.reject(err));
			}
			originalRequest._retry = true;
			isRefreshing = true;
			return new Promise((resolve, reject) => {
				try {
					instance.post('/auth/refresh')
						.then(response => {
							console.log("refresh");
							processQueue(null, response.data);
							resolve(instance(originalRequest));
						}).catch(error => {
							console.error(error);
							processQueue(error, null);
							reject(error);
						}).finally(() => {
							isRefreshing = false;
						});
				} catch (error) {
					console.error(error);
				}
			});
		}
		return Promise.reject(error);
	}
);


export default instance;
