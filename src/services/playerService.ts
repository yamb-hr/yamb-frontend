import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Player } from '../types/Player';
import { Score } from '../types/Score';
import { PlayerStats } from '../types/PlayerStats';
import { GlobalPlayerStats } from '../types/GlobalPlayerStats';
import authService from './authService';
import { PlayerPreferences } from '../types/PlayerPreferences';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/players`;

class PlayerService {
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

    async getById(playerId: string): Promise<Player> {
        const { data }: AxiosResponse<Player> = await this.axiosInstance.get(`/${playerId}`);
        console.log(data);
        return data;
    }

    async getStatsById(playerId: string): Promise<PlayerStats> {
        const { data }: AxiosResponse<PlayerStats> = await this.axiosInstance.get(`/${playerId}/stats`);
        console.log(data);
        return data;
    }

    async getAll(): Promise<Player[]> {
        const { data }: AxiosResponse<Player[]> = await this.axiosInstance.get('/');
        console.log(data);
        return data;
    }

    async getStats(): Promise<GlobalPlayerStats> {
        const { data }: AxiosResponse<GlobalPlayerStats> = await this.axiosInstance.get('/stats');
        console.log(data);
        return data;
    }

    async getPrincipalById(playerId: string): Promise<string> {
        const { data }: AxiosResponse<string> = await this.axiosInstance.get(`/${playerId}/principal`);
        console.log(data);
        return data;
    }

    async getScoresByPlayerId(playerId: string): Promise<Score[]> {
        const { data }: AxiosResponse<Score[]> = await this.axiosInstance.get(`/${playerId}/scores`);
        console.log(data);
        return data;
    }

    async getPreferencesByPlayerId(playerId: string): Promise<PlayerPreferences> {
        const { data }: AxiosResponse<PlayerPreferences> = await this.axiosInstance.get(`/${playerId}/preferences`);
        console.log(data);
        return data;
    }

    async setPreferencesByPlayerId(playerId: string, preferences: PlayerPreferences): Promise<PlayerPreferences> {
        const { data }: AxiosResponse<PlayerPreferences> = await this.axiosInstance.put(`/${playerId}/preferences`, preferences);
        console.log(data);
        return data;
    }
}

const playerService = new PlayerService();
export default playerService;