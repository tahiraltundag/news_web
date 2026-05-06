import React, { useState, useEffect } from 'react'

const API_URL = 'http://localhost:5000/api';

function App() {
  const [news, setNews] = useState([])
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [user, setUser] = useState(null)
  const [authMode, setAuthMode] = useState(null)
  const [authData, setAuthData] = useState({ username: '', password: '' })
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/news`)
      .then(res => res.json())
      .then(data => setNews(data))
      .catch(err => console.log('Sunucuya bağlanılamadı:', err))
  }, [])

  useEffect(() => {
    if (selectedArticle) {
      fetch(`${API_URL}/comments/${selectedArticle.id}`)
        .then(res => res.json())
        .then(data => setComments(data))
    }
  }, [selectedArticle])

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = authMode === 'login' ? '/login' : '/register';
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authData)
      });
      const data = await res.json();
      if (data.success) {
        if (authMode === 'login') {
          setUser({ username: data.username, token: data.token });
          setAuthMode(null);
        } else {
          alert('Kayıt başarılı! Giriş yapabilirsiniz.');
          setAuthMode('login');
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Sunucu hatası!');
    }
  }

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return alert('Giriş yapmalısınız.');
    const res = await fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        newsId: selectedArticle.id,
        username: user.username,
        comment: newComment
      })
    });
    if (res.ok) {
      setNewComment('');
      const commRes = await fetch(`${API_URL}/comments/${selectedArticle.id}`);
      const commData = await commRes.json();
      setComments(commData);
    }
  }

  // Resim yüklenemezse çalışacak fonksiyon
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1518605368461-1eb246ce0b30?auto=format&fit=crop&q=80&w=600';
  };

  return (
    <div className="app-wrapper">
      <header className="main-header">
        <div className="logo">ATHLETIX<span>PULSE</span></div>
        <nav className="auth-section">
          {user ? (
            <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
              <span className="comment-user">@{user.username}</span>
              <button className="auth-btn secondary" onClick={() => setUser(null)}>Çıkış</button>
            </div>
          ) : (
            <div style={{display: 'flex', gap: '15px'}}>
              <button className="auth-btn secondary" onClick={() => setAuthMode('register')}>Kaydol</button>
              <button className="auth-btn primary" onClick={() => setAuthMode('login')}>Giriş Yap</button>
            </div>
          )}
        </nav>
      </header>

      <main className="content-grid">
        {/* Sol Sütun */}
        <aside className="column">
          <h2 className="col-title">🎙️ Uzman Analizleri</h2>
          {news.filter(n => n.type === 'expert').map(item => (
            <div key={item.id} className="expert-card" onClick={() => setSelectedArticle(item)}>
              <div className="expert-header">
                <img src={item.image} alt={item.title} className="expert-img" onError={handleImageError} />
                <span className="expert-name">{item.title}</span>
              </div>
              <p className="expert-quote">"{item.lead}"</p>
            </div>
          ))}
        </aside>

        {/* Orta Sütun */}
        <section className="column">
          <h2 className="col-title">⚽ Futbol Gündemi</h2>
          <div className="main-news-grid">
            {news.filter(n => n.type === 'agenda').map(item => (
              <div key={item.id} className="main-card" onClick={() => setSelectedArticle(item)}>
                <img src={item.image} alt={item.title} className="main-card-img" onError={handleImageError} />
                <div className="main-card-body">
                  <span className="breaking-time">{item.category}</span>
                  <h3 className="main-card-title">{item.title}</h3>
                  <p style={{fontSize: '0.8rem', color: 'var(--text-dim)'}}>{item.lead.substring(0, 100)}...</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sağ Sütun */}
        <aside className="column">
          <h2 className="col-title">⚡ Flash Haber</h2>
          {news.filter(n => n.type === 'breaking').map(item => (
            <div key={item.id} className="breaking-item" onClick={() => setSelectedArticle(item)}>
              <span className="breaking-time">AZ ÖNCE</span>
              <h3 className="breaking-title">{item.title}</h3>
            </div>
          ))}
        </aside>
      </main>

      {/* Giriş/Kayıt Modal */}
      {authMode && (
        <div className="article-overlay" style={{alignItems: 'center'}}>
          <div className="auth-modal">
            <h2 style={{fontFamily: 'var(--accent-font)', marginBottom: '25px', color: 'var(--primary)'}}>
              {authMode === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
            </h2>
            <form onSubmit={handleAuth}>
              <input 
                type="text" 
                placeholder="Kullanıcı Adı" 
                onChange={(e) => setAuthData({...authData, username: e.target.value})}
              />
              <input 
                type="password" 
                placeholder="Şifre" 
                onChange={(e) => setAuthData({...authData, password: e.target.value})}
              />
              <button type="submit" className="auth-btn primary" style={{width: '100%', padding: '15px', marginTop: '10px'}}>
                {authMode === 'login' ? 'Giriş' : 'Kaydol'}
              </button>
            </form>
            <button className="auth-btn secondary" style={{width: '100%', marginTop: '15px', border: 'none'}} onClick={() => setAuthMode(null)}>Vazgeç</button>
          </div>
        </div>
      )}

      {/* Makale & Yorum Detayı */}
      {selectedArticle && (
        <div className="article-overlay">
          <button className="close-btn" onClick={() => setSelectedArticle(null)}>×</button>
          <div className="article-content">
            <span className="breaking-time" style={{fontSize: '1rem'}}>{selectedArticle.category}</span>
            <h1 style={{fontFamily: 'var(--accent-font)', fontSize: '3.5rem', margin: '20px 0', lineHeight: '1.1'}}>{selectedArticle.title}</h1>
            <img src={selectedArticle.image} onError={handleImageError} style={{width: '100%', borderRadius: '20px', marginBottom: '40px', border: '1px solid var(--border)'}} />
            <div className="article-lead">{selectedArticle.lead}</div>
            <div className="article-body" style={{fontSize: '1.2rem', color: '#ccc'}}>
              {selectedArticle.content}
            </div>

            {/* Yorumlar */}
            <div className="comments-container">
              <h2 className="col-title">💬 Yorumlar ({comments.length})</h2>
              
              {user ? (
                <form onSubmit={handleComment} style={{marginBottom: '40px'}}>
                  <textarea 
                    className="comment-input"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Futbol hakkında bir yorum bırak..."
                    rows="4"
                  />
                  <button type="submit" className="auth-btn primary">Yorumu Yayınla</button>
                </form>
              ) : (
                <div className="comment-box" style={{textAlign: 'center', padding: '40px'}}>
                  <p style={{color: 'var(--text-dim)', marginBottom: '20px'}}>Tartışmaya katılmak için giriş yapmalısınız.</p>
                  <button className="auth-btn primary" onClick={() => setAuthMode('login')}>Giriş Yap</button>
                </div>
              )}

              <div className="comments-list">
                {comments.map(c => (
                  <div key={c.id} className="comment-box">
                    <div className="comment-header">
                      <span className="comment-user">@{c.username}</span>
                      <span style={{color: 'var(--text-dim)'}}>{new Date(c.timestamp).toLocaleString('tr-TR')}</span>
                    </div>
                    <p style={{fontSize: '1rem'}}>{c.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
