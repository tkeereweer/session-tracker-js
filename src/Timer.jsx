import { useState, useEffect } from 'react';
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
    <div className="timer-card">
      <div className="timer-header">Timer</div>
      <div className="timer-display">{time.toString()}</div>
      <div className="timer-edit-controls">
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
      <div className="timer-controls">
        <button
          className="btn btn-icon"
          onClick={handleClickStart}
          disabled={timerStartDisabled}
        >
          <i className="bi bi-play-fill"></i>
        </button>
        <button
          className="btn btn-icon"
          onClick={handleClickPause}
          disabled={timerPauseDisabled}
        >
          <i className="bi bi-pause-fill"></i>
        </button>
        <button
          className="btn btn-icon"
          onClick={handleClickReset}
          disabled={timerResetDisabled}
        >
          <i className="bi bi-arrow-counterclockwise"></i>
        </button>
      </div>
    </div>
  );
}

export default Timer;
