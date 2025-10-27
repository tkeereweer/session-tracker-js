import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('user');
    if (saved != null) {
      return JSON.parse(saved);
    }
    return {
      id: uuid(),
      projects: [],
    };
  });
  const [currProj, setCurrProj] = useState(() => {
    return userData.projects[0]?.id || '';
  });
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(userData));
  }, [userData]);
  const value = {
    userData,
    setUserData,
    currProj,
    setCurrProj,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
