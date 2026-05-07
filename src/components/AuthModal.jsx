import React, { useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function AuthModal({ mode, onClose, onLogin }) {
  const [data, setData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = mode === 'login' ? '/login' : '/register';
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        if (mode === 'login') {
          onLogin({ username: result.username, token: result.token });
          onClose();
        } else {
          setError('Kayıt başarılı! Giriş yapabilirsiniz.');
        }
      } else {
        setError(result.message || 'Bir hata oluştu.');
      }
    } catch {
      setError('Sunucuya bağlanılamadı.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">{mode === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={data.username}
            onChange={e => setData({ ...data, username: e.target.value })}
            className="modal-input"
          />
          <input
            type="password"
            placeholder="Şifre"
            value={data.password}
            onChange={e => setData({ ...data, password: e.target.value })}
            className="modal-input"
          />
          {error && <p className="modal-error">{error}</p>}
          <button type="submit" className="btn-primary modal-submit">
            {mode === 'login' ? 'Giriş' : 'Kaydol'}
          </button>
        </form>
      </div>
    </div>
  );
}
