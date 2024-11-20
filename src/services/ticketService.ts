import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Ticket, TicketCollection, TicketRequest } from '../types/Ticket';
import authService from './authService';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/tickets`;

class TicketService {

    private axiosInstance: AxiosInstance;
    public name: String;

    constructor() {
        this.name = 'TicketService';
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

    async getById(ticketId: string): Promise<Ticket> {
        const { data }: AxiosResponse<Ticket> = await this.axiosInstance.get(`/${ticketId}`);
        console.log("TicketService.getById", data);
        return data;
    }

    async getAll(page = 0, size = 10, sort = 'updatedAt', order: 'ASC' | 'DESC' = 'DESC'): Promise<TicketCollection> {
        const { data }: AxiosResponse<TicketCollection> = await this.axiosInstance.get('/', {
            params: {
                page,
                size,
                sort,
                order
            }
        });

        console.log("TicketService.getAll", data);
        return data;
    }

    async deleteById(ticket: Ticket): Promise<void> {
        const deleteLink = ticket._links?.self?.href;
        if (!deleteLink) {
            throw new Error('Delete link not available for this ticket');
        }

        const { data }: AxiosResponse<void> = await this.axiosInstance.delete(deleteLink);
        console.log("TicketService.deleteById", data);
        return data;
    }

    async deleteAll(): Promise<void> {
        const { data }: AxiosResponse<void> = await this.axiosInstance.delete('/');
        console.log("TicketService.deleteAll", data);
        return data;
    }

    async create(ticket: TicketRequest): Promise<Ticket> {
        const { data }: AxiosResponse<Ticket> = await this.axiosInstance.post(`/`, ticket);
        console.log("TicketService.create", data);
        return data;
    }

    async patchById(ticketId: string, ticket: TicketRequest): Promise<Ticket> {
        const { data }: AxiosResponse<Ticket> = await this.axiosInstance.patch(`/${ticketId}`, ticket);
        console.log("TicketService.patchById", data);
        return data;
    }

}

const ticketService = new TicketService();
export default ticketService;
