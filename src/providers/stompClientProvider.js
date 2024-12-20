import { createContext, useState, useEffect, useContext } from 'react';
import { Client } from '@stomp/stompjs';
import { ErrorHandlerContext } from './errorHandlerProvider';
import { CurrentUserContext } from './currentUserProvider';
import authService from '../services/authService';
import SockJS from 'sockjs-client';

export const StompClientContext = createContext(null);

const API_URL = process.env.REACT_APP_API_URL + '/ws';

export const StompClientProvider = ({ children }) => {

    const { currentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorHandlerContext);

    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setConnected] = useState(false);

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
				setConnected(true);
			};

            client.onStompError = (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
                handleError(frame);
            };

            client.activate();
            setStompClient(client);

            return () => {
                if (client) {
                    client.deactivate();
                    setStompClient(null);
                    setConnected(false);
                }
            };
        }
    }, [currentUser]);

    return (
        <StompClientContext.Provider value={{ stompClient, setStompClient, isConnected }}>
            {children}
        </StompClientContext.Provider>
    );
};
