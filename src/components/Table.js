import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Table.css";
import FileUpload from './upload';

const Table = () => {
  const [apps, setApps] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/apps');
        if (!response.ok) {
          throw new Error('Failed to fetch apps');
        }
        const data = await response.json();
        console.log('Response data:', data);
        setApps(data.apps);
      } catch (error) {
        console.error('Error fetching apps:', error);
        setError(error.message || 'Failed to fetch apps');
      }
    };

    fetchApps();
  }, []);

  const handlePlayButtonClick = (appName) => {
    // Implement the functionality for the play button click
    console.log(`Play button clicked for app: ${appName}`);
  };

  return (
    <div className="table-container">
      <FileUpload setApps={setApps} />
      <table className="table">
        <thead>
          <tr>
            <th>App Instance Name</th>
            <th>App Name</th>
            <th>Description</th>
            <th>Configuration</th>
            <th>Play</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((app, index) => (
            <TableRow
              key={index}
              appInstanceName={app.instance_name}
              appName={app.app_name}
              description={app.description}
              handlePlayButtonClick={handlePlayButtonClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableRow = ({ appInstanceName, appName, description, handlePlayButtonClick }) => {
  return (
    <tr>
      <td>
        <Link to="/form" state={{appName:appName}}>
          <div className="app">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-layout-grid"
            >
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
            <p>{appInstanceName}</p>
          </div>
        </Link>
      </td>
      <td>{appName}</td>
      <td>{description}</td>
      <td>
        <Link to="/form"state={{appName:appName}}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-settings"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </Link>
      </td>
      <td>
        <svg
          onClick={() => handlePlayButtonClick(appName)}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-play"
          style={{ cursor: "pointer" }}
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </td>
    </tr>
  );
};

export default Table;
