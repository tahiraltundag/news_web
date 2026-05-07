import React, { useState } from 'react';

/* ─── Formations: [{label, x%, y%}, ...] × 11 ── */
const FORMATIONS = {
  '4-3-3': [
    { label: 'KLÇ', x: 8,  y: 50 },
    { label: 'SBK', x: 26, y: 14 },
    { label: 'STP', x: 24, y: 34 },
    { label: 'STP', x: 24, y: 66 },
    { label: 'SĞB', x: 26, y: 86 },
    { label: 'ORT', x: 52, y: 22 },
    { label: 'ORT', x: 52, y: 50 },
    { label: 'ORT', x: 52, y: 78 },
    { label: 'SKT', x: 78, y: 20 },
    { label: 'STR', x: 78, y: 50 },
    { label: 'SĞK', x: 78, y: 80 },
  ],
  '4-2-3-1': [
    { label: 'KLÇ', x: 8,  y: 50 },
    { label: 'SBK', x: 26, y: 14 },
    { label: 'STP', x: 22, y: 34 },
    { label: 'STP', x: 22, y: 66 },
    { label: 'SĞB', x: 26, y: 86 },
    { label: 'DOS', x: 42, y: 37 },
    { label: 'DOS', x: 42, y: 63 },
    { label: 'SKT', x: 62, y: 20 },
    { label: 'OOS', x: 65, y: 50 },
    { label: 'SĞK', x: 62, y: 80 },
    { label: 'STR', x: 80, y: 50 },
  ],
  '4-4-2': [
    { label: 'KLÇ', x: 8,  y: 50 },
    { label: 'SBK', x: 26, y: 10 },
    { label: 'STP', x: 24, y: 34 },
    { label: 'STP', x: 24, y: 66 },
    { label: 'SĞB', x: 26, y: 90 },
    { label: 'SKT', x: 52, y: 10 },
    { label: 'ORT', x: 50, y: 34 },
    { label: 'ORT', x: 50, y: 66 },
    { label: 'SĞK', x: 52, y: 90 },
    { label: 'STR', x: 78, y: 36 },
    { label: 'STR', x: 78, y: 64 },
  ],
  '3-5-2': [
    { label: 'KLÇ', x: 8,  y: 50 },
    { label: 'STP', x: 24, y: 22 },
    { label: 'STP', x: 24, y: 50 },
    { label: 'STP', x: 24, y: 78 },
    { label: 'SKB', x: 46, y: 9  },
    { label: 'ORT', x: 44, y: 30 },
    { label: 'ORT', x: 44, y: 50 },
    { label: 'ORT', x: 44, y: 70 },
    { label: 'SĞB', x: 46, y: 91 },
    { label: 'STR', x: 78, y: 37 },
    { label: 'STR', x: 78, y: 63 },
  ],
  '5-3-2': [
    { label: 'KLÇ', x: 8,  y: 50 },
    { label: 'SKB', x: 24, y: 8  },
    { label: 'STP', x: 22, y: 27 },
    { label: 'STP', x: 22, y: 50 },
    { label: 'STP', x: 22, y: 73 },
    { label: 'SĞB', x: 24, y: 92 },
    { label: 'ORT', x: 52, y: 22 },
    { label: 'ORT', x: 52, y: 50 },
    { label: 'ORT', x: 52, y: 78 },
    { label: 'STR', x: 78, y: 37 },
    { label: 'STR', x: 78, y: 63 },
  ],
  '4-1-4-1': [
    { label: 'KLÇ', x: 8,  y: 50 },
    { label: 'SBK', x: 22, y: 12 },
    { label: 'STP', x: 20, y: 34 },
    { label: 'STP', x: 20, y: 66 },
    { label: 'SĞB', x: 22, y: 88 },
    { label: 'DOS', x: 40, y: 50 },
    { label: 'SKT', x: 60, y: 14 },
    { label: 'ORT', x: 58, y: 36 },
    { label: 'ORT', x: 58, y: 64 },
    { label: 'SĞK', x: 60, y: 86 },
    { label: 'STR', x: 80, y: 50 },
  ],
};

function buildSlots(formation) {
  return (FORMATIONS[formation] || FORMATIONS['4-3-3']).map((pos, i) => ({
    slotIdx: i, x: pos.x, y: pos.y, label: pos.label,
  }));
}

