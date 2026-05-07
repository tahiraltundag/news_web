import React from 'react';
import { Link } from 'react-router-dom';
import { leagues, todayMatches, standings } from '../data/mockData';

const sportInfo = {
  futbol: {
    title: 'Futbol',
    icon: '⚽',
    description: 'Dünya genelinde ligler, takımlar, maçlar ve haberler',
    color: '#c5ff4a',
  },
  basketbol: {
    title: 'Basketbol',
    icon: '🏀',
    description: 'NBA, Euroleague, BSL ve daha fazlası',
    color: '#ff7043',
  },
  tenis: {
    title: 'Tenis',
    icon: '🎾',
    description: 'Grand Slam, ATP, WTA turnuvaları',
    color: '#66bb6a',
  },
  voleybol: {
    title: 'Voleybol',
    icon: '🏐',
    description: 'Dünya Şampiyonası, CEV Champions League',
    color: '#29b6f6',
  },
  motorsport: {
    title: 'Motorsport',
    icon: '🏎️',
    description: 'Formula 1, MotoGP, WRC ve daha fazlası',
    color: '#ef5350',
  },
};

const basketbolLeagues = [
  { id: 'nba', name: 'NBA', country: 'ABD', flag: '🇺🇸' },
  { id: 'euroleague', name: 'EuroLeague', country: 'Avrupa', flag: '🏆' },
  { id: 'bsl', name: 'BSL', country: 'Türkiye', flag: '🇹🇷' },
  { id: 'nbl', name: 'NBL', country: 'Avustralya', flag: '🇦🇺' },
];

const tenisLeagues = [
  { id: 'wimbledon', name: 'Wimbledon', country: 'İngiltere', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'roland-garros', name: 'Roland Garros', country: 'Fransa', flag: '🇫🇷' },
  { id: 'us-open', name: 'US Open', country: 'ABD', flag: '🇺🇸' },
  { id: 'australian-open', name: 'Avustralya Açık', country: 'Avustralya', flag: '🇦🇺' },
];

const motorsportLeagues = [
  { id: 'f1', name: 'Formula 1', country: 'Dünya', flag: '🌍' },
  { id: 'motogp', name: 'MotoGP', country: 'Dünya', flag: '🌍' },
  { id: 'wrc', name: 'WRC', country: 'Dünya', flag: '🌍' },
];

function getLeaguesForSport(sport) {
  if (sport === 'futbol') return leagues.filter(l => l.sport === 'futbol');
  if (sport === 'basketbol') return basketbolLeagues;
  if (sport === 'tenis') return tenisLeagues;
  if (sport === 'motorsport') return motorsportLeagues;
  return [];
}

export default function SportPage({ sport }) {
  const info = sportInfo[sport] || { title: sport, icon: '🏅', color: '#c5ff4a' };
  const sportLeagues = getLeaguesForSport(sport);
  const matches = todayMatches.filter(() => sport === 'futbol').slice(0, 5);
  const table = sport === 'futbol' ? standings['super-lig'] : null;

  return (
    <div className="sport-page">
      <div className="sport-hero" style={{ borderColor: info.color }}>
        <span className="sport-hero-icon">{info.icon}</span>
        <div>
          <h1 className="sport-hero-title" style={{ color: info.color }}>{info.title}</h1>
          <p className="sport-hero-desc">{info.description}</p>
        </div>
      </div>

      <div className="sport-layout">
        <div className="sport-main">
          <h2 className="section-title">Ligler & Turnuvalar</h2>
          <div className="league-grid">
            {sportLeagues.map(league => (
              <Link
                key={league.id}
                to={sport === 'futbol' ? `/futbol/${league.id}` : '#'}
                className="league-card"
              >
                <span className="league-flag">{league.flag}</span>
                <div className="league-info">
                  <span className="league-name">{league.name}</span>
                  <span className="league-country">{league.country}</span>
                </div>
                <span className="league-arrow">›</span>
              </Link>
            ))}
          </div>

          {sport === 'futbol' && (
            <>
              <h2 className="section-title" style={{ marginTop: '32px' }}>Bugünkü Maçlar</h2>
              <div className="matches-panel">
                {matches.map(match => (
                  <div key={match.id} className="match-row">
                    <div className="match-competition">
                      <span>{match.flag}</span> {match.competition}
                    </div>
                    <div className="match-body">
                      <span className="match-team home">{match.home}</span>
                      <div className="match-score-box">
                        <span className="score-time">{match.time}</span>
                      </div>
                      <span className="match-team away">{match.away}</span>
                    </div>
                    <div className="match-odds-mini">
                      <span className="odd-btn">{match.odds.home}</span>
                      <span className="odd-btn">{match.odds.draw}</span>
                      <span className="odd-btn">{match.odds.away}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {sport !== 'futbol' && (
            <div className="coming-soon-card">
              <span>{info.icon}</span>
              <p>{info.title} içerikleri yakında burada!</p>
            </div>
          )}
        </div>

        {table && (
          <div className="sport-sidebar">
            <div className="panel-card">
              <div className="panel-header">
                <h3 className="panel-title">🇹🇷 Süper Lig Puan Durumu</h3>
                <Link to="/futbol/super-lig" className="panel-more">Tümü</Link>
              </div>
              <table className="standings-mini">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Takım</th>
                    <th>O</th>
                    <th>G</th>
                    <th>P</th>
                  </tr>
                </thead>
                <tbody>
                  {table.map(row => (
                    <tr key={row.pos} className={row.pos <= 2 ? 'champion-zone' : row.pos === 3 ? 'ucl-zone' : ''}>
                      <td className="pos-cell">{row.pos}</td>
                      <td>
                        <Link to={`/futbol/super-lig/${row.teamId}`} className="team-link">
                          {row.team}
                        </Link>
                      </td>
                      <td>{row.played}</td>
                      <td>{row.won}</td>
                      <td className="pts-cell">{row.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
