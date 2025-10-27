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

export function getProjTotalTime(projId, userData) {
  let sum = 0;
  const index = userData.projects.findIndex((project) => project.id === projId);
  userData.projects[index].sessions.map((session) => {
    sum += Number(session.seconds);
  });
  const time = new Time(sum);
  return time.toString();
}
