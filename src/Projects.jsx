import { useEffect, useState } from 'react';
import { Time } from './Timer';
import { v4 as uuid } from 'uuid';

function Projects({ userData, setUserData, currProj, setCurrProj }) {
  const [newProj, setNewProj] = useState('');
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(userData));
  }, [userData]);
  function handleChange(event) {
    setNewProj(event.target.value);
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const id = uuid();
    if (newProj.length > 0) {
      setUserData((prev) => ({
        ...prev,
        projCount: prev.projCount + 1,
        projects: [
          ...prev.projects,
          {
            id: id,
            name: newProj,
            sessions: [],
          },
        ],
      }));
      setCurrProj(id);
      setNewProj('');
    }
  };
  function selectProj(id) {
    setCurrProj(id);
  }
  function getProjTotalTime(projId) {
    let sum = 0;
    const index = userData.projects.findIndex(
      (project) => project.id === projId
    );
    userData.projects[index].sessions.map((session) => {
      sum += Number(session.seconds);
    });
    const time = new Time(sum);
    return time.toString();
  }
  function deleteProj(id) {
    const index = userData.projects.findIndex((project) => project.id === id);
    setUserData((prev) => ({
      ...prev,
      projCount: prev.projCount - 1,
      projects: [
        ...prev.projects.slice(0, index),
        ...prev.projects.slice(index + 1),
      ],
    }));
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          id="newProj"
          type="text"
          value={newProj}
          onChange={handleChange}
        />
        <button className="btn" type="submit">
          Add project
        </button>
      </form>
      <ul>
        {userData.projects.map((project) => (
          <li key={project.id}>
            <button
              className="btn btn-block"
              onClick={() => selectProj(project.id)}
            >
              {project.name} {getProjTotalTime(project.id)}
            </button>
            <button className="btn" onClick={() => deleteProj(project.id)}>
              <i className="bi bi-x-lg"></i>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Projects;
