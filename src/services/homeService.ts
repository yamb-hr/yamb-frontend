import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.REACT_APP_API_URL + "/";

class HomeService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.axiosInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                if (config.headers) {
                    const language = localStorage.getItem('language');
                    if (language) {
                        config.headers['Accept-Language'] = language;
                    }
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    getVersionInfo(): Promise<AxiosResponse> {
        return this.axiosInstance.get('/version');
    }

    getHealthCheck(): Promise<AxiosResponse> {
        return this.axiosInstance.get('/health');
    }

    getStatus(): Promise<AxiosResponse> {
        return this.axiosInstance.get('/status');
    }

    getSystemInfo(): Promise<AxiosResponse> {
        return this.axiosInstance.get('/system-info');
    }

    getMetrics(): Promise<AxiosResponse> {
        return this.axiosInstance.get('/metrics');
    }

}

const homeService = new HomeService();
export default homeService;