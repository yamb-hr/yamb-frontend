import { AxiosResponse } from 'axios';
import axiosInstance from './httpClient';

class HomeService {
    
    public name: string;

    constructor() {
        this.name = 'HomeService';
    }

    async getHealthCheck(): Promise<AxiosResponse> {
        const { data }: AxiosResponse<any> = await axiosInstance.get("/health");
        console.log("getHealthCheck", data);
        return data;
    }

    async getMetrics(): Promise<AxiosResponse> {
        const { data }: AxiosResponse<any> = await axiosInstance.get("/metrics");
        console.log("getMetrics", data);
        return data;
    }

}

const homeService = new HomeService();
export default homeService;