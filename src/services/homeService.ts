import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL + "/";

class HomeService {
    
    private axiosInstance: AxiosInstance;
    public name: String;

    constructor() {
        this.name = 'HomeService';
        this.axiosInstance = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.axiosInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                if (config.headers) {
                    const language = localStorage.getItem('i18nextLng');
                    if (language) {
                        config.headers['Accept-Language'] = language;
                    }
                    const token = authService.getAccessToken();
                    if (token) {
                        config.headers['Authorization'] = `Bearer ${token}`;
                    }
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    async getHealthCheck(): Promise<AxiosResponse> {
        const { data }: AxiosResponse<any> = await this.axiosInstance.get("/health");
        console.log("getHealthCheck", data);
        return data;
    }

    async getMetrics(): Promise<AxiosResponse> {
        const { data }: AxiosResponse<any> = await this.axiosInstance.get("/metrics");
        console.log("getMetrics", data);
        return data;
    }

}

const homeService = new HomeService();
export default homeService;