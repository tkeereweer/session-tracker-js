import { useState } from 'react';
import './TimerPage.css';
import Projects from './Projects.jsx';
import Sessions from './Sessions.jsx';

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
  const [currProj, setCurrProj] = useState(() => {
    if (userData.projCount > 0) {
      return userData.projects[0].id;
    } else {
      return '';
    }
  });
  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">Timer</li>
            <li className="nav-item">Dashboard</li>
          </ul>
        </div>
      </nav>
      <div className="row content">
        <div className="col-lg-3 sidenav">
          <Projects
            userData={userData}
            setUserData={setUserData}
            currProj={currProj}
            setCurrProj={setCurrProj}
          />
        </div>
        <div className="col-lg-9">
          <Sessions
            userData={userData}
            setUserData={setUserData}
            currProj={currProj}
          />
        </div>
      </div>
      <footer className="container-fluid"></footer>
    </div>
  );
}

export default TimerPage;
