import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Score } from '../types/Score';
import { GlobalScoreStats } from '../types/GlobalScoreStats';
import authService from './authService';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/scores`;

class ScoreService {
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

    async getById(scoreId: string): Promise<Score> {
        const { data }: AxiosResponse<Score> = await this.axiosInstance.get(`/${scoreId}`);
        console.log(data);
        return data;
    }

    async getAll(): Promise<Score[]> {
        const { data }: AxiosResponse<Score[]> = await this.axiosInstance.get('/');
        console.log(data);
        return data;
    }

    async getStats(): Promise<GlobalScoreStats> {
        const { data }: AxiosResponse<GlobalScoreStats> = await this.axiosInstance.get('/stats');
        console.log(data);
        return data;
    }
}

const scoreService = new ScoreService();
export default scoreService;