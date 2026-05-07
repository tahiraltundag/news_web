import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { leagues, standings, todayMatches } from '../data/mockData';

const leagueFixtures = {
  'super-lig': {
    recent: [
      { date: '04 May', home: 'Fenerbahçe', homeId: 'fenerbahce', away: 'Trabzonspor', awayId: 'trabzonspor', homeScore: 3, awayScore: 1 },
      { date: '03 May', home: 'Galatasaray', homeId: 'galatasaray', away: 'Beşiktaş', awayId: 'besiktas', homeScore: 3, awayScore: 0 },
      { date: '27 Nis', home: 'Galatasaray', homeId: 'galatasaray', away: 'Fenerbahçe', awayId: 'fenerbahce', homeScore: 2, awayScore: 1 },
      { date: '27 Nis', home: 'Beşiktaş', homeId: 'besiktas', away: 'Alanyaspor', awayId: 'alanyaspor', homeScore: 2, awayScore: 0 },
      { date: '20 Nis', home: 'Fenerbahçe', homeId: 'fenerbahce', away: 'Kayserispor', awayId: 'kayserispor', homeScore: 4, awayScore: 0 },
    ],
    upcoming: [
      { date: '10 May', home: 'Beşiktaş', homeId: 'besiktas', away: 'Fenerbahçe', awayId: 'fenerbahce', time: '20:00' },
      { date: '10 May', home: 'Galatasaray', homeId: 'galatasaray', away: 'Trabzonspor', awayId: 'trabzonspor', time: '20:45' },
      { date: '17 May', home: 'Fenerbahçe', homeId: 'fenerbahce', away: 'Galatasaray', awayId: 'galatasaray', time: '19:00' },
      { date: '25 May', home: 'Galatasaray', homeId: 'galatasaray', away: 'Kasımpaşa', awayId: 'kasimpasa', time: '19:00' },
    ],
  },
  'premier-league': {
    recent: [
      { date: '04 May', home: 'Arsenal', homeId: 'arsenal', away: 'Bournemouth', awayId: 'bournemouth', homeScore: 3, awayScore: 0 },
      { date: '03 May', home: 'Man City', homeId: 'manchester-city', away: 'Wolves', awayId: 'wolves', homeScore: 4, awayScore: 1 },
      { date: '27 Nis', home: 'Chelsea', homeId: 'chelsea', away: 'Arsenal', awayId: 'arsenal', homeScore: 1, awayScore: 2 },
    ],
    upcoming: [
      { date: '10 May', home: 'Arsenal', homeId: 'arsenal', away: 'Man City', awayId: 'manchester-city', time: '17:30' },
      { date: '11 May', home: 'Liverpool', homeId: 'liverpool', away: 'Chelsea', awayId: 'chelsea', time: '16:30' },
    ],
  },
};

function getResultClass(homeScore, awayScore, isHome) {
  if (homeScore === awayScore) return 'result-draw';
  const homeWon = homeScore > awayScore;
  return (isHome && homeWon) || (!isHome && !homeWon) ? 'result-win' : 'result-loss';
}

export default function LeaguePage() {
  const { leagueId } = useParams();
  const [tab, setTab] = useState('standings');

  const league = leagues.find(l => l.id === leagueId);
  const table = standings[leagueId];
  const fixtures = leagueFixtures[leagueId];

  if (!league) {
    return (
      <div className="empty-page">
        <h2>Lig bulunamadı</h2>
        <Link to="/futbol" className="btn-primary">Futbol'a Dön</Link>
      </div>
    );
  }

  return (
    <div className="league-page">
      <div className="league-hero" style={{ borderLeftColor: league.color }}>
        <span className="league-hero-flag">{league.flag}</span>
        <div>
          <h1 className="league-hero-title">{league.name}</h1>
          <span className="league-hero-country">{league.country}</span>
        </div>
      </div>

      <div className="league-tabs">
        {['standings', 'recent', 'upcoming'].map(t => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'standings' ? 'Puan Durumu' : t === 'recent' ? 'Son Maçlar' : 'Fikstür'}
          </button>
        ))}
      </div>

      <div className="league-content">
        {tab === 'standings' && table && (
          <div className="panel-card">
            <table className="standings-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Takım</th>
                  <th>O</th>
                  <th>G</th>
                  <th>B</th>
                  <th>M</th>
                  <th>A</th>
                  <th>Y</th>
                  <th>Av</th>
                  <th>P</th>
                  <th>Form</th>
                </tr>
              </thead>
              <tbody>
                {table.map(row => (
                  <tr key={row.pos} className={
                    row.pos <= 2 ? 'champion-zone' :
                    row.pos === 3 ? 'ucl-zone' : ''
                  }>
                    <td className="pos-cell">{row.pos}</td>
                    <td>
                      <Link to={`/futbol/${leagueId}/${row.teamId}`} className="team-link">
                        {row.team}
                      </Link>
                    </td>
                    <td>{row.played}</td>
                    <td>{row.won}</td>
                    <td>{row.drawn}</td>
                    <td>{row.lost}</td>
                    <td>{row.gf}</td>
                    <td>{row.ga}</td>
                    <td>{row.gf - row.ga > 0 ? '+' : ''}{row.gf - row.ga}</td>
                    <td className="pts-cell">{row.pts}</td>
                    <td>
                      <div className="form-badges">
                        {row.form.map((f, i) => (
                          <span key={i} className={`form-badge ${f === 'W' ? 'win' : f === 'D' ? 'draw' : 'loss'}`}>
                            {f === 'W' ? 'G' : f === 'D' ? 'B' : 'M'}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="standings-legend">
              <span className="legend-item champion">Şampiyon / 2. Tur</span>
              <span className="legend-item ucl">UEFA ŞL</span>
            </div>
          </div>
        )}

        {tab === 'standings' && !table && (
          <div className="coming-soon-card">
            <span>📊</span>
            <p>Bu lig için puan durumu yakında eklenecek.</p>
          </div>
        )}

        {tab === 'recent' && fixtures && (
          <div className="fixtures-list">
            {fixtures.recent.map((m, i) => (
              <div key={i} className="fixture-row">
                <span className="fixture-date">{m.date}</span>
                <Link to={`/futbol/${leagueId}/${m.homeId}`} className="fixture-team home">{m.home}</Link>
                <div className="fixture-score played">
                  <span>{m.homeScore}</span>
                  <span className="score-sep">-</span>
                  <span>{m.awayScore}</span>
                </div>
                <Link to={`/futbol/${leagueId}/${m.awayId}`} className="fixture-team away">{m.away}</Link>
              </div>
            ))}
          </div>
        )}

        {tab === 'upcoming' && fixtures && (
          <div className="fixtures-list">
            {fixtures.upcoming.map((m, i) => (
              <div key={i} className="fixture-row">
                <span className="fixture-date">{m.date}</span>
                <Link to={`/futbol/${leagueId}/${m.homeId}`} className="fixture-team home">{m.home}</Link>
                <div className="fixture-score upcoming-score">
                  <span className="score-time">{m.time}</span>
                </div>
                <Link to={`/futbol/${leagueId}/${m.awayId}`} className="fixture-team away">{m.away}</Link>
              </div>
            ))}
          </div>
        )}

        {(tab === 'recent' || tab === 'upcoming') && !fixtures && (
          <div className="coming-soon-card">
            <span>📅</span>
            <p>Bu lig için fikstür yakında eklenecek.</p>
          </div>
        )}
      </div>
    </div>
  );
}
