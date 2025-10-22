import { useState } from 'react';
import Projects from './Projects.jsx';

function TimerPage() {
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('user');
    if (saved != null) {
      return JSON.parse(saved);
    }
    return {
      id: 0,
      projCount: 0,
      projects: [],
    };
  });
  return (
    <div>
      <Projects userData={userData} setUserData={setUserData} />
    </div>
  );
}

export default TimerPage;
