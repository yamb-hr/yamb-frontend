import { AxiosResponse } from 'axios';
import { Notification } from '../types/Notification';
import axiosInstance from './httpClient';

const ENDPOINT_PREFIX = "/notifications";

class NotificationService {

    public name: string;

    constructor() {
        this.name = 'NotificationService';
    }

    async getById(notificationId: string): Promise<Notification> {
        const { data }: AxiosResponse<Notification> = await axiosInstance.get(`${ENDPOINT_PREFIX}/${notificationId}`);
        console.log("NotificationService.getById", data);
        return data;
    }

    async deleteById(notification: Notification): Promise<void> {
        const deleteLink = notification._links?.self?.href || `${ENDPOINT_PREFIX}/${notification.id}` // no hateoas links from ws
        if (!deleteLink) {
            throw new Error('Delete link not available for this notification');
        }

        const { data }: AxiosResponse<void> = await axiosInstance.delete(deleteLink);
        console.log("NotificationService.deleteById", data);
        return data;
    }

}

const notificationService = new NotificationService();
export default notificationService;
