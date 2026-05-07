import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import HomePage from './pages/HomePage';
import SportPage from './pages/SportPage';
import LeaguePage from './pages/LeaguePage';
import TeamPage from './pages/TeamPage';
import OddsPage from './pages/OddsPage';

function Layout({ user, setUser, theme, toggleTheme }) {
  const [authMode, setAuthMode] = useState(null);

  return (
    <div className="app-wrapper">
      <Header
        user={user}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLoginClick={() => setAuthMode('login')}
        onRegisterClick={() => setAuthMode('register')}
        onLogout={() => setUser(null)}
      />

      <main className="page-content">
        <Routes>
          <Route index element={<HomePage user={user} />} />
          <Route path="futbol" element={<SportPage sport="futbol" />} />
          <Route path="futbol/:leagueId" element={<LeaguePage />} />
          <Route path="futbol/:leagueId/:teamId" element={<TeamPage />} />
          <Route path="basketbol" element={<SportPage sport="basketbol" />} />
          <Route path="tenis" element={<SportPage sport="tenis" />} />
          <Route path="voleybol" element={<SportPage sport="voleybol" />} />
          <Route path="motorsport" element={<SportPage sport="motorsport" />} />
          <Route path="iddaa" element={<OddsPage />} />
        </Routes>
      </main>

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onLogin={(userData) => setUser(userData)}
        />
      )}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(
    () => localStorage.getItem('tribun-theme') || 'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tribun-theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
          element={
            <Layout
              user={user}
              setUser={setUser}
              theme={theme}
              toggleTheme={toggleTheme}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
