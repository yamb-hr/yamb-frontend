import axios, { AxiosResponse } from 'axios';
import { Game } from '../types/Game';
import { AuthService } from './authService';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/games`;

export class GameService {

    static async getById(gameId: string): Promise<Game> {
        const { data }: AxiosResponse<Game> = await axios.get(`${API_BASE_URL}/${gameId}`, {
            headers: AuthService.getAuthHeaders()
        });
        console.log(data);
        return data;
    }

    static async getAll(
        size: number = 10, 
        page: number = 0, 
        order: string = 'createdAt', 
        direction: string = 'asc'
    ): Promise<Game[]> {
        const { data }: AxiosResponse<Game[]> = await axios.get(API_BASE_URL, {
            params: { size, page, sort: order, direction },
            headers: AuthService.getAuthHeaders()
        });
        console.log(data);
        return data;
    }

    static async create(): Promise<Game> {
        const currentPlayer = AuthService.getCurrentPlayer();
        if (currentPlayer) {
            const { data }: AxiosResponse<Game> = await axios.post(API_BASE_URL, { playerId: currentPlayer.id }, {
                headers: AuthService.getAuthHeaders()
            });
            console.log(data);
            return data;
        } else {
            throw new Error('Player not logged in');
        }
    }

    static async rollById(gameId: string, diceToRoll: number[]): Promise<Game> {
        const { data }: AxiosResponse<Game> = await axios.put(`${API_BASE_URL}/${gameId}/roll`, { diceToRoll }, {
            headers: AuthService.getAuthHeaders()
        });
        console.log(data);
        return data;
    }

    static async fillById(gameId: string, columnType: string, boxType: string): Promise<Game> {
        const { data }: AxiosResponse<Game> = await axios.put(`${API_BASE_URL}/${gameId}/fill`, { columnType, boxType }, {
            headers: AuthService.getAuthHeaders()
        });
        console.log(data);
        return data;
    }

    static async announceById(gameId: string, boxType: string): Promise<Game> {
            const { data }: AxiosResponse<Game> = await axios.put(`${API_BASE_URL}/${gameId}/announce`, { boxType }, {
                headers: AuthService.getAuthHeaders()
            });
			console.log(data);
            return data;
    }

    static async restartById(gameId: string): Promise<Game> {
        const { data }: AxiosResponse<Game> = await axios.put(`${API_BASE_URL}/${gameId}/restart`, null, {
            headers: AuthService.getAuthHeaders()
        });
        console.log(data);
        return data;
    }
}

export default GameService;
