import { ToastProvider } from './providers/toastProvider';
import { ErrorHandlerProvider } from './providers/errorHandlerProvider';
import { PreferencesProvider } from './providers/preferencesProvider';
import { DeviceProvider } from './providers/deviceProvider';
import { MenuProvider } from './providers/menuProvider';
import { CurrentUserProvider } from './providers/currentUserProvider';
import { StompClientProvider } from './providers/stompClientProvider';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NotificationsProvider } from './providers/notificationsProvider';
import ErrorBoundary from './components/errorBoundary';
import Yamb from './components/yamb/yamb';
import './App.css';

export const queryClient = new QueryClient();

function App() {
	
	return (
		<div className="App">
			<header className="App-header">
				<QueryClientProvider client={queryClient}>
					<ErrorBoundary>
						<ToastProvider>
							<ErrorHandlerProvider>
								<CurrentUserProvider>
									<PreferencesProvider>
										<DeviceProvider>
											<MenuProvider>
												<StompClientProvider>
													<NotificationsProvider>
														<Yamb></Yamb>
													</NotificationsProvider>
												</StompClientProvider>
											</MenuProvider>
										</DeviceProvider>
									</PreferencesProvider>
								</CurrentUserProvider>
							</ErrorHandlerProvider>
						</ToastProvider>
					</ErrorBoundary>
				</QueryClientProvider>
			</header>
		</div>
	);
}

export default App;
