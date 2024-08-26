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

	static async createTempPlayer(tempPlayerRequest: PlayerCredentials, recaptchaToken: string): Promise<AuthData> {
		const { data }: AxiosResponse<AuthData> = await axios.post(API_URL + '/anonymous', tempPlayerRequest, {
			headers: { "X-Recaptcha-Token": recaptchaToken },
		});
		console.log(data);
		return data;
	}
	
	// auth header is sent when registering a player in case the player is already logged in as a temp player
	// the user is instead converted to a full player
	static async register(authRequest: PlayerCredentials, recaptchaToken: string): Promise<Player> {
		const { data }: AxiosResponse<Player>= await axios.post(API_URL + '/register', authRequest, {
			headers: { ...AuthService.getAuthHeaders(), "X-Recaptcha-Token": recaptchaToken },
		});
		console.log(data);
		return data;
	}

	static async login(authRequest: PlayerCredentials): Promise<AuthData> {
		const { data }: AxiosResponse<AuthData> = await axios.post(API_URL + '/login', authRequest);
		console.log(data);
		return data;
	}
	
	static logout(): void {
		localStorage.clear();
	}

}
