import './TimerPage.css';
import Projects from './Projects.jsx';
import Sessions from './Sessions.jsx';

function TimerPage() {
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
          <Projects />
        </div>
        <div className="col-lg-9">
          <Sessions />
        </div>
      </div>
      <footer className="container-fluid"></footer>
    </div>
  );
}

export default TimerPage;
