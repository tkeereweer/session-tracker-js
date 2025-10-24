import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { Button, Modal, Form } from 'react-bootstrap';
import { Time } from './Timer';
import Timer from './Timer';

function Sessions({ userData, setUserData, currProj }) {
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  const [timerStartDisabled, setTimerStartDisabled] = useState(true);
  const [timerPauseDisabled, setTimerPauseDisabled] = useState(true);
  const [timerResetDisabled, setTimerResetDisabled] = useState(true);
  const [startSessionDisabled, setStartSessionDisabled] = useState(false);
  const [endSessionDisabled, setEndSessionDisabled] = useState(true);
  const [timerEditDisabled, setTimerEditDisabled] = useState(true);
  const [showAddSession, setShowAddSession] = useState(false);
  const [addSessionDate, setAddSessionDate] = useState();
  const [addSessionMins, setAddSessionMins] = useState(0);
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
      <div className="session-controls">
        <button
          className="btn btn-success"
          onClick={() => startSession()}
          disabled={startSessionDisabled}
        >
          <i className="bi bi-play-fill me-2"></i>
          New session
        </button>
        <button
          className="btn btn-danger"
          onClick={() => endSession(currProj)}
          disabled={endSessionDisabled}
        >
          <i className="bi bi-stop-fill me-2"></i>
          End session
        </button>
      </div>
      <table className="table table-hover">
        <tbody>{listSessions(currProj)}</tbody>
      </table>
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
    </div>
  );
}

export default Sessions;
