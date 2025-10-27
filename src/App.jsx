import { AppProvider } from './AppContext';
import TimerPage from './TimerPage';

function App() {
  return (
    <AppProvider>
      <TimerPage />
    </AppProvider>
  );
}

export default App;
