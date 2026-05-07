const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Parser = require('rss-parser');

const app = express();
const db = new Database('database.db');
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || 'athletix_pulse_secret_key';
const parser = new Parser();

app.use(cors());
app.use(express.json());

// --- VERİTABANI KURULUMU ---
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT,
    title TEXT,
    lead TEXT,
    content TEXT,
    image TEXT,
    type TEXT,
    external_id TEXT UNIQUE -- Aynı haberi tekrar eklememek için
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    news_id INTEGER,
    username TEXT,
    comment TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(news_id) REFERENCES news(id)
  );
`);

// --- CANLI RSS HABER ÇEKİCİ (GERÇEK ZAMANLI) ---
async function fetchRealNewsFromWeb() {
  console.log('Sitelerden son dakika haberleri taranıyor...');
  
  // Güvenilir Spor RSS Kaynakları
  const feeds = [
    'https://www.fotomac.com.tr/rss/anasayfa.xml',
    'https://www.trtspor.com.tr/rss/anasayfa.xml'
  ];

  const insertNews = db.prepare('INSERT OR IGNORE INTO news (category, title, lead, content, image, type, external_id) VALUES (?, ?, ?, ?, ?, ?, ?)');

  for (const feedUrl of feeds) {
    try {
      const feed = await parser.parseURL(feedUrl);
      console.log(`${feed.title} firmasından veriler çekildi.`);

      feed.items.slice(0, 10).forEach((item, index) => {
        // Gelen haberi kategorize edelim (Bazıları gündem, bazıları flash)
        let type = index % 2 === 0 ? 'breaking' : 'agenda';
        
        // Görsel varsa al, yoksa standart bir futbol görseli kullan
        let imageUrl = 'https://images.unsplash.com/photo-1518605368461-1eb246ce0b30?auto=format&fit=crop&q=80&w=800';
        if (item.enclosure && item.enclosure.url) {
          imageUrl = item.enclosure.url;
        }

        // Başlık, açıklama ve içeriği temizle
        const title = item.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
        const lead = item.contentSnippet ? item.contentSnippet.substring(0, 150) : title;
        
        insertNews.run(
          'Gündem', 
          title, 
          lead, 
          (item.content || lead) + ' (Haberin devamı Athletix Pulse sunucularına aktarılmıştır.)', 
          imageUrl, 
          type, 
          item.link // Linki benzersiz ID olarak kullan
        );
      });
    } catch (error) {
      console.error(`RSS çekme hatası (${feedUrl}):`, error.message);
    }
  }
  console.log('Canlı haber güncellemesi tamamlandı.');
}

// Her 10 dakikada bir siteleri tara ve yeni haberleri al
setInterval(fetchRealNewsFromWeb, 10 * 60 * 1000);
// Sunucu açıldığında hemen çalıştır
fetchRealNewsFromWeb();


// --- API ENDPOINTLERİ ---

app.get('/api/news', (req, res) => {
  const allNews = db.prepare('SELECT * FROM news ORDER BY id DESC LIMIT 30').all();
  res.json(allNews);
});

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashedPassword);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Kullanıcı adı alınmış.' });
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY);
    res.json({ success: true, token, username: user.username });
  } else {
    res.status(401).json({ success: false, message: 'Hatalı giriş.' });
  }
});

app.get('/api/comments/:newsId', (req, res) => {
  const comments = db.prepare('SELECT * FROM comments WHERE news_id = ? ORDER BY timestamp DESC').all(req.params.newsId);
  res.json(comments);
});

app.post('/api/comments', (req, res) => {
  const { newsId, username, comment } = req.body;
  db.prepare('INSERT INTO comments (news_id, username, comment) VALUES (?, ?, ?)').run(newsId, username, comment);
  res.json({ success: true });
});

// React frontend'ini serve et (API route'larından SONRA gelmeli)
const distDir = path.join(__dirname, '..', 'dist');
app.use(express.static(distDir));
app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} üzerinde aktif.`);
});
