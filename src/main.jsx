import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import './index.css';
import TimerPage from './TimerPage.jsx';
import DashboardPage from './DashboardPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TimerPage />
    <DashboardPage />
  </StrictMode>
);
