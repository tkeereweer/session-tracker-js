import { Time } from './utils/time';
import { useState, useEffect } from 'react';
import { OverlayTrigger, Popover, Button } from 'react-bootstrap';
import { SESSION_STATE, TIMER_STATE } from './constants/timer';

function HandleClickIncr({ seconds, setSeconds, timerEditDisabled }) {
  const [addTime, setAddTime] = useState(0);
  const [show, setShow] = useState(false);
  function handleAddTimeSubmit(event) {
    event.preventDefault();
    setSeconds(Number(seconds) + Number(addTime) * 60);
    setAddTime(0);
    setShow(false);
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
      show={show}
      onToggle={(nextShow) => setShow(nextShow)}
    >
      <Button variant="info" disabled={timerEditDisabled}>
        <i className="bi bi-plus-circle"></i>
      </Button>
    </OverlayTrigger>
  );
}

function HandleClickDecr({ seconds, setSeconds, timerEditDisabled }) {
  const [decrTime, setDecrTime] = useState(0);
  const [show, setShow] = useState(false);
  function handleDecrTimeSubmit(event) {
    event.preventDefault();
    if (Number(seconds) - Number(decrTime) * 60 <= 0) {
      setSeconds(0);
    } else {
      setSeconds(Number(seconds) - Number(decrTime) * 60);
    }
    setDecrTime(0);
    setShow(false);
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
      show={show}
      onToggle={(nextShow) => setShow(nextShow)}
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
  sessionState,
  timerState,
  setTimerState,
}) {
  useEffect(() => {
    const interval = setInterval(() => {
      if (timerState === TIMER_STATE.RUNNING) {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [setSeconds, timerState]);
  const time = new Time(seconds);
  function handleClickStart() {
    setTimerState(TIMER_STATE.RUNNING);
  }
  function handleClickPause() {
    setTimerState(TIMER_STATE.PAUSED);
  }
  function handleClickReset() {
    setSeconds(0);
    setTimerState(TIMER_STATE.IDLE);
  }
  const isStartDisabled =
    timerState === TIMER_STATE.RUNNING ||
    sessionState === SESSION_STATE.NO_SESSION;
  const isPauseDisabled = timerState !== TIMER_STATE.RUNNING;
  const isResetDisabled = timerState === TIMER_STATE.IDLE;
  const isEditDisabled = sessionState !== SESSION_STATE.IN_SESSION;
  return (
    <div className="timer-card">
      <div className="timer-header">Timer</div>
      <div className="timer-display">{time.toString()}</div>
      <div className="timer-edit-controls">
        <HandleClickIncr
          seconds={seconds}
          setSeconds={setSeconds}
          timerEditDisabled={isEditDisabled}
        />
        <HandleClickDecr
          seconds={seconds}
          setSeconds={setSeconds}
          timerEditDisabled={isEditDisabled}
        />
      </div>
      <div className="timer-controls">
        <button
          className="btn btn-icon"
          onClick={handleClickStart}
          disabled={isStartDisabled}
        >
          <i className="bi bi-play-fill"></i>
        </button>
        <button
          className="btn btn-icon"
          onClick={handleClickPause}
          disabled={isPauseDisabled}
        >
          <i className="bi bi-pause-fill"></i>
        </button>
        <button
          className="btn btn-icon"
          onClick={handleClickReset}
          disabled={isResetDisabled}
        >
          <i className="bi bi-arrow-counterclockwise"></i>
        </button>
      </div>
    </div>
  );
}

export default Timer;
