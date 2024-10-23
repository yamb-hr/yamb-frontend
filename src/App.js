import { ToastProvider } from './providers/toastProvider';
import { ErrorProvider } from './providers/errorProvider';
import { PreferencesProvider } from './providers/preferencesProvider';
import { DeviceProvider } from './providers/deviceProvider';
import { MenuProvider } from './providers/menuProvider';
import { CurrentUserProvider } from './providers/currentUserProvider';
import { StompClientProvider } from './providers/stompClientProvider';
import { QueryClient, QueryClientProvider } from 'react-query';
import Yamb from './components/yamb/yamb';
import './App.css';

export const queryClient = new QueryClient();

function App() {
	
	return (
		<div className="App">
			<header className="App-header">
				<QueryClientProvider client={queryClient}>
					<ToastProvider>
						<ErrorProvider>
							<PreferencesProvider>
								<DeviceProvider>
									<MenuProvider>
										<CurrentUserProvider>
											<StompClientProvider>
												<Yamb></Yamb>
											</StompClientProvider>
										</CurrentUserProvider>
									</MenuProvider>
								</DeviceProvider>
							</PreferencesProvider>
						</ErrorProvider>
					</ToastProvider>
				</QueryClientProvider>
			</header>
		</div>
	);
}

export default App;
