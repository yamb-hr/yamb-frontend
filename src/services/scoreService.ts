import axios, { AxiosResponse } from 'axios';
import { Score } from '../types/Score';
import { AuthService } from './authService';
import { GlobalScoreStats } from '../types/GlobalScoreStats';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/scores`;

export class ScoreService {

    static async getById(scoreId: string): Promise<Score> {
        const { data }: AxiosResponse<Score> = await axios.get(`${API_BASE_URL}/${scoreId}`, {
            headers: AuthService.getAuthHeaders()
        });
        console.log(data);
        return data;
    }

    static async getAll(): Promise<Score[]> {
        const { data }: AxiosResponse<Score[]> = await axios.get(API_BASE_URL, {
            headers: AuthService.getAuthHeaders()
        });
        console.log(data);
        return data;
    }

    static async getStats(): Promise<GlobalScoreStats> {
        const { data }: AxiosResponse<GlobalScoreStats> = await axios.get(`${API_BASE_URL}/stats`, {
            headers: AuthService.getAuthHeaders()
        });
        console.log(data);
        return data;
    }

}

export default ScoreService;