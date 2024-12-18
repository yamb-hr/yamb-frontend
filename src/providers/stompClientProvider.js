import { createContext, useState } from 'react';
import { useEffect, useContext } from 'react';
import { Client } from '@stomp/stompjs';
import { CurrentUserContext } from './currentUserProvider';
import { ErrorHandlerContext } from './errorHandlerProvider';
import SockJS from 'sockjs-client';
import authService from '../services/authService';
import playerService from '../services/playerService';

export const StompClientContext = createContext(null);

const API_URL = process.env.REACT_APP_API_URL + '/ws';

export const StompClientProvider = ({ children }) => {

	const { currentUser } = useContext(CurrentUserContext);
	const { handleError } = useContext(ErrorHandlerContext);

    const [ stompClient, setStompClient ] = useState(null);
    const [ isConnected, setConnected ] = useState(false);

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

    return (
        <StompClientContext.Provider value={{ stompClient, setStompClient, isConnected }}>
            {children}
        </StompClientContext.Provider>
    );
    
};
