import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { todayMatches, leagues } from '../data/mockData';

export default function OddsPage() {
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [betSlip, setBetSlip] = useState([]);

  const filteredMatches = selectedLeague === 'all'
    ? todayMatches
    : todayMatches.filter(m => m.leagueId === selectedLeague);

  const addToBetSlip = (match, type, odd) => {
    const existing = betSlip.find(b => b.matchId === match.id);
    if (existing) {
      setBetSlip(betSlip.map(b => b.matchId === match.id ? { ...b, type, odd } : b));
    } else {
      setBetSlip([...betSlip, {
        matchId: match.id,
        home: match.home,
        away: match.away,
        type,
        odd,
      }]);
    }
  };

  const removeFromBetSlip = (matchId) => {
    setBetSlip(betSlip.filter(b => b.matchId !== matchId));
  };

  const totalOdd = betSlip.reduce((acc, b) => acc * b.odd, 1).toFixed(2);

  return (
    <div className="odds-page">
      <div className="odds-header">
        <h1 className="odds-title">🎯 İddaa Oranları</h1>
        <p className="odds-subtitle">Bugünkü maçlara ait güncel bahis oranları</p>
      </div>

      <div className="odds-layout">
        <div className="odds-main">
          {/* League filter */}
          <div className="odds-filter">
            <button
              className={`filter-btn ${selectedLeague === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedLeague('all')}
            >
              Tümü
            </button>
            {leagues.map(l => (
              <button
                key={l.id}
                className={`filter-btn ${selectedLeague === l.id ? 'active' : ''}`}
                onClick={() => setSelectedLeague(l.id)}
              >
                {l.flag} {l.name}
              </button>
            ))}
          </div>

          {/* Odds table header */}
          <div className="odds-table">
            <div className="odds-table-header">
              <span className="oh-time">Saat</span>
              <span className="oh-match">Maç</span>
              <span className="oh-odd">1</span>
              <span className="oh-odd">X</span>
              <span className="oh-odd">2</span>
            </div>

            {filteredMatches.map(match => {
              const inSlip = betSlip.find(b => b.matchId === match.id);
              return (
                <div key={match.id} className={`odds-row ${inSlip ? 'in-slip' : ''}`}>
                  <div className="odds-row-meta">
                    <span className="odds-time">{match.time}</span>
                    <span className="odds-competition">{match.flag} {match.competition}</span>
                  </div>
                  <div className="odds-row-body">
                    <div className="odds-teams">
                      <Link to={`/futbol/${match.leagueId}/${match.homeId}`} className="odds-team-link">
                        {match.home}
                      </Link>
                      <span className="odds-vs">vs</span>
                      <Link to={`/futbol/${match.leagueId}/${match.awayId}`} className="odds-team-link">
                        {match.away}
                      </Link>
                    </div>
                    <div className="odds-buttons">
                      <button
                        className={`odd-pick ${inSlip?.type === '1' ? 'selected' : ''}`}
                        onClick={() => addToBetSlip(match, '1', match.odds.home)}
                      >
                        <span className="odd-label">1</span>
                        <span className="odd-value">{match.odds.home}</span>
                      </button>
                      <button
                        className={`odd-pick ${inSlip?.type === 'X' ? 'selected' : ''}`}
                        onClick={() => addToBetSlip(match, 'X', match.odds.draw)}
                      >
                        <span className="odd-label">X</span>
                        <span className="odd-value">{match.odds.draw}</span>
                      </button>
                      <button
                        className={`odd-pick ${inSlip?.type === '2' ? 'selected' : ''}`}
                        onClick={() => addToBetSlip(match, '2', match.odds.away)}
                      >
                        <span className="odd-label">2</span>
                        <span className="odd-value">{match.odds.away}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bet Slip */}
        <div className="bet-slip">
          <h3 className="bet-slip-title">🎟️ Kupon</h3>
          {betSlip.length === 0 ? (
            <p className="bet-slip-empty">Oranları tıklayarak kupona ekleyin</p>
          ) : (
            <>
              {betSlip.map(b => (
                <div key={b.matchId} className="slip-item">
                  <div className="slip-match">
                    <span className="slip-teams">{b.home} vs {b.away}</span>
                    <span className="slip-type">{b.type === '1' ? b.home : b.type === '2' ? b.away : 'Beraberlik'}</span>
                  </div>
                  <div className="slip-right">
                    <span className="slip-odd">{b.odd}</span>
                    <button className="slip-remove" onClick={() => removeFromBetSlip(b.matchId)}>×</button>
                  </div>
                </div>
              ))}
              <div className="slip-total">
                <span>Toplam Oran</span>
                <span className="slip-total-odd">{totalOdd}</span>
              </div>
              <div className="slip-actions">
                <button className="btn-primary slip-play">Kuponu Oyna</button>
                <button className="btn-outline slip-clear" onClick={() => setBetSlip([])}>Temizle</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
