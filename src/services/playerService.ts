import axios, { AxiosResponse } from 'axios';
import { Player } from '../types/Player';
import { AuthService } from './authService';
import { Score } from '../types/Score';
import { PlayerStats } from '../types/PlayerStats';
import { GlobalPlayerStats } from '../types/GlobalPlayerStats';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/players`;

export class PlayerService {

    static async getById(playerId: string): Promise<Player> {
        const { data }: AxiosResponse<Player> = await axios.get(`${API_BASE_URL}/${playerId}`, {
            headers: AuthService.getAuthHeaders()
        });
        console.log(data);
        return data;
    }

    static async getStatsById(playerId: string): Promise<PlayerStats> {
        const { data }: AxiosResponse<PlayerStats> = await axios.get(`${API_BASE_URL}/${playerId}/stats`, {
            headers: AuthService.getAuthHeaders()
        });
        console.log(data);
        return data;
    }

    static async getAll(): Promise<Player[]> {
        const { data }: AxiosResponse<Player[]> = await axios.get(API_BASE_URL, {
            headers: AuthService.getAuthHeaders()
        });
        console.log(data);
        return data;
    }

    static async getStats(): Promise<GlobalPlayerStats> {
        const { data }: AxiosResponse<GlobalPlayerStats> = await axios.get(`${API_BASE_URL}/stats`, {
            headers: AuthService.getAuthHeaders()
        });
        console.log(data);
        return data;
    }

    static async getPrincipalById(playerId: string): Promise<string> {
        const { data }: AxiosResponse<string> = await axios.get(`${API_BASE_URL}/${playerId}/principal`, {
            headers: AuthService.getAuthHeaders()
        });
        console.log(data);
        return data;
    }

    static async getScoresByPlayerId(playerId: string): Promise<Score[]> {
        const { data }: AxiosResponse<Score[]> = await axios.get(`${API_BASE_URL}/${playerId}/scores`, {
            headers: AuthService.getAuthHeaders()
        });
        console.log(data);
        return data;
    }

}

export default PlayerService;