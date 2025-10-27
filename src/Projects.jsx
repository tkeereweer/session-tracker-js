import { useApp } from './AppContext';
import { useState } from 'react';
import { getProjTotalTime } from './utils/time';
import { v4 as uuid } from 'uuid';

function Projects() {
  const { userData, setUserData, currProj, setCurrProj } = useApp();
  const [newProj, setNewProj] = useState('');
  function handleChange(event) {
    setNewProj(event.target.value);
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const id = uuid();
    if (newProj.length > 0) {
      setUserData((prev) => ({
        ...prev,
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
  function deleteProj(id) {
    const index = userData.projects.findIndex((project) => project.id === id);
    setUserData((prev) => ({
      ...prev,
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
              <div className="project-time">
                {getProjTotalTime(project.id, userData)}
              </div>
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
