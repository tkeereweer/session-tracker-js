import { useApp } from './AppContext';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Button, Modal, Form } from 'react-bootstrap';
import { Time } from './utils/time';
import Timer from './Timer';
import { SESSION_STATE, TIMER_STATE } from './constants/timer';

function Sessions() {
  const { userData, setUserData, currProj, setCurrProj } = useApp();
  const [seconds, setSeconds] = useState(0);
  const [timerState, setTimerState] = useState(TIMER_STATE.IDLE);
  const [sessionState, setSessionState] = useState(SESSION_STATE.NO_SESSION);
  const [showAddSession, setShowAddSession] = useState(false);
  const [addSessionDate, setAddSessionDate] = useState();
  const [addSessionMins, setAddSessionMins] = useState(0);
  const startSession = () => {
    setSessionState(SESSION_STATE.IN_SESSION);
    setTimerState(TIMER_STATE.RUNNING);
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
                      new Date().getHours().toString().padStart(2, '0') +
                      ':' +
                      new Date().getMinutes().toString().padStart(2, '0') +
                      ':' +
                      new Date().getSeconds().toString().padStart(2, '0'),
                  },
                ],
              }
            : project
        ),
      }));
    }
    setSessionState(SESSION_STATE.NO_SESSION);
    setTimerState(TIMER_STATE.IDLE);
    setSeconds(0);
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
    if (userData.projects.length > 0) {
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
  function handleShowAddSession() {
    setShowAddSession(true);
  }
  function handleSaveAddSession() {
    if (addSessionMins > 0) {
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
                    seconds: addSessionMins * 60,
                    date:
                      new Date(addSessionDate).toDateString() +
                      ' ' +
                      '12:00:00',
                  },
                ],
              }
            : project
        ),
      }));
    }
    handleCloseAddSession();
  }
  function handleCloseAddSession() {
    setShowAddSession(false);
    setAddSessionDate(new Date());
    setAddSessionMins(0);
  }
  return (
    <div className="main-content">
      <Timer
        seconds={seconds}
        setSeconds={setSeconds}
        sessionState={sessionState}
        timerState={timerState}
        setTimerState={setTimerState}
      />
      <div className="session-controls">
        <button
          className="btn btn-success"
          onClick={() => startSession()}
          disabled={sessionState !== SESSION_STATE.NO_SESSION}
        >
          <i className="bi bi-play-fill me-2"></i>
          New session
        </button>
        <button
          className="btn btn-danger"
          onClick={() => endSession(currProj)}
          disabled={sessionState !== SESSION_STATE.IN_SESSION}
        >
          <i className="bi bi-stop-fill me-2"></i>
          End session
        </button>
      </div>
      <div>
        <Button variant="primary" onClick={handleShowAddSession}>
          <i className="bi bi-plus-circle me-2"></i>
          Add a session
        </Button>
        <Modal show={showAddSession} onHide={handleCloseAddSession}>
          <Modal.Header closeButton>
            <Modal.Title>Add a session</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={addSessionDate}
                  onChange={(e) => setAddSessionDate(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Minutes</Form.Label>
                <Form.Control
                  type="number"
                  value={addSessionMins}
                  onChange={(e) => setAddSessionMins(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddSession}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveAddSession}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <table className="table table-hover">
        <tbody>{listSessions(currProj)}</tbody>
      </table>
    </div>
  );
}

export default Sessions;
