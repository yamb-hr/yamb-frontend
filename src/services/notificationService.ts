import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Notification } from '../types/Notification';
import authService from './authService';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/notifications`;

class NotificationService {

    private axiosInstance: AxiosInstance;
    public name: string;

    constructor() {
        this.name = 'NotificationService';
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

    async getById(notificationId: string): Promise<Notification> {
        const { data }: AxiosResponse<Notification> = await this.axiosInstance.get(`/${notificationId}`);
        console.log("NotificationService.getById", data);
        return data;
    }

    async deleteById(notification: Notification): Promise<void> {
        const deleteLink = notification._links?.self?.href || `/${notification.id}` // no hateoas links from ws
        if (!deleteLink) {
            throw new Error('Delete link not available for this notification');
        }

        const { data }: AxiosResponse<void> = await this.axiosInstance.delete(deleteLink);
        console.log("NotificationService.deleteById", data);
        return data;
    }

}

const notificationService = new NotificationService();
export default notificationService;
