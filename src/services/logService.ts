import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Log } from '../types/Log';
import authService from './authService';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/logs`;

class LogService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: API_BASE_URL,
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

    async getById(logId: string): Promise<Log> {
        const { data }: AxiosResponse<Log> = await this.axiosInstance.get(`/${logId}`);
        console.log(data);
        return data;
    }

    async getAll(): Promise<Log[]> {
        const { data }: AxiosResponse<Log[]> = await this.axiosInstance.get('/');
        console.log(data);
        return data;
    }

    
    async deleteAll(): Promise<VoidFunction> {
        const { data }: AxiosResponse<VoidFunction> = await this.axiosInstance.delete('/');
        console.log(data);
        return data;
    }

}

const logService = new LogService();
export default logService;