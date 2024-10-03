import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Game, GameCollection } from '../types/Game';
import authService from './authService';
import playerService from './playerService';
import { Player, PlayerCollection } from '../types/Player';

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
        console.log("GameService.getById", data);
        return data;
    }

    async getAll(page = 0, size = 10, sort = 'updatedAt', order: 'ASC' | 'DESC' = 'DESC'): Promise<GameCollection> {
        const { data }: AxiosResponse<GameCollection> = await this.axiosInstance.get('/', {
            params: {
                page,
                size,
                sort,
                order
            }
        });
    
        console.log("GameService.getAll", data);
        return data;
    }
    
    async getOrCreate(playerId: String): Promise<Game> {
        
        if (authService.getAccessToken()) {
            const { data }: AxiosResponse<Game> = await this.axiosInstance.put('/', { playerId: playerId });
            console.log("GameService.getOrCreate", data);
            return data;
        } else {
            throw new Error('Player not logged in');
        }
    }

    async rollById(game: Game, diceToRoll: number[]): Promise<Game> {
        const rollLink = game._links.roll?.href;
        if (!rollLink) {
            throw new Error('No roll link found for this game');
        }

        const { data }: AxiosResponse<Game> = await this.axiosInstance.put(rollLink, { diceToRoll });
        console.log("rollById", data);
        return data;
    }

    async fillById(game: Game, columnType: string, boxType: string): Promise<Game> {
        const fillLink = game._links.fill?.href;
        if (!fillLink) {
            throw new Error('No fill link found for this game');
        }

        const { data }: AxiosResponse<Game> = await this.axiosInstance.put(fillLink, { columnType, boxType });
        console.log("fillById", data);
        return data;
    }

    async announceById(game: Game, boxType: string): Promise<Game> {
        const announceLink = game._links.announce?.href;
        if (!announceLink) {
            throw new Error('No announce link found for this game');
        }

        const { data }: AxiosResponse<Game> = await this.axiosInstance.put(announceLink, { boxType });
        console.log("announceById", data);
        return data;
    }

    async restartById(game: Game): Promise<Game> {
        const restartLink = game._links.restart?.href;
        if (!restartLink) {
            throw new Error('No restart link found for this game');
        }

        const { data }: AxiosResponse<Game> = await this.axiosInstance.put(restartLink);
        console.log("restartById", data);
        return data;
    }

    async archiveById(game: Game): Promise<Game> {
        const archiveLink = game._links.archive?.href;
        if (!archiveLink) {
            throw new Error('No archive link found for this game');
        }

        const { data }: AxiosResponse<Game> = await this.axiosInstance.put(archiveLink);
        console.log("archiveById", data);
        return data;
    }

}

const gameService = new GameService();
export default gameService;
