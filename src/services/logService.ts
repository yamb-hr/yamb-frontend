import axios, { AxiosResponse } from 'axios';
import { Log } from '../types/Log';
import { AuthService } from './authService';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/games`;

export class LogService {

    static async getById(id: string): Promise<Log> {
        const { data }: AxiosResponse<Log> = await axios.get(`${API_BASE_URL}/${id}`, {
            headers: AuthService.getAuthHeaders()
        });
        console.log(data);
        return data;
    }

    static async getAll(
        page: number = 0,
        size: number = 10,
        sort: string = 'createdAt',
        direction: string = 'desc'
    ): Promise<Log[]> {
        const { data }: AxiosResponse<Log[]> = await axios.get(API_BASE_URL, {
            params: { page, size, sort, direction },
            headers: AuthService.getAuthHeaders()
        });
        console.log(data);
        return data;
    }

    static async deleteById(id: string): Promise<void> {
        await axios.delete(`${API_BASE_URL}/${id}`, {
            headers: AuthService.getAuthHeaders()
        });
    }

    static async deleteAll(): Promise<void> {
        await axios.delete(API_BASE_URL, {
            headers: AuthService.getAuthHeaders()
        });
    }
}