const POS_ORDER = { 'KALECİ': 0, 'DEFANS': 1, 'ORTA SAHA': 2, 'FORVET': 3 };

/* ─── Football Field (horizontal, interactive) */
function FootballField({ players, accentColor = '#f0a500' }) {
  const allSorted = [...players].sort(
    (a, b) => (POS_ORDER[a.position] ?? 4) - (POS_ORDER[b.position] ?? 4)
  );

  const [formation, setFormation] = useState('4-3-3');
  const [lineupIds, setLineupIds] = useState(() => {
    const ids = allSorted.slice(0, 11).map(p => p.id);
    while (ids.length < 11) ids.push(null);
    return ids;
  });
  const [draggingId, setDraggingId] = useState(null);
  const [draggingFrom, setDraggingFrom] = useState(null);
  const [dragOverKey, setDragOverKey] = useState(null);

  const playerMap = Object.fromEntries(players.map(p => [p.id, p]));
  const startingXI = lineupIds.map(id => (id != null ? playerMap[id] : null));
  const benchPlayers = allSorted.filter(p => !lineupIds.includes(p.id));
  const slots = buildSlots(formation);

  const changeFormation = (f) => {
    setFormation(f);
    const ids = allSorted.slice(0, 11).map(p => p.id);
    while (ids.length < 11) ids.push(null);
    setLineupIds(ids);
  };

  const onDragStart = (e, from, id) => {
    setDraggingId(id);
    setDraggingFrom(from);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragEnd = () => {
    setDraggingId(null);
    setDraggingFrom(null);
    setDragOverKey(null);
  };

  const dropOnField = (e, slotIdx) => {
    e.preventDefault();
    if (draggingId == null) { onDragEnd(); return; }
    setLineupIds(prev => {
      const next = [...prev];
      const existingId = next[slotIdx];
      if (draggingFrom === 'bench') {
        next[slotIdx] = draggingId;
      } else if (draggingFrom === 'field') {
        const fromSlot = next.indexOf(draggingId);
        if (fromSlot !== -1 && fromSlot !== slotIdx) {
          next[fromSlot] = existingId;
          next[slotIdx] = draggingId;
        }
      }
      return next;
    });
    onDragEnd();
  };

  const dropOnBench = (e, benchPlayerId) => {
    e.preventDefault();
    if (draggingId == null || draggingFrom !== 'field') { onDragEnd(); return; }
    setLineupIds(prev => {
      const next = [...prev];
      const fromSlot = next.indexOf(draggingId);
      if (fromSlot !== -1) next[fromSlot] = benchPlayerId;
      return next;
    });
    onDragEnd();
  };

  return (
    <div className="football-panel">
      <div className="formation-bar">
        <span className="formation-label">DİZİLİM</span>
        {Object.keys(FORMATIONS).map(f => (
          <button
            key={f}
            className={`formation-btn${formation === f ? ' active' : ''}`}
            onClick={() => changeFormation(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="field-bench-wrap">
        {/* Pitch */}
        <div className="sport-field-wrap">
          <svg viewBox="0 0 560 320" className="field-svg" preserveAspectRatio="xMidYMid meet">
            <defs>
              <pattern id="fp-stripes" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
                <rect width="28" height="56" fill="#2da44e"/>
                <rect x="28" width="28" height="56" fill="#279147"/>
              </pattern>
            </defs>
            <rect width="560" height="320" fill="url(#fp-stripes)" rx="0"/>
            <rect x="10" y="10" width="540" height="300" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5"/>
            <line x1="280" y1="10" x2="280" y2="310" stroke="rgba(255,255,255,0.85)" strokeWidth="2"/>
            <circle cx="280" cy="160" r="44" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2"/>
            <circle cx="280" cy="160" r="3" fill="rgba(255,255,255,0.9)"/>
            <rect x="10" y="90" width="100" height="140" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2"/>
            <rect x="10" y="122" width="42" height="76" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2"/>
            <rect x="2" y="143" width="10" height="34" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
            <circle cx="76" cy="160" r="2.5" fill="rgba(255,255,255,0.9)"/>
            <path d="M 110 112 A 60 60 0 0 1 110 208" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2"/>
            <rect x="450" y="90" width="100" height="140" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2"/>
            <rect x="508" y="122" width="42" height="76" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2"/>
            <rect x="548" y="143" width="10" height="34" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
            <circle cx="484" cy="160" r="2.5" fill="rgba(255,255,255,0.9)"/>
            <path d="M 450 112 A 60 60 0 0 0 450 208" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2"/>
            <path d="M 10 26 A 16 16 0 0 1 26 10" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
            <path d="M 534 10 A 16 16 0 0 1 550 26" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
            <path d="M 10 294 A 16 16 0 0 0 26 310" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
            <path d="M 550 294 A 16 16 0 0 1 534 310" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
          </svg>

          {slots.map((slot) => {
            const player = startingXI[slot.slotIdx];
            const isOver = dragOverKey === `f-${slot.slotIdx}`;

            if (!player) {
              return (
                <div
                  key={`empty-${slot.slotIdx}`}
                  className={`field-player field-player-empty${isOver ? ' drag-over' : ''}`}
                  style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                  onDragOver={(e) => { e.preventDefault(); setDragOverKey(`f-${slot.slotIdx}`); }}
                  onDragLeave={() => setDragOverKey(null)}
                  onDrop={(e) => dropOnField(e, slot.slotIdx)}
                >
                  <div className="field-player-dot field-empty-dot">
                    <span className="field-player-num">+</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={slot.slotIdx}
                className={`field-player${isOver ? ' drag-over' : ''}${draggingId === player.id ? ' dragging' : ''}`}
                style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                draggable
                onDragStart={(e) => onDragStart(e, 'field', player.id)}
                onDragEnd={onDragEnd}
                onDragOver={(e) => { e.preventDefault(); setDragOverKey(`f-${slot.slotIdx}`); }}
                onDragLeave={() => setDragOverKey(null)}
                onDrop={(e) => dropOnField(e, slot.slotIdx)}
              >
                <div className="field-player-dot" style={{ background: accentColor }}>
                  <span className="field-player-num">{player.number}</span>
                </div>
                <span className="field-player-label">{player.name.split(' ').slice(-1)[0]}</span>
              </div>
            );
          })}
        </div>

        {/* Bench sidebar */}
        <div className="field-bench-panel">
          <div className="bench-title">YEDEKLER</div>
          {benchPlayers.length === 0 && <span className="bench-empty">—</span>}
          {benchPlayers.map(player => {
            const isOver = dragOverKey === `b-${player.id}`;
            const abbr = player.posAbbr || { 'KALECİ': 'KLÇ', 'DEFANS': 'DEF', 'ORTA SAHA': 'ORT', 'FORVET': 'FRV' }[player.position] || '—';
            return (
              <div
                key={player.id}
                className={`bench-player${isOver ? ' drag-over' : ''}${draggingId === player.id ? ' dragging' : ''}`}
                draggable
                onDragStart={(e) => onDragStart(e, 'bench', player.id)}
                onDragEnd={onDragEnd}
                onDragOver={(e) => { e.preventDefault(); setDragOverKey(`b-${player.id}`); }}
                onDragLeave={() => setDragOverKey(null)}
                onDrop={(e) => dropOnBench(e, player.id)}
              >
                <span className="bench-num">{player.number}</span>
                <span className="bench-name">{player.name.split(' ').slice(-1)[0]}</span>
                <span className="bench-pos">{abbr}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Basketball Court ─────────────────────── */
const BBALL_POSITIONS = [
  { key: 'PG', label: 'Oyun Kurucu', x: 50, y: 38 },
  { key: 'SG', label: 'Şutör',       x: 78, y: 30 },
  { key: 'SF', label: 'K. Forvet',   x: 22, y: 30 },
  { key: 'PF', label: 'B. Forvet',   x: 72, y: 68 },
  { key: 'C',  label: 'Pivot',       x: 50, y: 72 },
];

function BasketballCourt({ players = [] }) {
  const filled = BBALL_POSITIONS.map((pos, i) => ({ ...pos, player: players[i] || null }));
  return (
    <div className="sport-field-wrap">
      <svg viewBox="0 0 560 320" className="field-svg" preserveAspectRatio="xMidYMid meet">
        <rect width="560" height="320" fill="#c07830" rx="6"/>
        <rect x="8" y="8" width="544" height="304" fill="#d08840" rx="4"/>
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1={8 + i * 46} y1="8" x2={8 + i * 46} y2="312" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
        ))}
        <line x1="280" y1="8" x2="280" y2="312" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
        <circle cx="280" cy="160" r="36" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
        <circle cx="280" cy="160" r="4" fill="rgba(255,255,255,0.7)"/>
        <rect x="8" y="90" width="145" height="140" fill="rgba(180,80,0,0.4)" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
        <path d="M 8 68 L 58 68 A 120 120 0 0 1 58 252 L 8 252" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
        <line x1="8" y1="90" x2="153" y2="90" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
        <line x1="8" y1="230" x2="153" y2="230" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
        <ellipse cx="153" cy="160" rx="36" ry="36" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeDasharray="6 4"/>
        <rect x="8" y="144" width="14" height="32" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
        <circle cx="28" cy="160" r="10" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
        <rect x="407" y="90" width="145" height="140" fill="rgba(180,80,0,0.4)" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
        <path d="M 552 68 L 502 68 A 120 120 0 0 0 502 252 L 552 252" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
        <line x1="407" y1="90" x2="552" y2="90" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
        <line x1="407" y1="230" x2="552" y2="230" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
        <ellipse cx="407" cy="160" rx="36" ry="36" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeDasharray="6 4"/>
        <rect x="538" y="144" width="14" height="32" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
        <circle cx="532" cy="160" r="10" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
        <rect x="8" y="8" width="544" height="304" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" rx="4"/>
      </svg>
      {filled.map((pos) => (
        <div key={pos.key} className="field-player" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
          <div className="field-player-dot bball">
            <span className="field-player-num">{pos.key}</span>
          </div>
          <span className="field-player-label">
            {pos.player ? pos.player.name.split(' ').slice(-1)[0] : pos.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Volleyball Court ─────────────────────── */
const VBALL_POSITIONS = [
  { key: 'P1', label: 'Pasör',  x: 75, y: 28 },
  { key: 'P2', label: 'Orta',   x: 50, y: 22 },
  { key: 'P3', label: 'Köşe',   x: 25, y: 28 },
  { key: 'P4', label: 'Köşe',   x: 25, y: 72 },
  { key: 'P5', label: 'Libero', x: 50, y: 78 },
  { key: 'P6', label: 'Orta',   x: 75, y: 72 },
];

function VolleyballCourt({ players = [] }) {
  const filled = VBALL_POSITIONS.map((pos, i) => ({ ...pos, player: players[i] || null }));
  return (
    <div className="sport-field-wrap">
      <svg viewBox="0 0 560 340" className="field-svg" preserveAspectRatio="xMidYMid meet">
        <rect width="560" height="340" fill="#8ab86a" rx="6"/>
        <rect x="10" y="10" width="540" height="320" fill="#9dcc7a" rx="4"/>
        <rect x="10" y="164" width="540" height="12" fill="#555"/>
        <line x1="10" y1="158" x2="550" y2="158" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5"/>
        <line x1="10" y1="182" x2="550" y2="182" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5"/>
        <line x1="10" y1="148" x2="10" y2="192" stroke="rgba(255,255,255,0.9)" strokeWidth="3"/>
        <line x1="550" y1="148" x2="550" y2="192" stroke="rgba(255,255,255,0.9)" strokeWidth="3"/>
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={i} x1={10 + i * 28} y1="164" x2={10 + i * 28} y2="176" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
        ))}
        <line x1="10" y1="104" x2="550" y2="104" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeDasharray="8 5"/>
        <line x1="10" y1="236" x2="550" y2="236" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeDasharray="8 5"/>
        <rect x="10" y="10" width="540" height="320" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" rx="4"/>
      </svg>
      {filled.map((pos) => (
        <div key={pos.key} className="field-player" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
          <div className="field-player-dot vball">
            <span className="field-player-num">{pos.key}</span>
          </div>
          <span className="field-player-label">
            {pos.player ? pos.player.name.split(' ').slice(-1)[0] : pos.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Tennis Court ─────────────────────────── */
function TennisCourt({ players = [] }) {
  const positions = [{ label: 'Servis', x: 30, y: 30 }, { label: 'Arka Hat', x: 70, y: 30 }];
  return (
    <div className="sport-field-wrap">
      <svg viewBox="0 0 560 380" className="field-svg" preserveAspectRatio="xMidYMid meet">
        <rect width="560" height="380" fill="#4a90d9" rx="6"/>
        <rect x="10" y="10" width="540" height="360" fill="#5ba0e8" rx="4"/>
        <rect x="30" y="30" width="500" height="320" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5"/>
        <line x1="280" y1="30" x2="280" y2="350" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        <rect x="277" y="28" width="6" height="324" fill="rgba(255,255,255,0.6)"/>
        <line x1="30" y1="190" x2="530" y2="190" stroke="rgba(255,255,255,0.9)" strokeWidth="2"/>
        <line x1="30" y1="110" x2="530" y2="110" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
        <line x1="30" y1="270" x2="530" y2="270" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
        <line x1="280" y1="110" x2="280" y2="270" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
        <rect x="10" y="10" width="540" height="360" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" rx="4"/>
      </svg>
      {positions.map((pos, i) => (
        <div key={i} className="field-player" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
          <div className="field-player-dot tennis">
            <span style={{ fontSize: '0.6rem' }}>🎾</span>
          </div>
          <span className="field-player-label">
            {players[i] ? players[i].name.split(' ').slice(-1)[0] : pos.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Motorsport Track ─────────────────────── */
function MotorsportTrack({ players = [] }) {
  const positions = [{ label: 'P1', x: 50, y: 20 }, { label: 'P2', x: 35, y: 30 }, { label: 'P3', x: 65, y: 30 }];
  return (
    <div className="sport-field-wrap">
      <svg viewBox="0 0 560 380" className="field-svg" preserveAspectRatio="xMidYMid meet">
        <rect width="560" height="380" fill="#1a1a2e" rx="6"/>
        <ellipse cx="280" cy="190" rx="240" ry="155" fill="none" stroke="#555" strokeWidth="40"/>
        <ellipse cx="280" cy="190" rx="240" ry="155" fill="none" stroke="#444" strokeWidth="36"/>
        <ellipse cx="280" cy="190" rx="200" ry="115" fill="#2d5a1b"/>
        <rect x="268" y="34" width="24" height="10" fill="white" opacity="0.9"/>
        <line x1="268" y1="34" x2="292" y2="34" stroke="black" strokeWidth="2"/>
        <line x1="268" y1="39" x2="292" y2="39" stroke="black" strokeWidth="2"/>
        <line x1="268" y1="44" x2="292" y2="44" stroke="black" strokeWidth="2"/>
        <ellipse cx="280" cy="190" rx="240" ry="155" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="10 8"/>
        <text x="280" y="200" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="14" fontWeight="bold">PIST</text>
      </svg>
      {positions.map((pos, i) => (
        <div key={i} className="field-player" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
          <div className="field-player-dot motor">
            <span className="field-player-num">{pos.label}</span>
          </div>
          <span className="field-player-label">
            {players[i] ? players[i].name.split(' ').slice(-1)[0] : pos.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Route by league ──────────────────────── */
const sportByLeague = {
  'super-lig': 'futbol', 'tff-1-lig': 'futbol', 'champions-league': 'futbol',
  'premier-league': 'futbol', 'la-liga': 'futbol', 'bundesliga': 'futbol',
  'serie-a': 'futbol', 'ligue-1': 'futbol',
  'nba': 'basketbol', 'euroleague': 'basketbol', 'bsl': 'basketbol',
  'efeler': 'voleybol', 'sultanlar': 'voleybol', 'cev-cl': 'voleybol',
  'wimbledon': 'tenis', 'roland-garros': 'tenis', 'us-open': 'tenis',
  'f1': 'motorsport', 'motogp': 'motorsport',
};

export default function SportField({ leagueId, players = [], accentColor }) {
  const sport = sportByLeague[leagueId] || 'futbol';
  switch (sport) {
    case 'futbol':     return <FootballField players={players} accentColor={accentColor} />;
    case 'basketbol':  return <BasketballCourt players={players} />;
    case 'voleybol':   return <VolleyballCourt players={players} />;
    case 'tenis':      return <TennisCourt players={players} />;
    case 'motorsport': return <MotorsportTrack players={players} />;
    default:           return <FootballField players={players} accentColor={accentColor} />;
  }
}
