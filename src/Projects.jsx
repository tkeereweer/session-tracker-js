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
      <h3>Projects</h3>
      <form className="project-form" onSubmit={handleSubmit}>
        <input
          id="newProj"
          type="text"
          placeholder="New project name"
          value={newProj}
          onChange={handleChange}
        />
        <button className="btn btn-primary w-100" type="submit">
          <i className="bi bi-plus-circle me-2"></i>
          Add project
        </button>
      </form>
      <ul className="project-list">
        {userData.projects.map((project) => (
          <li
            key={project.id}
            className={`project-item ${currProj === project.id ? 'active' : ''}`}
            onClick={() => selectProj(project.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="project-item-content">
              <div className="project-name">{project.name}</div>
              <div className="project-time">{getProjTotalTime(project.id)}</div>
            </div>
            <button
              className="project-delete"
              onClick={(e) => {
                e.stopPropagation();
                deleteProj(project.id);
              }}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Projects;
