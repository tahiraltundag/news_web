import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { teams } from '../data/mockData';
import SportField from '../components/SportField';

const positionOrder = { 'KALECİ': 0, 'DEFANS': 1, 'ORTA SAHA': 2, 'FORVET': 3 };

function getRating(score) {
  if (score >= 8) return 'rating-great';
  if (score >= 7.5) return 'rating-good';
  if (score >= 7) return 'rating-ok';
  return 'rating-avg';
}

function MatchResult({ match, teamName }) {
  const isHome = match.home === teamName;
  const homeScore = match.homeScore;
  const awayScore = match.awayScore;
  let result = 'B';
  let resultClass = 'result-draw';
  if (homeScore !== awayScore) {
    const won = (isHome && homeScore > awayScore) || (!isHome && awayScore > homeScore);
    result = won ? 'G' : 'M';
    resultClass = won ? 'result-win' : 'result-loss';
  }

  return (
    <div className="match-result-row">
      <span className={`result-badge ${resultClass}`}>{result}</span>
      <span className="mr-date">{match.date}</span>
      <span className="mr-competition">{match.competition}</span>
      <div className="mr-teams">
        <span className={isHome ? 'mr-team bold' : 'mr-team'}>{match.home}</span>
        <span className="mr-score">{homeScore} - {awayScore}</span>
        <span className={!isHome ? 'mr-team bold' : 'mr-team'}>{match.away}</span>
      </div>
    </div>
  );
}

function UpcomingMatch({ match, teamName }) {
  const isHome = match.home === teamName;
  return (
    <div className="match-result-row upcoming">
      <span className="result-badge result-upcoming">{isHome ? 'EV' : 'DEP'}</span>
      <span className="mr-date">{match.date}</span>
      <span className="mr-competition">{match.competition}</span>
      <div className="mr-teams">
        <span className={isHome ? 'mr-team bold' : 'mr-team'}>{match.home}</span>
        <span className="mr-score time">{match.time}</span>
        <span className={!isHome ? 'mr-team bold' : 'mr-team'}>{match.away}</span>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const { leagueId, teamId } = useParams();
  const [tab, setTab] = useState('squad');

  const team = teams[teamId];

  if (!team) {
    return (
      <div className="empty-page">
        <h2>Takım bulunamadı</h2>
        <Link to="/futbol" className="btn-primary">Futbol'a Dön</Link>
      </div>
    );
  }

  const sortedPlayers = [...team.players].sort(
    (a, b) => positionOrder[a.position] - positionOrder[b.position]
  );

  const positionGroups = sortedPlayers.reduce((acc, p) => {
    if (!acc[p.position]) acc[p.position] = [];
    acc[p.position].push(p);
    return acc;
  }, {});

  return (
    <div className="team-page">
      {/* Team Banner */}
      <div
        className="team-banner"
        style={{ background: `linear-gradient(135deg, ${team.bgColor} 0%, #0d0e13 100%)` }}
      >
        <div className="team-banner-inner">
          <div
            className="team-logo-big"
            style={{ background: team.accentColor, color: team.bgColor }}
          >
            {team.shortName}
          </div>
          <div className="team-banner-info">
            <h1 className="team-banner-name">{team.name}</h1>
            <div className="team-banner-meta">
              <span>🏟️ {team.stadium}</span>
              <span>👥 {team.capacity}</span>
              <span>👨‍💼 {team.manager}</span>
              <span>📅 {team.founded}</span>
            </div>
            <Link to={`/futbol/${team.league}`} className="team-league-badge">
              {team.leagueName}
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="league-tabs">
        {['squad', 'recent', 'upcoming'].map(t => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'squad' ? 'Kadro' : t === 'recent' ? 'Son Maçlar' : 'Fikstür'}
          </button>
        ))}
      </div>

      <div className="team-content">
        {tab === 'squad' && (
          <div className="squad-split">
            <div className="squad-sidebar">
              {Object.entries(positionGroups).map(([position, players]) => (
                <div key={position} className="position-group">
                  <h3 className="position-title">{position}</h3>
                  <div className="player-grid">
                    {players.map(player => (
                      <div key={player.id} className="player-card">
                        <div className="player-number">{player.number}</div>
                        <div className="player-info">
                          <span className="player-name">{player.name}</span>
                          <span className="player-meta">
                            {player.nationality} · {player.age} yaş
                          </span>
                        </div>
                        <div className={`player-rating ${getRating(player.rating)}`}>
                          {player.rating}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="squad-field">
              <SportField
                leagueId={team.league}
                players={team.players}
                accentColor={team.accentColor}
              />
            </div>
          </div>
        )}

        {tab === 'recent' && (
          <div className="matches-section">
            <h3 className="section-title">Son 5 Maç</h3>
            {team.recentMatches.map((m, i) => (
              <MatchResult key={i} match={m} teamName={team.name} />
            ))}
          </div>
        )}

        {tab === 'upcoming' && (
          <div className="matches-section">
            <h3 className="section-title">Önümüzdeki Maçlar</h3>
            {team.upcomingMatches.length > 0 ? (
              team.upcomingMatches.map((m, i) => (
                <UpcomingMatch key={i} match={m} teamName={team.name} />
              ))
            ) : (
              <p className="empty-msg">Yaklaşan maç bulunamadı.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
