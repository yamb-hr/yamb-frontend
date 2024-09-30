import { ToastProvider } from './providers/toastProvider';
import { ErrorProvider } from './providers/errorProvider';
import { PreferencesProvider } from './providers/preferencesProvider';
import { DeviceProvider } from './providers/deviceProvider';
import { MenuProvider } from './providers/menuProvider';
import { CurrentUserProvider } from './providers/currentUserProvider';
import { StompClientProvider } from './providers/stompClientProvider';
import Yamb from './components/yamb/yamb';
import './App.css';

function App() {
	
	return (
		<div className="App">
			<header className="App-header">
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
			</header>
		</div>
	);
}

export default App;
