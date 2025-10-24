import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { OverlayTrigger, Popover, Button } from 'react-bootstrap';

export class Time {
  sec;
  min;
  hour;
  constructor(seconds) {
    this.sec = (seconds % 3600) % 60;
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

function HandleClickIncr({ seconds, setSeconds, timerEditDisabled }) {
  const [addTime, setAddTime] = useState(0);
  function handleAddTimeSubmit(event) {
    event.preventDefault();
    setSeconds(Number(seconds) + Number(addTime) * 60);
    setAddTime(0);
  }
  function handleAddTimeChange(event) {
    setAddTime(event.target.value);
  }
  const popover = (
    <Popover id="timer-incr-popover">
      <Popover.Header as="h4">Add time to timer</Popover.Header>
      <Popover.Body>
        <form onSubmit={handleAddTimeSubmit}>
          <div className="mb-2">
            <label htmlFor="addTime" className="from-label">
              Add minutes
            </label>
            <input
              type="number"
              className="form-control form-control-sm"
              id="mins"
              name="mins"
              value={addTime}
              onChange={handleAddTimeChange}
            />
          </div>
          <Button variant="primary" size="sm" type="submit">
            Add time
          </Button>
        </form>
      </Popover.Body>
    </Popover>
  );
  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom"
      overlay={popover}
      rootCloseEvent="mousedown"
      rootClose={true}
    >
      <Button variant="info" disabled={timerEditDisabled}>
        <i className="bi bi-plus-circle"></i>
      </Button>
    </OverlayTrigger>
  );
}

function HandleClickDecr({ seconds, setSeconds, timerEditDisabled }) {
  const [decrTime, setDecrTime] = useState(0);
  function handleDecrTimeSubmit(event) {
    event.preventDefault();
    if (Number(seconds) - Number(decrTime) * 60 <= 0) {
      setSeconds(0);
    } else {
      setSeconds(Number(seconds) - Number(decrTime) * 60);
    }
    setDecrTime(0);
  }
  function handleDecrTimeChange(event) {
    setDecrTime(event.target.value);
  }
  const popover = (
    <Popover id="timer-decr-popover">
      <Popover.Header as="h4">Remove time from timer</Popover.Header>
      <Popover.Body>
        <form onSubmit={handleDecrTimeSubmit}>
          <div className="mb-2">
            <label htmlFor="addTime" className="from-label">
              Remove minutes
            </label>
            <input
              type="number"
              className="form-control form-control-sm"
              id="mins"
              name="mins"
              value={decrTime}
              onChange={handleDecrTimeChange}
            />
          </div>
          <Button variant="primary" size="sm" type="submit">
            Remove time
          </Button>
        </form>
      </Popover.Body>
    </Popover>
  );
  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom"
      overlay={popover}
      rootCloseEvent="mousedown"
      rootClose={true}
    >
      <Button variant="info" disabled={timerEditDisabled}>
        <i className="bi bi-dash-circle"></i>
      </Button>
    </OverlayTrigger>
  );
}

function Timer({
  seconds,
  setSeconds,
  started,
  setStarted,
  timerStartDisabled,
  setTimerStartDisabled,
  timerPauseDisabled,
  setTimerPauseDisabled,
  timerResetDisabled,
  setTimerResetDisabled,
  timerEditDisabled,
}) {
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
        <h1>Timer</h1>
        <div>
          <h2>{time.toString()}</h2>
          <HandleClickIncr
            seconds={seconds}
            setSeconds={setSeconds}
            timerEditDisabled={timerEditDisabled}
          />
          <HandleClickDecr
            seconds={seconds}
            setSeconds={setSeconds}
            timerEditDisabled={timerEditDisabled}
          />
        </div>
        <button
          className="btn"
          onClick={handleClickStart}
          disabled={timerStartDisabled}
        >
          <i className="bi bi-play-fill"></i>
        </button>
        <button
          className="btn"
          onClick={handleClickPause}
          disabled={timerPauseDisabled}
        >
          <i className="bi bi-pause-fill"></i>
        </button>
        <button
          className="btn"
          onClick={handleClickReset}
          disabled={timerResetDisabled}
        >
          <i className="bi bi-arrow-counterclockwise"></i>
        </button>
      </div>
    </div>
  );
}

function Sessions({ userData, setUserData, currProj }) {
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  const [timerStartDisabled, setTimerStartDisabled] = useState(true);
  const [timerPauseDisabled, setTimerPauseDisabled] = useState(true);
  const [timerResetDisabled, setTimerResetDisabled] = useState(true);
  const [startSessionDisabled, setStartSessionDisabled] = useState(false);
  const [endSessionDisabled, setEndSessionDisabled] = useState(true);
  const [timerEditDisabled, setTimerEditDisabled] = useState(true);
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(userData));
  }, [userData]);
  const startSession = () => {
    setStarted(true);
    setStartSessionDisabled(true);
    setEndSessionDisabled(false);
    setTimerStartDisabled(true);
    setTimerPauseDisabled(false);
    setTimerResetDisabled(false);
    setTimerEditDisabled(false);
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
                    date:
                      new Date().toDateString() +
                      ' ' +
                      new Date().getHours() +
                      ':' +
                      new Date().getMinutes() +
                      ':' +
                      new Date().getSeconds(),
                  },
                ],
              }
            : project
        ),
      }));
    }
    setSeconds(0);
    setStarted(false);
    setTimerStartDisabled(true);
    setTimerPauseDisabled(true);
    setTimerResetDisabled(true);
    setEndSessionDisabled(true);
    setStartSessionDisabled(false);
    setTimerEditDisabled(true);
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
          <tr key={session.id}>
            <td>{session.date}</td>
            <td>{new Time(session.seconds).toString()}</td>
            <td>
              <button className="btn" onClick={() => deleteSession(session.id)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </td>
          </tr>
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
        started={started}
        setStarted={setStarted}
        timerStartDisabled={timerStartDisabled}
        setTimerStartDisabled={setTimerStartDisabled}
        timerPauseDisabled={timerPauseDisabled}
        setTimerPauseDisabled={setTimerPauseDisabled}
        timerResetDisabled={timerResetDisabled}
        setTimerResetDisabled={setTimerResetDisabled}
        timerEditDisabled={timerEditDisabled}
      />
      <button
        className="btn"
        onClick={() => startSession()}
        disabled={startSessionDisabled}
      >
        New session
      </button>
      <button
        className="btn"
        onClick={() => endSession(currProj)}
        disabled={endSessionDisabled}
      >
        End session
      </button>
      <table className="table table-hover">
        <tbody>{listSessions(currProj)}</tbody>
      </table>
    </div>
  );
}

export default Sessions;
