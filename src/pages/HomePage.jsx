import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { todayMatches, standings, mockNews, topPerformers } from '../data/mockData';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function MatchRow({ match }) {
  return (
    <div className="match-row">
      <div className="match-competition">
        <span>{match.flag}</span> {match.competition}
      </div>
      <div className="match-body">
        <span className="match-team home">{match.home}</span>
        <div className="match-score-box">
          {match.status === 'live' ? (
            <span className="score-live">{match.homeScore} - {match.awayScore}</span>
          ) : (
            <span className="score-time">{match.time}</span>
          )}
        </div>
        <span className="match-team away">{match.away}</span>
      </div>
      <div className="match-odds-mini">
        <span className="odd-btn">{match.odds.home}</span>
        <span className="odd-btn">{match.odds.draw}</span>
        <span className="odd-btn">{match.odds.away}</span>
      </div>
    </div>
  );
}

function NewsCard({ item, onClick }) {
  return (
    <div className="news-card" onClick={() => onClick(item)}>
      <div className="news-card-img-wrap">
        <img
          src={item.image}
          alt={item.title}
          className="news-card-img"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1518605368461-1eb246ce0b30?w=800&q=80'; }}
        />
        {item.type === 'breaking' && <span className="news-badge breaking">SON DAKİKA</span>}
        <span className="news-badge category">{item.category}</span>
      </div>
      <div className="news-card-body">
        <p className="news-time">{item.time}</p>
        <h3 className="news-card-title">{item.title}</h3>
        <p className="news-card-lead">{item.lead.substring(0, 100)}...</p>
      </div>
    </div>
  );
}

function ArticleModal({ article, user, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (article?.id < 100) {
      fetch(`${API_URL}/comments/${article.id}`)
        .then(r => r.json())
        .then(setComments)
        .catch(() => {});
    }
  }, [article]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    await fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newsId: article.id, username: user.username, comment: newComment }),
    });
    setNewComment('');
    const r = await fetch(`${API_URL}/comments/${article.id}`);
    setComments(await r.json());
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="article-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <span className="news-badge category" style={{ marginBottom: '16px', display: 'inline-block' }}>{article.category}</span>
        <h1 className="article-title">{article.title}</h1>
        <img
          src={article.image}
          alt={article.title}
          className="article-hero"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1518605368461-1eb246ce0b30?w=800&q=80'; }}
        />
        <p className="article-lead">{article.lead}</p>
        <div className="article-body">{article.content || article.lead}</div>

        <div className="comments-section">
          <h3 className="section-title">Yorumlar ({comments.length})</h3>
          {user ? (
            <form onSubmit={handleComment} className="comment-form">
              <textarea
                className="comment-textarea"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Görüşünü paylaş..."
                rows={3}
              />
              <button type="submit" className="btn-primary">Gönder</button>
            </form>
          ) : (
            <p className="comment-login-msg">Yorum yapmak için giriş yapmalısınız.</p>
          )}
          {comments.map(c => (
            <div key={c.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-user">@{c.username}</span>
                <span className="comment-time">{new Date(c.timestamp).toLocaleString('tr-TR')}</span>
              </div>
              <p>{c.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ user }) {
  const [serverNews, setServerNews] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/news`)
      .then(r => r.json())
      .then(setServerNews)
      .catch(() => {});
  }, []);

  const allNews = serverNews.length > 0 ? serverNews : mockNews;
  const superLigStandings = standings['super-lig'];
  const breakingNews = allNews.filter(n => n.type === 'breaking').slice(0, 3);
  const mainNews = allNews.slice(0, 6);

  return (
    <div className="home-layout">
      {/* Breaking news ticker */}
      <div className="ticker-bar">
        <span className="ticker-label">SON DAKİKA</span>
        <div className="ticker-track">
          <div className="ticker-content">
            {breakingNews.map((n, i) => (
              <span key={i} className="ticker-item" onClick={() => setSelectedArticle(n)}>
                {n.title} &nbsp;&nbsp;•&nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="home-grid">
        {/* Left: Today's matches */}
        <aside className="home-left">
          <h2 className="section-title">Bugünkü Maçlar</h2>
          <div className="matches-list">
            {todayMatches.map(match => (
              <Link key={match.id} to="/iddaa" style={{ textDecoration: 'none' }}>
                <MatchRow match={match} />
              </Link>
            ))}
          </div>
        </aside>

        {/* Center: News */}
        <main className="home-center">
          {mainNews[0] && (
            <div className="news-hero" onClick={() => setSelectedArticle(mainNews[0])}>
              <img
                src={mainNews[0].image}
                alt={mainNews[0].title}
                className="news-hero-img"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1518605368461-1eb246ce0b30?w=800&q=80'; }}
              />
              <div className="news-hero-overlay">
                {mainNews[0].type === 'breaking' && <span className="news-badge breaking">SON DAKİKA</span>}
                <h2 className="news-hero-title">{mainNews[0].title}</h2>
                <p className="news-hero-lead">{mainNews[0].lead}</p>
              </div>
            </div>
          )}

          <div className="news-grid">
            {mainNews.slice(1).map(item => (
              <NewsCard key={item.id} item={item} onClick={setSelectedArticle} />
            ))}
          </div>
        </main>

        {/* Right: Standings + Top Performers */}
        <aside className="home-right">
          <div className="panel-card">
            <div className="panel-header">
              <h3 className="panel-title">🇹🇷 Süper Lig</h3>
              <Link to="/futbol/super-lig" className="panel-more">Tümü</Link>
            </div>
            <table className="standings-mini">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Takım</th>
                  <th>O</th>
                  <th>G</th>
                  <th>Puan</th>
                </tr>
              </thead>
              <tbody>
                {superLigStandings.slice(0, 6).map(row => (
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

          <div className="panel-card" style={{ marginTop: '20px' }}>
            <div className="panel-header">
              <h3 className="panel-title">⭐ Top Performanslar</h3>
            </div>
            {topPerformers.map((p, i) => (
              <div key={i} className="performer-row">
                <span className="performer-rank">#{i + 1}</span>
                <div className="performer-info">
                  <span className="performer-name">{p.name} {p.nationality}</span>
                  <span className="performer-team">{p.team} · {p.position}</span>
                </div>
                <span className="performer-rating">{p.rating}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {selectedArticle && (
        <ArticleModal article={selectedArticle} user={user} onClose={() => setSelectedArticle(null)} />
      )}
    </div>
  );
}
