import { AxiosResponse } from 'axios';
import { Ticket, TicketCollection, TicketRequest } from '../types/Ticket';
import axiosInstance from './httpClient';

class TicketService {

    public name: string;

    constructor() {
        this.name = 'TicketService';
    }

    async getById(ticketId: string): Promise<Ticket> {
        const { data }: AxiosResponse<Ticket> = await axiosInstance.get(`/${ticketId}`);
        console.log("TicketService.getById", data);
        return data;
    }

    async getAll(page = 0, size = 10, sort = 'updatedAt', order: 'ASC' | 'DESC' = 'DESC'): Promise<TicketCollection> {
        const { data }: AxiosResponse<TicketCollection> = await axiosInstance.get('/', {
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

        const { data }: AxiosResponse<void> = await axiosInstance.delete(deleteLink);
        console.log("TicketService.deleteById", data);
        return data;
    }

    async deleteAll(): Promise<void> {
        const { data }: AxiosResponse<void> = await axiosInstance.delete('/');
        console.log("TicketService.deleteAll", data);
        return data;
    }

    async create(ticket: TicketRequest): Promise<Ticket> {
        const { data }: AxiosResponse<Ticket> = await axiosInstance.post(`/`, ticket);
        console.log("TicketService.create", data);
        return data;
    }

    async patchById(ticketId: string, ticket: TicketRequest): Promise<Ticket> {
        const { data }: AxiosResponse<Ticket> = await axiosInstance.patch(`/${ticketId}`, ticket);
        console.log("TicketService.patchById", data);
        return data;
    }

}

const ticketService = new TicketService();
export default ticketService;
