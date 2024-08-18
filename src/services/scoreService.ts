import axios, { AxiosResponse } from 'axios';
import { Score } from '../types/Score';
import { AuthService } from './authService';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/scores`;

export class ScoreService {

    static async getById(scoreId: string): Promise<Score> {
        try {
            const { data }: AxiosResponse<Score> = await axios.get(`${API_BASE_URL}/${scoreId}`, {
                headers: AuthService.getAuthHeaders()
            });
            return data;
        } catch (error: any) {
            console.error(error);
            throw new Error(error.response?.data?.message);
        }
    }

    static async getAll(
        size: number = 10, 
        page: number = 0, 
        order: string = 'createdAt', 
        direction: string = 'asc'
    ): Promise<Score[]> {
        try {
            const { data }: AxiosResponse<Score[]> = await axios.get(API_BASE_URL, {
                params: { size, page, sort: order, direction },
                headers: AuthService.getAuthHeaders()
            });
            return data;
        } catch (error: any) {
            console.error(error);
            throw new Error(error.response?.data?.message);
        }
    }

}

export default ScoreService;