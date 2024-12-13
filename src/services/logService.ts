import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Log, LogCollection } from '../types/Log';
import authService from './authService';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/logs`;

class LogService {

    private axiosInstance: AxiosInstance;
    public name: String;

    constructor() {
        this.name = 'LogService';
        this.axiosInstance = axios.create({
            baseURL: API_BASE_URL,
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

    async getById(logId: string): Promise<Log> {
        const { data }: AxiosResponse<Log> = await this.axiosInstance.get(`/${logId}`);
        console.log("LogService.getById", data);
        return data;
    }

    async getAll(page = 0, size = 10, sort = 'updatedAt', order: 'ASC' | 'DESC' = 'DESC'): Promise<LogCollection> {
        const { data }: AxiosResponse<LogCollection> = await this.axiosInstance.get('/', {
            params: {
                page,
                size,
                sort,
                order
            }
        });

        console.log("LogService.getAll", data);
        return data;
    }

    async deleteById(log: Log): Promise<void> {
        const deleteLink = log._links?.self?.href;
        if (!deleteLink) {
            throw new Error('Delete link not available for this log');
        }

        const { data }: AxiosResponse<void> = await this.axiosInstance.delete(deleteLink);
        console.log("LogService.deleteById", data);
        return data;
    }

    async deleteAll(): Promise<void> {
        const { data }: AxiosResponse<void> = await this.axiosInstance.delete('/');
        console.log("LogService.deleteAll", data);
        return data;
    }
}

const logService = new LogService();
export default logService;
