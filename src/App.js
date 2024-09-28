import { ToastProvider } from './providers/toastProvider';
import { ErrorProvider } from './providers/errorProvider';
import { CurrentUserProvider } from './providers/currentUserProvider';
import { DeviceProvider } from './providers/deviceProvider';
import { MenuProvider } from './providers/menuProvider';
import { ThemeProvider } from './providers/themeProvider';
import { LanguageProvider } from './providers/languageProvider';
import { StompClientProvider } from './providers/stompClientProvider';
import Yamb from './components/yamb/yamb';
import './App.css';

function App() {
	
	return (
		<div className="App">
			<header className="App-header">
				<ToastProvider>
					<ErrorProvider>
						<ThemeProvider>
							<LanguageProvider>
								<DeviceProvider>
									<MenuProvider>
										<CurrentUserProvider>
											<StompClientProvider>
												<Yamb></Yamb>
											</StompClientProvider>
										</CurrentUserProvider>
									</MenuProvider>
								</DeviceProvider>
							</LanguageProvider>
						</ThemeProvider>
					</ErrorProvider>
				</ToastProvider>
			</header>
		</div>
	);
}

export default App;
