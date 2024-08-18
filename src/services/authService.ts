import axios, { AxiosResponse } from 'axios';
import { Player } from '../types/Player';
import { PlayerCredentials } from '../types/PlayerCredentials';
import { AuthData } from '../types/AuthData';

const API_URL = process.env.REACT_APP_API_URL + "/auth";

export class AuthService {
	
	static getCurrentPlayer(): Player | null {
		try {
			return JSON.parse(localStorage.getItem("player") || 'null');
		} catch (error) {
			console.error(error);
			this.logout();
			return null;
		}
	}

	static getAccessToken(): string | null {
		try {
			return localStorage.getItem("token") || 'null';
		} catch (error) {
			console.error(error);
			this.logout();
			return null;
		}
	}

	static getAuthHeaders(): object {
		return {
			'Authorization': 'Bearer ' + AuthService.getAccessToken()
		}
	}

	static async createTempPlayer(tempPlayerRequest: PlayerCredentials): Promise<AuthData> {
		try {
			const { data }: AxiosResponse<AuthData> = await axios.post(API_URL + '/temp-player', tempPlayerRequest, {
				headers: { 'Content-Type': 'application/json' },
			});
			console.log(data);
			return data;
		} catch (error: any) {
			console.error(error);
			throw new Error(error.response?.data?.message || 'Creation of temporary player failed');
		}
	}
	
	static async register(authRequest: PlayerCredentials): Promise<Player> {
		try {
			const { data }: AxiosResponse<Player>= await axios.post(API_URL + '/register', authRequest, {
				headers: AuthService.getAuthHeaders(),
			});
			console.log(data);
			return data;
		} catch (error: any) {
			console.error(error);
			throw new Error(error.response?.data?.message || 'Registration failed');
		}
	}

	static async login(authRequest: PlayerCredentials): Promise<AuthData> {
		try {
			const { data }: AxiosResponse<AuthData> = await axios.post(API_URL + '/login', authRequest);
			console.log(data);
			return data;
		} catch (error: any) {
			console.error(error);
			throw new Error(error.response?.data?.message || 'Login failed');
		}
	}
	
	static logout(): void {
		localStorage.clear();
	}

}
