import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Game } from '../types/Game';
import authService from './authService';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/games`;

class GameService {
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

    async getById(gameId: string): Promise<Game> {
        const { data }: AxiosResponse<Game> = await this.axiosInstance.get(`/${gameId}`);
        console.log(data);
        return data;
    }

    async getAll(): Promise<Game[]> {
        const { data }: AxiosResponse<Game[]> = await this.axiosInstance.get('/');
        console.log(data);
        return data;
    }

    async getOrCreate(): Promise<Game> {
        const currentPlayer = authService.getCurrentPlayer();
        if (currentPlayer) {
            const { data }: AxiosResponse<Game> = await this.axiosInstance.put('/', { playerId: currentPlayer.id });
            console.log(data);
            return data;
        } else {
            throw new Error('Player not logged in');
        }
    }

    async rollById(gameId: string, diceToRoll: number[]): Promise<Game> {
        const { data }: AxiosResponse<Game> = await this.axiosInstance.put(`/${gameId}/roll`, { diceToRoll });
        console.log(data);
        return data;
    }

    async fillById(gameId: string, columnType: string, boxType: string): Promise<Game> {
        const { data }: AxiosResponse<Game> = await this.axiosInstance.put(`/${gameId}/fill`, { columnType, boxType });
        console.log(data);
        return data;
    }

    async announceById(gameId: string, boxType: string): Promise<Game> {
        const { data }: AxiosResponse<Game> = await this.axiosInstance.put(`/${gameId}/announce`, { boxType });
        console.log(data);
        return data;
    }

    async restartById(gameId: string): Promise<Game> {
        const { data }: AxiosResponse<Game> = await this.axiosInstance.put(`/${gameId}/restart`);
        console.log(data);
        return data;
    }

    async finishById(gameId: string): Promise<Game> {
        const { data }: AxiosResponse<Game> = await this.axiosInstance.put(`/${gameId}/finish`);
        console.log(data);
        return data;
    }
}

const gameService = new GameService();
export default gameService;