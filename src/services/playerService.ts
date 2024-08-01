import axios, { AxiosResponse } from 'axios';
import { Player } from '../types/Player';
import { AuthService } from './authService';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/players`;

export class PlayerService {

    static async getById(playerId: string): Promise<Player> {
        const { data }: AxiosResponse<Player> = await axios.get(`${API_BASE_URL}/${playerId}`, {
            headers: AuthService.getAuthHeaders()
        });
        return data;
    }

    static async getAll(
        size: number = 10, 
        page: number = 0, 
        order: string = 'createdAt', 
        direction: string = 'asc'
    ): Promise<Player[]> {
        const { data }: AxiosResponse<Player[]> = await axios.get(API_BASE_URL, {
            params: { size, page, sort: order, direction },
            headers: AuthService.getAuthHeaders()
        });
        return data;
    }

    static async getPrincipalById(playerId: string): Promise<string> {
        const { data }: AxiosResponse<string> = await axios.get(`${API_BASE_URL}/${playerId}/principal`, {
            headers: AuthService.getAuthHeaders()
        });
        return data;
    }

}

export default PlayerService;