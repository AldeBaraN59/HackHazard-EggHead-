import { useState, useEffect } from 'react';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  return (
    <div className="settings-page">
      <h2>Settings</h2>

      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Enter your username"
        />
      </div>

      <div>
        <label htmlFor="darkModeToggle">Dark Mode</label>
        <input
          type="checkbox"
          id="darkModeToggle"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
      </div>
    </div>
  );
};

export default Settings;
