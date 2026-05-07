import React from 'react';
import { Link } from 'react-router-dom';
import { sports, leagues } from '../data/mockData';

const megaMenuData = {
  futbol: {
    col1Title: 'Ligler',
    col2Title: 'Popüler Takımlar',
    col1: null, // leagues from mockData
    col2: [
      { name: 'Fenerbahçe', path: '/futbol/super-lig/fenerbahce', icon: '⚽' },
      { name: 'Galatasaray', path: '/futbol/super-lig/galatasaray', icon: '⚽' },
      { name: 'Beşiktaş', path: '/futbol/super-lig/besiktas', icon: '⚽' },
      { name: 'Trabzonspor', path: '/futbol/super-lig/trabzonspor', icon: '⚽' },
      { name: 'Arsenal', path: '/futbol/premier-league/arsenal', icon: '⚽' },
      { name: 'Real Madrid', path: '/futbol/la-liga/real-madrid', icon: '⚽' },
      { name: 'Barcelona', path: '/futbol/la-liga/barcelona', icon: '⚽' },
      { name: 'Man City', path: '/futbol/premier-league/manchester-city', icon: '⚽' },
    ],
  },
  basketbol: {
    col1Title: 'Ligler',
    col2Title: 'Takımlar',
    col1: [
      { name: 'NBA', flag: '🇺🇸', path: '/basketbol' },
      { name: 'EuroLeague', flag: '🏆', path: '/basketbol' },
      { name: 'Türkiye BSL', flag: '🇹🇷', path: '/basketbol' },
      { name: 'FIBA Dünya Kupası', flag: '🌍', path: '/basketbol' },
      { name: 'G-League', flag: '🇺🇸', path: '/basketbol' },
    ],
    col2: [
      { name: 'Fenerbahçe Beko', path: '/basketbol', icon: '🏀' },
      { name: 'Anadolu Efes', path: '/basketbol', icon: '🏀' },
      { name: 'Boston Celtics', path: '/basketbol', icon: '🏀' },
      { name: 'LA Lakers', path: '/basketbol', icon: '🏀' },
      { name: 'Real Madrid', path: '/basketbol', icon: '🏀' },
      { name: 'Barcelona', path: '/basketbol', icon: '🏀' },
    ],
  },
  tenis: {
    col1Title: 'Turnuvalar',
    col2Title: 'Oyuncular',
    col1: [
      { name: 'Wimbledon', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', path: '/tenis' },
      { name: 'Roland Garros', flag: '🇫🇷', path: '/tenis' },
      { name: 'US Open', flag: '🇺🇸', path: '/tenis' },
      { name: 'Avustralya Açık', flag: '🇦🇺', path: '/tenis' },
      { name: 'ATP Finals', flag: '🏆', path: '/tenis' },
      { name: 'WTA Finals', flag: '🏆', path: '/tenis' },
    ],
    col2: [
      { name: 'N. Djokovic', path: '/tenis', icon: '🎾' },
      { name: 'C. Alcaraz', path: '/tenis', icon: '🎾' },
      { name: 'J. Sinner', path: '/tenis', icon: '🎾' },
      { name: 'I. Swiatek', path: '/tenis', icon: '🎾' },
      { name: 'A. Sabalenka', path: '/tenis', icon: '🎾' },
      { name: 'C. Gauff', path: '/tenis', icon: '🎾' },
    ],
  },
  voleybol: {
    col1Title: 'Ligler',
    col2Title: 'Takımlar',
    col1: [
      { name: 'Efeler Ligi', flag: '🇹🇷', path: '/voleybol' },
      { name: 'Sultanlar Ligi', flag: '🇹🇷', path: '/voleybol' },
      { name: 'CEV Champions League', flag: '🏆', path: '/voleybol' },
      { name: 'FIVB Dünya Şampiyonası', flag: '🌍', path: '/voleybol' },
      { name: 'CEV Cup', flag: '🏆', path: '/voleybol' },
    ],
    col2: [
      { name: 'VakıfBank', path: '/voleybol', icon: '🏐' },
      { name: 'Fenerbahçe Opet', path: '/voleybol', icon: '🏐' },
      { name: 'Halkbank', path: '/voleybol', icon: '🏐' },
      { name: 'Ziraat Bankası', path: '/voleybol', icon: '🏐' },
      { name: 'Galatasaray HDI', path: '/voleybol', icon: '🏐' },
    ],
  },
  motorsport: {
    col1Title: 'Seriler',
    col2Title: 'Pilotlar',
    col1: [
      { name: 'Formula 1', flag: '🌍', path: '/motorsport' },
      { name: 'MotoGP', flag: '🌍', path: '/motorsport' },
      { name: 'WRC Ralli', flag: '🌍', path: '/motorsport' },
      { name: 'Formula E', flag: '⚡', path: '/motorsport' },
      { name: 'DTM', flag: '🇩🇪', path: '/motorsport' },
    ],
    col2: [
      { name: 'M. Verstappen', path: '/motorsport', icon: '🏎️' },
      { name: 'L. Hamilton', path: '/motorsport', icon: '🏎️' },
      { name: 'C. Leclerc', path: '/motorsport', icon: '🏎️' },
      { name: 'L. Norris', path: '/motorsport', icon: '🏎️' },
      { name: 'C. Sainz', path: '/motorsport', icon: '🏎️' },
    ],
  },
};

const footballLeagues = [
  { id: 'super-lig', name: 'Süper Lig', flag: '🇹🇷' },
  { id: 'tff-1-lig', name: 'TFF 1. Lig', flag: '🇹🇷' },
  { id: 'champions-league', name: 'Şampiyonlar Ligi', flag: '🏆' },
  { id: 'premier-league', name: 'Premier Lig', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'la-liga', name: 'La Liga', flag: '🇪🇸' },
  { id: 'bundesliga', name: 'Bundesliga', flag: '🇩🇪' },
  { id: 'serie-a', name: 'Serie A', flag: '🇮🇹' },
  { id: 'ligue-1', name: 'Ligue 1', flag: '🇫🇷' },
];

function MegaMenu({ sportId }) {
  const data = megaMenuData[sportId];
  if (!data) return null;

  const col1Items = sportId === 'futbol'
    ? footballLeagues.map(l => ({ name: l.name, flag: l.flag, path: `/futbol/${l.id}` }))
    : data.col1;

  return (
    <div className="mega-menu">
      <div className="mega-menu-inner">
        <div className="mega-col">
          <div className="mega-title">{data.col1Title}</div>
          {col1Items.map((item, i) => (
            <Link key={i} to={item.path} className="mega-link">
              <span>{item.flag || item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
        <div className="mega-col">
          <div className="mega-title">{data.col2Title}</div>
          {data.col2.map((item, i) => (
            <Link key={i} to={item.path} className="mega-link">
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Header({ user, theme, onToggleTheme, onLoginClick, onRegisterClick, onLogout }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="site-logo">
          TRİBÜN<span>·</span>
        </Link>

        <nav className="header-nav">
          {sports.map(sport => (
            <div key={sport.id} className="nav-item">
              <Link
                to={sport.id === 'iddaa' ? '/iddaa' : `/${sport.id}`}
                className="nav-link"
              >
                <span className="nav-icon">{sport.icon}</span>
                {sport.name}
              </Link>
              {sport.id !== 'iddaa' && <MegaMenu sportId={sport.id} />}
            </div>
          ))}
        </nav>

        <div className="header-auth">
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            title={theme === 'light' ? 'Koyu temaya geç' : 'Açık temaya geç'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {user ? (
            <>
              <span className="auth-user">@{user.username}</span>
              <button className="btn-outline" onClick={onLogout}>Çıkış</button>
            </>
          ) : (
            <>
              <button className="btn-outline" onClick={onRegisterClick}>Kaydol</button>
              <button className="btn-primary" onClick={onLoginClick}>Giriş Yap</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
