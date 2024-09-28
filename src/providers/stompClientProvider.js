import { createContext, useState } from 'react';
import { useEffect, useContext } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { CurrentUserContext } from './currentUserProvider';
import authService from '../services/authService';

export const StompClientContext = createContext(null);

const API_URL = process.env.REACT_APP_API_URL + '/ws';

export const StompClientProvider = ({ children }) => {

    const [ stompClient, setStompClient ] = useState(null);
    const [ isConnected, setConnected ] = useState(false);
	const { currentUser } = useContext(CurrentUserContext);

	useEffect(() => {
		if (currentUser) {
			const client = new Client({
				webSocketFactory: () =>
					new SockJS(API_URL + `?token=${encodeURIComponent(authService.getAccessToken())}`),
				reconnectDelay: 5000,
				debug: function (str) {
					// console.log(str);
				},
			});

			client.onConnect = () => {
				console.log('WebSocket connected');
				client.subscribe('/topic/players', onPlayerStatusChanged);
				setConnected(true);
			};

			client.onStompError = (frame) => {
				console.error('Broker reported error: ' + frame.headers['message']);
				console.error('Additional details: ' + frame.body);
			};

			client.activate();
			setStompClient(client);

			return () => {
				if (client) {
					client.deactivate();
					setStompClient(client);
					setConnected(false);
				}
			};
		}
	}, [ currentUser ]);

	const onPlayerStatusChanged = (message) => {
		console.log("Player Status", JSON.parse(message.body));
	}

    return (
        <StompClientContext.Provider value={{ stompClient, setStompClient, isConnected }}>
            {children}
        </StompClientContext.Provider>
    );
    
};
