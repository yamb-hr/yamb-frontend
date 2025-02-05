import { BrowserRouter as Router } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastProvider } from './providers/toastProvider';
import { ErrorHandlerProvider } from './providers/errorHandlerProvider';
import { PreferencesProvider } from './providers/preferencesProvider';
import { DeviceProvider } from './providers/deviceProvider';
import { MenuProvider } from './providers/menuProvider';
import { AuthenticationProvider } from './providers/authenticationProvider';
import { StompClientProvider } from './providers/stompClientProvider';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NotificationsProvider } from './providers/notificationsProvider';
import { InGameProvider } from './providers/inGameProvider';
import { ActivePlayersProvider } from './providers/activePlayersProvider';
import { LoadingProvider } from './providers/loadingProvider';
import ErrorBoundary from './components/errorBoundary';
import Yamb from './components/yamb/yamb';
import './App.css';

export const queryClient = new QueryClient();

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

function App() {
	
	useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
        script.async = true;

        script.onerror = () => {
            console.error('Failed to load reCAPTCHA script');
        }

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }

    }, []);
	
	return (
		<div className="App">
			<header className="App-header">
				<Router>
					<QueryClientProvider client={queryClient}>
						<ErrorBoundary>
							<ToastProvider>
								<ErrorHandlerProvider>
									<LoadingProvider>
										<AuthenticationProvider>
											<PreferencesProvider>
												<DeviceProvider>
													<MenuProvider>
														<StompClientProvider>
															<NotificationsProvider>
																<ActivePlayersProvider>
																	<InGameProvider>
																		<Yamb></Yamb>
																	</InGameProvider>
																</ActivePlayersProvider>
															</NotificationsProvider>
														</StompClientProvider>
													</MenuProvider>
												</DeviceProvider>
											</PreferencesProvider>
										</AuthenticationProvider>
									</LoadingProvider>
								</ErrorHandlerProvider>
							</ToastProvider>
						</ErrorBoundary>
					</QueryClientProvider>
				</Router>
			</header>
			<div id="recaptcha-container"></div>
		</div>
	);
	
}

export default App;
