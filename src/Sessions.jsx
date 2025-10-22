import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

export class Time {
  sec;
  min;
  hour;
  constructor(seconds) {
    this.sec = seconds;
    this.min = Math.floor((seconds % 3600) / 60);
    this.hour = Math.floor(seconds / 3600);
  }
  toString() {
    let str = this.hour.toString().padStart(2, '0') + ':';
    str = str.concat(this.min.toString().padStart(2, '0'), ':');
    str = str.concat(this.sec.toString().padStart(2, '0'));
    return str;
  }
}

function Timer({
  seconds,
  setSeconds,
  timerStartDisabled,
  setTimerStartDisabled,
  timerPauseDisabled,
  setTimerPauseDisabled,
  timerResetDisabled,
  setTimerResetDisabled,
}) {
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      if (started === true) {
        setSeconds(seconds + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [started, seconds, setSeconds]);
  const time = new Time(seconds);
  function handleClickStart() {
    setStarted(true);
    setTimerStartDisabled(true);
    setTimerPauseDisabled(false);
    setTimerResetDisabled(false);
  }
  function handleClickPause() {
    setStarted(false);
    setTimerStartDisabled(false);
    setTimerPauseDisabled(true);
    setTimerResetDisabled(false);
  }
  function handleClickReset() {
    setStarted(false);
    setSeconds(0);
    setTimerStartDisabled(false);
    setTimerPauseDisabled(true);
    setTimerResetDisabled(true);
  }
  return (
    <div>
      <div>
        <h1>Time</h1>
        <h2>{time.toString()}</h2>
        <button onClick={handleClickStart} disabled={timerStartDisabled}>
          Start
        </button>
        <button onClick={handleClickPause} disabled={timerPauseDisabled}>
          Pause
        </button>
        <button onClick={handleClickReset} disabled={timerResetDisabled}>
          Reset
        </button>
      </div>
    </div>
  );
}

function Sessions({ userData, setUserData, currProj }) {
  const [seconds, setSeconds] = useState(0);
  const [timerStartDisabled, setTimerStartDisabled] = useState(true);
  const [timerPauseDisabled, setTimerPauseDisabled] = useState(true);
  const [timerResetDisabled, setTimerResetDisabled] = useState(true);
  const [startSessionDisabled, setStartSessionDisabled] = useState(false);
  const [endSessionDisabled, setEndSessionDisabled] = useState(true);
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(userData));
  }, [userData]);
  const startSession = () => {
    setTimerStartDisabled(false);
    setStartSessionDisabled(true);
    setEndSessionDisabled(false);
  };
  const endSession = (currProj) => {
    if (seconds > 0) {
      setUserData((prev) => ({
        ...prev,
        projects: prev.projects.map((project) =>
          project.id === currProj
            ? {
                ...project,
                sessions: [
                  ...project.sessions,
                  {
                    id: uuid(),
                    seconds: seconds,
                    date: Date(),
                  },
                ],
              }
            : project
        ),
      }));
    }
    setSeconds(0);
    setTimerStartDisabled(true);
    setTimerPauseDisabled(true);
    setTimerResetDisabled(true);
    setEndSessionDisabled(true);
    setStartSessionDisabled(false);
  };
  function deleteSession(sessionId) {
    const indexP = userData.projects.findIndex(
      (project) => project.id === currProj
    );
    const indexS = userData.projects[indexP].sessions.findIndex(
      (session) => session.id === sessionId
    );
    if (indexS !== -1) {
      setUserData((prev) => ({
        ...prev,
        projects: prev.projects.map((project) =>
          project.id === currProj
            ? {
                ...project,
                sessions: [
                  ...project.sessions.slice(0, indexS),
                  ...project.sessions.slice(indexS + 1),
                ],
              }
            : project
        ),
      }));
    }
  }
  function listSessions(currProj) {
    if (userData.projCount > 0) {
      const index = userData.projects.findIndex(
        (project) => project.id === currProj
      );
      if (index !== -1) {
        return userData.projects[index].sessions.map((session) => (
          <li key={session.id}>
            {session.date} {session.seconds}
            <button onClick={() => deleteSession(session.id)}>X</button>
          </li>
        ));
      }
    } else {
      return <></>;
    }
  }
  return (
    <div>
      <Timer
        seconds={seconds}
        setSeconds={setSeconds}
        timerStartDisabled={timerStartDisabled}
        setTimerStartDisabled={setTimerStartDisabled}
        timerPauseDisabled={timerPauseDisabled}
        setTimerPauseDisabled={setTimerPauseDisabled}
        timerResetDisabled={timerResetDisabled}
        setTimerResetDisabled={setTimerResetDisabled}
      />
      <button onClick={() => startSession()} disabled={startSessionDisabled}>
        New session
      </button>
      <button
        onClick={() => endSession(currProj)}
        disabled={endSessionDisabled}
      >
        End session
      </button>
      <ul>{listSessions(currProj)}</ul>
    </div>
  );
}

export default Sessions;
