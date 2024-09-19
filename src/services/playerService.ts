import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Player, PlayerCollection, PlayerPreferences, GlobalPlayerStats, PlayerStats } from '../types/Player';
import { ScoreCollection, Score } from '../types/Score';
import authService from './authService';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/players`;

class PlayerService {
    private axiosInstance: AxiosInstance;
    private currentPlayer: Player | null = null;

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

    async getAll(page = 0, size = 10, sort = 'createdAt', order: 'ASC' | 'DESC' = 'DESC'): Promise<PlayerCollection> {
        const { data }: AxiosResponse<PlayerCollection> = await this.axiosInstance.get('/', {
            params: {
                page,
                size,
                sort,
                order
            }
        });
    
        console.log(data);
        return data;
    }

    async getStatsById(player: Player): Promise<PlayerStats> {
        const statsLink = player._links?.stats?.href;
        if (!statsLink) {
            throw new Error("Stats link not available for this player");
        }

        const { data }: AxiosResponse<PlayerStats> = await this.axiosInstance.get(statsLink);
        console.log(data);
        return data;
    }

    async getStats(): Promise<GlobalPlayerStats> {
        const { data }: AxiosResponse<GlobalPlayerStats> = await this.axiosInstance.get('/stats');
        console.log(data);
        return data;
    }

    async getScoresByPlayerId(player: Player): Promise<Score[]> {
        const scoresLink = player._links?.scores?.href;
        if (!scoresLink) {
            throw new Error("Scores link not available for this player");
        }

        const { data }: AxiosResponse<ScoreCollection> = await this.axiosInstance.get(scoresLink);
        console.log(data);
        return data._embedded.scores;
    }

    async getPreferencesByPlayerId(player: Player): Promise<PlayerPreferences> {
        const preferencesLink = player._links?.preferences?.href;
        if (!preferencesLink) {
            throw new Error("Preferences link not available for this player");
        }

        const { data }: AxiosResponse<PlayerPreferences> = await this.axiosInstance.get(preferencesLink);
        console.log(data);
        return data;
    }

    async setPreferencesByPlayerId(player: Player, preferences: PlayerPreferences): Promise<PlayerPreferences> {
        const preferencesLink = player._links?.preferences?.href;
        if (!preferencesLink) {
            throw new Error("Preferences link not available for this player");
        }

        const { data }: AxiosResponse<PlayerPreferences> = await this.axiosInstance.put(preferencesLink, preferences);
        console.log(data);
        return data;
    }

    async getCurrentPlayer(): Promise<Player | null> { 
        if (!this.currentPlayer && authService.getAccessToken()) {
            const { data }: AxiosResponse<Player> = await this.axiosInstance.get('/me');
            console.log(data);
            this.currentPlayer = data;  
        }
        return this.currentPlayer;
    }
}

const playerService = new PlayerService();
export default playerService;
