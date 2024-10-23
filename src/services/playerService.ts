import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Player, PlayerCollection, PlayerPreferences, GlobalPlayerStats, PlayerStats } from '../types/Player';
import { ScoreCollection } from '../types/Score';
import authService from './authService';
import {  ClashCollection } from '../types/Clash';
import { LogCollection } from '../types/Log';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/players`;

class PlayerService {
    
    private axiosInstance: AxiosInstance;
    public name: String;

    constructor() {
        this.name = 'PlayerService';
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
        console.log("PlayerService.getById", data);
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
    
        console.log("PlayerService.getAll", data);
        return data;
    }

    async getStatsById(player: Player): Promise<PlayerStats> {
        const statsLink = player._links?.stats?.href;
        if (!statsLink) {
            throw new Error("Stats link not available for this player");
        }

        const { data }: AxiosResponse<PlayerStats> = await this.axiosInstance.get(statsLink);
        console.log("PlayerService.getStatsById", data);
        return data;
    }

    async getStats(): Promise<GlobalPlayerStats> {
        const { data }: AxiosResponse<GlobalPlayerStats> = await this.axiosInstance.get('/stats');
        console.log("PlayerService.getStats", data);
        return data;
    }

    async getScoresByPlayerId(player: Player): Promise<ScoreCollection> {
        const scoresLink = player._links?.scores?.href;
        if (!scoresLink) {
            throw new Error("Scores link not available for this player");
        }

        const { data }: AxiosResponse<ScoreCollection> = await this.axiosInstance.get(scoresLink);
        console.log("getScoresByPlayerId", data);
        return data;
    }

    async getClashesByPlayerId(player: Player): Promise<ClashCollection> {
        const clashesLink = player._links?.clashes?.href;
        if (!clashesLink) {
            throw new Error("Clashes link not available for this player");
        }

        const { data }: AxiosResponse<ClashCollection> = await this.axiosInstance.get(clashesLink);
        console.log("getClashesByPlayerId", data);
        return data;
    }

    async getPreferencesByPlayerId(player: Player): Promise<PlayerPreferences> {
        const preferencesLink = player._links?.preferences?.href;
        if (!preferencesLink) {
            throw new Error("Preferences link not available for this player");
        }

        const { data }: AxiosResponse<PlayerPreferences> = await this.axiosInstance.get(preferencesLink);
        console.log("getPreferencesByPlayerId", data);
        return data;
    }

    async setPreferencesByPlayerId(player: Player, preferences: PlayerPreferences): Promise<PlayerPreferences> {
        const preferencesLink = player._links?.preferences?.href;
        if (!preferencesLink) {
            throw new Error("Preferences link not available for this player");
        }

        const { data }: AxiosResponse<PlayerPreferences> = await this.axiosInstance.put(preferencesLink, preferences);
        console.log("setPreferencesByPlayerId", data);
        return data;
    }

    async getCurrentPlayer(): Promise<Player | null> { 
        const { data }: AxiosResponse<Player> = await this.axiosInstance.get('/me');
        console.log("getCurrentPlayer", data);
        return data;
    }

    async changeUsername(player: Player, username: String): Promise<Player> { 
        const usernameLink = player._links?.username?.href;
        if (!usernameLink) {
            throw new Error("Username link not available for this player");
        }
        const { data }: AxiosResponse<Player> = await this.axiosInstance.put(usernameLink, { username: username });
        console.log("changeUsername", data);
        return data;
    }

    async getLogsByPlayerId(player: Player): Promise<LogCollection> {
        const logsLink = player._links?.logs?.href;
        if (!logsLink) {
            throw new Error("Logs link not available for this player");
        }

        const { data }: AxiosResponse<LogCollection> = await this.axiosInstance.get(logsLink);
        console.log("getLogsByPlayerId", data);
        return data;
    }
}

const playerService = new PlayerService();
export default playerService;
