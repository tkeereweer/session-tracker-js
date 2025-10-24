import { useState } from 'react';
import './TimerPage.css';

function DashboardPage() {
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
  const [week, setWeek] = useState('');
  return (
    <div>
      <form>
        <label className="form-label">Pick a week</label>
        <input
          type="week"
          className="form-control"
          id="weekInput"
          value={week}
          onChange={(event) => setWeek(event.target.value)}
        />
      </form>
    </div>
  );
}

export default DashboardPage;
