import { SHAPES, COLOR_PALETTE, DEFAULT_KEYS, BUILTIN_SONGS } from './songs.js';
import { soundEngine } from './audio.js';

const STORAGE_KEYS = {
  KEY_CONFIG: 'fpdj_key_config_v1',
  FAVORITES: 'fpdj_favorites_v1',
  CUSTOM_SONGS: 'fpdj_custom_songs_v1',
  PREFS: 'fpdj_prefs_v1'
};

const state = {
  keys: loadJSON(STORAGE_KEYS.KEY_CONFIG, DEFAULT_KEYS),
  favorites: new Set(loadJSON(STORAGE_KEYS.FAVORITES, ['wlazl-kotek', 'sto-lat'])),
  customSongs: loadJSON(STORAGE_KEYS.CUSTOM_SONGS, []),
  prefs: loadJSON(STORAGE_KEYS.PREFS, {
    showLetters: true,
    largeTiles: false,
    tempoMultiplier: 1.0,
    loop: false,
    soundMode: 'piano'
  }),
  search: '',
  category: 'Wszystkie',
  activeSongId: null,
  // Odtwarzanie
  isPlaying: false,
  activeFlatIndex: -1,
  playTimer: null,
  // Modale
  modal: null, // 'calibrate' | 'creator' | 'install' | null
  selectedCalibKey: 1
};

soundEngine.setMode(state.prefs.soundMode);

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEYS.KEY_CONFIG, JSON.stringify(state.keys));
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify([...state.favorites]));
    localStorage.setItem(STORAGE_KEYS.CUSTOM_SONGS, JSON.stringify(state.customSongs));
    localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(state.prefs));
  } catch (_) {}
}

function getAllSongs() {
  return [...state.customSongs, ...BUILTIN_SONGS];
}

function getKeyMeta(keyNum) {
  const k = state.keys.find((item) => item.keyNum === keyNum) || DEFAULT_KEYS[0];
  const color = COLOR_PALETTE.find((c) => c.id === k.colorId) || COLOR_PALETTE[0];
  const shape = SHAPES[k.shapeId] || SHAPES.circle;
  return { ...k, color, shape };
}

function renderShapeSVG(shapeId) {
  const shape = SHAPES[shapeId] || SHAPES.circle;
  return `<svg viewBox="0 0 48 48" aria-hidden="true">${shape.svg}</svg>`;
}

function flattenSongNotes(song) {
  const flat = [];
  song.lines.forEach((line, lineIdx) => {
    line.forEach((entry, noteIdx) => {
      const [keyNum, beats, lyric = ''] = entry;
      flat.push({ keyNum, beats, lyric, lineIdx, noteIdx, flatIdx: flat.length });
    });
  });
  return flat;
}

// Parsowanie tekstu literowego (np. "G E E | F D D | C E G") na strukturę utworu
export function parseNoteTextToLines(noteText, lyricsText = '') {
  const noteMap = {
    C: 1, '1': 1, DO: 1,
    D: 2, '2': 2, RE: 2,
    E: 3, '3': 3, MI: 3,
    F: 4, '4': 4, FA: 4,
    G: 5, '5': 5, SOL: 5,
    A: 6, '6': 6, LA: 6,
    H: 7, B: 7, '7': 7, SI: 7,
    C2: 8, 'C+': 8, '8': 8, D02: 8
  };

  const rawLines = noteText
    .split(/\n|\|/)
    .map((s) => s.trim())
    .filter(Boolean);

  const lyricLines = lyricsText
    .split(/\n|\|/)
    .map((s) => s.trim());

  const lines = [];
  rawLines.forEach((rawLine, idx) => {
    const tokens = rawLine.split(/[\s,;]+/).filter(Boolean);
    const words = (lyricLines[idx] || '').split(/\s+/).filter(Boolean);
    const parsedLine = [];

    tokens.forEach((tok, tIdx) => {
      let clean = tok.toUpperCase();
      let beats = 1;
      if (clean.endsWith('-')) {
        beats = 2;
        clean = clean.slice(0, -1);
      } else if (clean.endsWith('.')) {
        beats = 1.5;
        clean = clean.slice(0, -1);
      }
      const keyNum = noteMap[clean];
      if (keyNum) {
        parsedLine.push([keyNum, beats, words[tIdx] || '']);
      }
    });

    if (parsedLine.length > 0) {
      lines.push(parsedLine);
    }
  });

  return lines;
}

/* ==================== PLAYBACK ENGINE ==================== */

function stopPlayback(resetPosition = true) {
  state.isPlaying = false;
  if (state.playTimer) {
    clearTimeout(state.playTimer);
    state.playTimer = null;
  }
  if (resetPosition) {
    state.activeFlatIndex = -1;
  }
  updatePlaybackUI();
}

function startPlayback() {
  const song = getAllSongs().find((s) => s.id === state.activeSongId);
  if (!song) return;

  soundEngine.unlock();
  const flat = flattenSongNotes(song);
  if (!flat.length) return;

  state.isPlaying = true;
  if (state.activeFlatIndex < 0 || state.activeFlatIndex >= flat.length - 1) {
    state.activeFlatIndex = 0;
  }

  const playCurrentStep = () => {
    if (!state.isPlaying) return;
    const item = flat[state.activeFlatIndex];
    if (!item) {
      stopPlayback(true);
      return;
    }

    const keyMeta = getKeyMeta(item.keyNum);
    const beatSec = 60 / ((song.bpm || 110) * state.prefs.tempoMultiplier);
    const noteSec = item.beats * beatSec;

    soundEngine.playNote(keyMeta.freq, noteSec * 0.88);
    flashPianoKey(item.keyNum, Math.min(noteSec * 820, 600));
    updatePlaybackUI(true);

    state.playTimer = setTimeout(() => {
      if (!state.isPlaying) return;
      if (state.activeFlatIndex < flat.length - 1) {
        state.activeFlatIndex += 1;
        playCurrentStep();
      } else if (state.prefs.loop) {
        state.activeFlatIndex = 0;
        playCurrentStep();
      } else {
        stopPlayback(true);
      }
    }, noteSec * 1000);
  };

  playCurrentStep();
}

function stepForward() {
  const song = getAllSongs().find((s) => s.id === state.activeSongId);
  if (!song) return;
  if (state.isPlaying) {
    stopPlayback(false);
  }
  soundEngine.unlock();
  const flat = flattenSongNotes(song);
  if (!flat.length) return;

  state.activeFlatIndex = (state.activeFlatIndex + 1) % flat.length;
  const item = flat[state.activeFlatIndex];
  const keyMeta = getKeyMeta(item.keyNum);
  soundEngine.playNote(keyMeta.freq, 0.45);
  flashPianoKey(item.keyNum, 320);
  updatePlaybackUI(true);
}

function flashPianoKey(keyNum, ms = 260) {
  const btn = document.querySelector(`.piano-key[data-key="${keyNum}"]`);
  if (!btn) return;
  btn.classList.add('lit');
  setTimeout(() => btn.classList.remove('lit'), ms);
}

function updatePlaybackUI(scrollIntoView = false) {
  const playBtn = document.getElementById('btn-play-toggle');
  if (playBtn) {
    playBtn.classList.toggle('playing', state.isPlaying);
    playBtn.innerHTML = state.isPlaying ? '⏹ Zatrzymaj' : '▶ Odtwórz w tempie';
  }

  const units = document.querySelectorAll('.note-unit');
  let activeLineIdx = -1;
  let nextTargetKey = -1;

  units.forEach((el) => {
    const idx = Number(el.dataset.flatIdx);
    const isCurrent = idx === state.activeFlatIndex;
    const isPlayed = state.activeFlatIndex > -1 && idx < state.activeFlatIndex;
    el.classList.toggle('active-note', isCurrent);
    el.classList.toggle('played-note', isPlayed);
    if (isCurrent) {
      activeLineIdx = Number(el.dataset.lineIdx);
      nextTargetKey = Number(el.dataset.keyNum);
      if (scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  document.querySelectorAll('.phrase-card').forEach((card) => {
    card.classList.toggle('active-phrase', Number(card.dataset.lineIdx) === activeLineIdx);
  });

  document.querySelectorAll('.piano-key').forEach((kEl) => {
    kEl.classList.toggle('target-hint', nextTargetKey > 0 && Number(kEl.dataset.key) === nextTargetKey);
  });
}

/* ==================== RENDERING ==================== */

function renderApp() {
  const root = document.getElementById('app');
  const activeSong = getAllSongs().find((s) => s.id === state.activeSongId);

  root.innerHTML = `
    <header class="topbar">
      <div class="brand" id="brand-home" role="button" tabindex="0">
        <div class="brand-disc"><div class="brand-disc-inner"></div></div>
        <div>
          <div class="brand-title">DJ Stolik Nuty</div>
          <div class="brand-sub">Kolory + Kształty • Fisher-Price</div>
        </div>
      </div>
      <div class="topbar-actions">
        <button class="pill-btn" id="btn-open-calib" title="Dopasuj kolory i kształty klawiszy">
          🎨 Klawisze
        </button>
        <button class="pill-btn" id="btn-open-install" title="Jak dodać na ekran główny iPhone">
          📱 iPhone
        </button>
      </div>
    </header>

    ${activeSong ? renderPlayerView(activeSong) : renderHomeView()}
    ${renderPianoDock()}
    ${renderModal()}
  `;

  attachEvents();
  if (activeSong) {
    updatePlaybackUI(false);
  }
}

function renderHomeView() {
  const songs = getAllSongs();
  const categories = ['Wszystkie', 'Ulubione', 'Dziecięce', 'Tradycyjne', 'Własne'];

  const filtered = songs.filter((s) => {
    if (state.category === 'Ulubione' && !state.favorites.has(s.id)) return false;
    if (state.category === 'Własne' && !s.isCustom) return false;
    if (state.category !== 'Wszystkie' && state.category !== 'Ulubione' && state.category !== 'Własne' && s.category !== state.category) {
      return false;
    }
    if (state.search.trim()) {
      const q = state.search.toLowerCase();
      return s.title.toLowerCase().includes(q) || (s.subtitle || '').toLowerCase().includes(q);
    }
    return true;
  });

  return `
    <main class="home-view">
      <section class="hero-banner">
        <div class="hero-banner-top">
          <div>
            <h2>Wybierz piosenkę i graj po kształtach!</h2>
            <p>Każda nuta pokazuje dokładny <strong>kolor i kształt klawisza</strong> na 8-klawiszowym pianinku DJ Fisher-Price. Dotknij dowolny klawisz poniżej, aby sprawdzić dźwięk.</p>
          </div>
        </div>
        <div class="mini-keys-strip">
          ${state.keys
            .map((k) => {
              const meta = getKeyMeta(k.keyNum);
              return `
                <div class="mini-key-chip" data-preview-key="${k.keyNum}" style="background:${meta.color.hex}; color:${meta.color.text}">
                  ${renderShapeSVG(meta.shape.id)}
                  <span>${k.keyNum}·${k.note}</span>
                </div>
              `;
            })
            .join('')}
        </div>
      </section>

      <section class="toolbar-row">
        <div style="display:flex; gap:8px;">
          <div class="search-box" style="flex:1;">
            <span class="search-icon">🔍</span>
            <input type="search" id="song-search" placeholder="Szukaj polskiej piosenki..." value="${escapeHtml(state.search)}" />
          </div>
          <button class="pill-btn primary" id="btn-open-creator">＋ Własna</button>
        </div>

        <div class="filter-tabs">
          ${categories
            .map(
              (cat) => `
            <button class="filter-tab ${state.category === cat ? 'active' : ''}" data-cat="${cat}">
              ${cat === 'Ulubione' ? '⭐ Ulubione' : cat}
            </button>
          `
            )
            .join('')}
        </div>
      </section>

      <section class="song-list">
        ${
          filtered.length === 0
            ? `<div style="grid-column: 1 / -1; text-align:center; padding: 34px 16px; color: var(--text-muted);">
                Brak utworów spełniających kryteria. Kliknij <strong>＋ Własna</strong>, aby wygenerować nuty z dowolnej melodii!
              </div>`
            : filtered.map((song) => renderSongCard(song)).join('')
        }
      </section>
    </main>
  `;
}

function renderSongCard(song) {
  const flat = flattenSongNotes(song);
  const usedKeys = new Set(flat.map((n) => n.keyNum));
  const previewNotes = flat.slice(0, 7);
  const isFav = state.favorites.has(song.id);

  return `
    <div class="song-card" data-open-song="${song.id}" role="button" tabindex="0">
      <div class="song-emoji">${song.emoji || '🎵'}</div>
      <div class="song-info">
        <h3 class="song-title">${escapeHtml(song.title)}</h3>
        <p class="song-sub">${escapeHtml(song.subtitle || song.category)}</p>
        <div class="song-badges">
          <span class="badge ${song.difficulty === 'Łatwy' ? 'easy' : 'medium'}">${song.difficulty || 'Łatwy'}</span>
          <span class="badge">${usedKeys.size} klaw.</span>
          <div class="song-preview-dots">
            ${previewNotes
              .map((n) => {
                const m = getKeyMeta(n.keyNum);
                return `<span class="preview-dot" style="background:${m.color.hex}"></span>`;
              })
              .join('')}
          </div>
        </div>
      </div>
      <button class="fav-btn ${isFav ? 'active' : ''}" data-fav-song="${song.id}" aria-label="Ulubione">
        ${isFav ? '★' : '☆'}
      </button>
    </div>
  `;
}

function renderPlayerView(song) {
  let flatCounter = 0;
  const tempoPct = Math.round(state.prefs.tempoMultiplier * 100);

  return `
    <main class="player-view">
      <div class="player-header">
        <button class="pill-btn" id="btn-back-list">← Lista utworów</button>
        <div style="display:flex; gap:6px;">
          ${
            song.isCustom
              ? `<button class="pill-btn" id="btn-delete-custom" style="color:#FCA5A5;">🗑 Usuń</button>`
              : ''
          }
          <button class="pill-btn" id="btn-reset-song">↺ Od początku</button>
        </div>
      </div>

      <section class="song-hero">
        <div class="song-hero-top">
          <div class="song-hero-title">
            <span style="font-size:2rem;">${song.emoji || '🎵'}</span>
            <div>
              <h1>${escapeHtml(song.title)}</h1>
              <p>${escapeHtml(song.subtitle || '')}</p>
            </div>
          </div>
        </div>

        <div class="controls-bar">
          <button class="play-btn ${state.isPlaying ? 'playing' : ''}" id="btn-play-toggle">
            ${state.isPlaying ? '⏹ Zatrzymaj' : '▶ Odtwórz w tempie'}
          </button>
          <button class="step-btn" id="btn-step-next">
            👆 Krok po kroku
          </button>
        </div>

        <div class="sub-controls">
          <div class="tempo-group">
            <button class="chip-toggle ${tempoPct === 75 ? 'active' : ''}" data-tempo="0.75">🐢 Wolno</button>
            <button class="chip-toggle ${tempoPct === 100 ? 'active' : ''}" data-tempo="1">100%</button>
            <button class="chip-toggle ${tempoPct === 125 ? 'active' : ''}" data-tempo="1.25">🐇 Szybko</button>
          </div>
          <div class="tempo-group">
            <button class="chip-toggle ${state.prefs.loop ? 'active' : ''}" id="toggle-loop">🔁 Pętla</button>
            <button class="chip-toggle ${state.prefs.showLetters ? 'active' : ''}" id="toggle-letters">🔤 Litery</button>
            <button class="chip-toggle ${state.prefs.largeTiles ? 'active' : ''}" id="toggle-large">🔍 Duże</button>
          </div>
        </div>
      </section>

      <section class="sheet-container">
        ${song.lines
          .map(
            (line, lineIdx) => `
          <div class="phrase-card" data-line-idx="${lineIdx}">
            <div class="phrase-index">Fraza ${lineIdx + 1}</div>
            <div class="notes-flow">
              ${line
                .map((entry) => {
                  const [keyNum, beats, lyric = ''] = entry;
                  const meta = getKeyMeta(keyNum);
                  const idx = flatCounter++;
                  const isLong = beats >= 1.5;
                  const durLabel = beats >= 2 ? '••' : beats >= 1.5 ? '•+' : '';
                  return `
                    <div class="note-unit ${isLong ? 'long-note' : ''} ${state.prefs.largeTiles ? 'large-mode' : ''}"
                         data-flat-idx="${idx}"
                         data-line-idx="${lineIdx}"
                         data-key-num="${keyNum}">
                      <div class="note-tile"
                           style="background:${meta.color.hex}; color:${meta.color.text}; --tile-shadow:${meta.color.darkHex}">
                        ${
                          state.prefs.showLetters
                            ? `<span class="note-key-badge">${keyNum}·${meta.note}</span>`
                            : ''
                        }
                        ${renderShapeSVG(meta.shape.id)}
                        ${durLabel ? `<span class="note-dur-dots">${durLabel}</span>` : ''}
                      </div>
                      <span class="note-lyric">${escapeHtml(lyric || '·')}</span>
                    </div>
                  `;
                })
                .join('')}
            </div>
          </div>
        `
          )
          .join('')}
      </section>
    </main>
  `;
}

function renderPianoDock() {
  const modes = [
    { id: 'piano', label: '🎹 Pianino' },
    { id: 'dj', label: '🎛️ DJ Synth' },
    { id: 'bells', label: '🔔 Dzwonki' },
    { id: 'mute', label: '🔇 Cisza' }
  ];

  return `
    <aside class="piano-dock">
      <div class="piano-dock-inner">
        <div class="piano-dock-top">
          <span>STOLIK DJ-A (8 KLAWISZY)</span>
          <div class="sound-selector">
            ${modes
              .map(
                (m) => `
              <button class="sound-pill ${state.prefs.soundMode === m.id ? 'active' : ''}" data-sound-mode="${m.id}">
                ${m.label}
              </button>
            `
              )
              .join('')}
          </div>
        </div>
        <div class="piano-keys">
          ${state.keys
            .map((k) => {
              const meta = getKeyMeta(k.keyNum);
              return `
                <button class="piano-key" data-key="${k.keyNum}"
                        style="background:${meta.color.hex}; color:${meta.color.text}">
                  <span class="piano-key-num">${k.keyNum}</span>
                  <span class="piano-key-shape">${renderShapeSVG(meta.shape.id)}</span>
                  <span class="piano-key-note">${k.note}</span>
                </button>
              `;
            })
            .join('')}
        </div>
      </div>
    </aside>
  `;
}

function renderModal() {
  if (!state.modal) return '';

  if (state.modal === 'calibrate') {
    const currentKey = getKeyMeta(state.selectedCalibKey);
    return `
      <div class="modal-backdrop" id="modal-backdrop">
        <div class="modal-sheet">
          <div class="modal-header">
            <h2>🎨 Dopasuj klawisze stolika</h2>
            <button class="close-btn" data-close-modal>✕</button>
          </div>
          <p style="font-size:0.82rem; color:var(--text-muted); margin-top:0;">
            Jeśli Twój egzemplarz stolika Fisher-Price ma inny kolor lub kształt na którymś klawiszu, kliknij klawisz poniżej i wybierz symbol. Wszystkie piosenki zaktualizują się automatycznie!
          </p>

          <div class="calib-key-selector">
            ${state.keys
              .map((k) => {
                const m = getKeyMeta(k.keyNum);
                return `
                  <button class="calib-key-btn ${state.selectedCalibKey === k.keyNum ? 'selected' : ''}"
                          data-select-calib-key="${k.keyNum}"
                          style="background:${m.color.hex}; color:${m.color.text}">
                    <span style="font-size:0.7rem; font-weight:900;">${k.keyNum}</span>
                    ${renderShapeSVG(m.shape.id)}
                    <span style="font-size:0.65rem; font-weight:800;">${k.note}</span>
                  </button>
                `;
              })
              .join('')}
          </div>

          <div class="picker-label">Kolor dla klawisza #${currentKey.keyNum} (${currentKey.note}):</div>
          <div class="color-grid">
            ${COLOR_PALETTE.map(
              (c) => `
              <button class="color-swatch ${currentKey.colorId === c.id ? 'selected' : ''}"
                      data-pick-color="${c.id}"
                      style="background:${c.hex}"
                      title="${c.name}"></button>
            `
            ).join('')}
          </div>

          <div class="picker-label">Kształt dla klawisza #${currentKey.keyNum} (${currentKey.note}):</div>
          <div class="shape-grid">
            ${Object.values(SHAPES)
              .map(
                (sh) => `
              <button class="shape-option ${currentKey.shapeId === sh.id ? 'selected' : ''}"
                      data-pick-shape="${sh.id}">
                <span style="color:${currentKey.color.hex}">${renderShapeSVG(sh.id)}</span>
                <span>${sh.name}</span>
              </button>
            `
              )
              .join('')}
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:18px; gap:10px;">
            <button class="pill-btn" id="btn-reset-keys">↺ Przywróć domyślne</button>
            <button class="pill-btn primary" data-close-modal>Gotowe ✓</button>
          </div>
        </div>
      </div>
    `;
  }

  if (state.modal === 'creator') {
    return `
      <div class="modal-backdrop" id="modal-backdrop">
        <div class="modal-sheet">
          <div class="modal-header">
            <h2>✨ Generator własnej piosenki</h2>
            <button class="close-btn" data-close-modal>✕</button>
          </div>
          <p style="font-size:0.82rem; color:var(--text-muted); margin-top:0;">
            Wpisz polskie nuty literowe (<code>C D E F G A H C2</code>) lub klikaj klawisze poniżej. Dodaj myślnik (np. <code>G-</code>) dla długiej nuty, a nową linijkę dla kolejnej frazy.
          </p>

          <div class="form-group">
            <label>Tytuł piosenki</label>
            <input type="text" id="custom-title" placeholder="np. Szła dzieweczka do laseczka" />
          </div>

          <div class="form-group">
            <label>Nuty (klikaj klawisze lub wpisz ręcznie)</label>
            <textarea id="custom-notes" rows="4" placeholder="G E E F D D&#10;C E G-"></textarea>
            <div class="quick-note-pad">
              ${state.keys
                .map((k) => {
                  const m = getKeyMeta(k.keyNum);
                  return `
                    <button type="button" class="quick-note-btn" data-append-note="${k.note}"
                            style="background:${m.color.hex}; color:${m.color.text}">
                      ${renderShapeSVG(m.shape.id)}
                      <span>${k.note}</span>
                    </button>
                  `;
                })
                .join('')}
            </div>
          </div>

          <div class="form-group">
            <label>Słowa / sylaby (opcjonalnie, oddzielone spacjami)</label>
            <textarea id="custom-lyrics" rows="3" placeholder="Wlazł ko- tek na pło- tek&#10;i mru- ga"></textarea>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:14px;">
            <button class="pill-btn" data-close-modal>Anuluj</button>
            <button class="pill-btn primary" id="btn-save-custom">Generuj nuty 🎵</button>
          </div>
        </div>
      </div>
    `;
  }

  if (state.modal === 'install') {
    return `
      <div class="modal-backdrop" id="modal-backdrop">
        <div class="modal-sheet">
          <div class="modal-header">
            <h2>📱 Instalacja na iPhonie</h2>
            <button class="close-btn" data-close-modal>✕</button>
          </div>
          <div class="install-steps">
            <div class="install-step">
              <strong>1. Otwórz w Safari na iPhonie</strong><br/>
              Upewnij się, że iPhone i Mac są w tej samej sieci Wi-Fi i otwórz adres podglądu w przeglądarce <strong>Safari</strong>.
            </div>
            <div class="install-step">
              <strong>2. Dodaj do ekranu głównego</strong><br/>
              Stuknij ikonę <strong>Udostępnij</strong> (kwadrat ze strzałką w górę na dole Safari) i wybierz <strong>„Dodaj do ekranu początkowego”</strong>.
            </div>
            <div class="install-step">
              <strong>3. Wskazówka dotycząca dźwięku iOS</strong><br/>
              Jeśli chcesz grać tylko na fizycznym stoliku Fisher-Price, przełącz dźwięk na <strong>🔇 Cisza</strong> na dolnym pasku. Jeśli chcesz słyszeć podpowiedzi z iPhone'a, wyłącz tryb cichy przełącznikiem z boku telefonu (na iOS 17+ dźwięk zadziała również w trybie cichym).
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end;">
            <button class="pill-btn primary" data-close-modal>Rozumiem!</button>
          </div>
        </div>
      </div>
    `;
  }

  return '';
}

/* ==================== EVENTS ==================== */

function attachEvents() {
  // Powrót na start przez logo
  document.getElementById('brand-home')?.addEventListener('click', () => {
    stopPlayback(true);
    state.activeSongId = null;
    renderApp();
  });

  document.getElementById('btn-open-calib')?.addEventListener('click', () => {
    stopPlayback(false);
    state.modal = 'calibrate';
    renderApp();
  });

  document.getElementById('btn-open-install')?.addEventListener('click', () => {
    state.modal = 'install';
    renderApp();
  });

  document.getElementById('btn-open-creator')?.addEventListener('click', () => {
    state.modal = 'creator';
    renderApp();
  });

  // Mini klawisze na ekranie głównym
  document.querySelectorAll('[data-preview-key]').forEach((el) => {
    el.addEventListener('pointerdown', () => {
      const keyNum = Number(el.dataset.previewKey);
      const meta = getKeyMeta(keyNum);
      soundEngine.playNote(meta.freq, 0.4);
      flashPianoKey(keyNum, 240);
    });
  });

  // Wyszukiwarka
  const searchInput = document.getElementById('song-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.search = e.target.value;
      const pos = e.target.selectionStart;
      renderApp();
      const nextInput = document.getElementById('song-search');
      if (nextInput) {
        nextInput.focus();
        nextInput.setSelectionRange(pos, pos);
      }
    });
  }

  // Kategorie
  document.querySelectorAll('[data-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.category = btn.dataset.cat;
      renderApp();
    });
  });

  // Ulubione
  document.querySelectorAll('[data-fav-song]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.favSong;
      if (state.favorites.has(id)) {
        state.favorites.delete(id);
      } else {
        state.favorites.add(id);
      }
      saveState();
      renderApp();
    });
  });

  // Otwieranie piosenki
  document.querySelectorAll('[data-open-song]').forEach((card) => {
    card.addEventListener('click', () => {
      stopPlayback(true);
      state.activeSongId = card.dataset.openSong;
      window.scrollTo({ top: 0, behavior: 'instant' });
      renderApp();
    });
  });

  // Widok odtwarzacza
  document.getElementById('btn-back-list')?.addEventListener('click', () => {
    stopPlayback(true);
    state.activeSongId = null;
    renderApp();
  });

  document.getElementById('btn-reset-song')?.addEventListener('click', () => {
    stopPlayback(true);
  });

  document.getElementById('btn-delete-custom')?.addEventListener('click', () => {
    stopPlayback(true);
    state.customSongs = state.customSongs.filter((s) => s.id !== state.activeSongId);
    state.activeSongId = null;
    saveState();
    renderApp();
  });

  document.getElementById('btn-play-toggle')?.addEventListener('click', () => {
    if (state.isPlaying) {
      stopPlayback(false);
    } else {
      startPlayback();
    }
  });

  document.getElementById('btn-step-next')?.addEventListener('click', () => {
    stepForward();
  });

  document.querySelectorAll('[data-tempo]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.prefs.tempoMultiplier = Number(btn.dataset.tempo);
      saveState();
      renderApp();
    });
  });

  document.getElementById('toggle-loop')?.addEventListener('click', () => {
    state.prefs.loop = !state.prefs.loop;
    saveState();
    renderApp();
  });

  document.getElementById('toggle-letters')?.addEventListener('click', () => {
    state.prefs.showLetters = !state.prefs.showLetters;
    saveState();
    renderApp();
  });

  document.getElementById('toggle-large')?.addEventListener('click', () => {
    state.prefs.largeTiles = !state.prefs.largeTiles;
    saveState();
    renderApp();
  });

  // Kliknięcie pojedynczej nuty w śpiewniku
  document.querySelectorAll('.note-unit').forEach((unit) => {
    unit.addEventListener('click', () => {
      if (state.isPlaying) stopPlayback(false);
      const flatIdx = Number(unit.dataset.flatIdx);
      const keyNum = Number(unit.dataset.keyNum);
      state.activeFlatIndex = flatIdx;
      const meta = getKeyMeta(keyNum);
      soundEngine.playNote(meta.freq, 0.42);
      flashPianoKey(keyNum, 280);
      updatePlaybackUI(false);
    });
  });

  // Dolne pianinko Fisher-Price
  document.querySelectorAll('.piano-key').forEach((keyEl) => {
    keyEl.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const keyNum = Number(keyEl.dataset.key);
      const meta = getKeyMeta(keyNum);
      soundEngine.playNote(meta.freq, 0.42);
      flashPianoKey(keyNum, 220);

      // Jeśli jesteśmy w piosence (nie gra auto-play) i użytkownik trafił w podświetloną nutę, przesuń dalej!
      if (state.activeSongId && !state.isPlaying && state.activeFlatIndex >= 0) {
        const song = getAllSongs().find((s) => s.id === state.activeSongId);
        if (song) {
          const flat = flattenSongNotes(song);
          const current = flat[state.activeFlatIndex];
          if (current && current.keyNum === keyNum && state.activeFlatIndex < flat.length - 1) {
            state.activeFlatIndex += 1;
            updatePlaybackUI(true);
          }
        }
      }
    });
  });

  // Wybór brzmienia
  document.querySelectorAll('[data-sound-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.soundMode;
      state.prefs.soundMode = mode;
      soundEngine.setMode(mode);
      if (mode !== 'mute') {
        soundEngine.playNote(392.0, 0.25);
      }
      saveState();
      renderApp();
    });
  });

  // Obsługa modali
  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.modal = null;
      renderApp();
    });
  });

  document.getElementById('modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-backdrop') {
      state.modal = null;
      renderApp();
    }
  });

  // Kalibracja klawiszy
  document.querySelectorAll('[data-select-calib-key]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.selectedCalibKey = Number(btn.dataset.selectCalibKey);
      const m = getKeyMeta(state.selectedCalibKey);
      soundEngine.playNote(m.freq, 0.3);
      renderApp();
    });
  });

  document.querySelectorAll('[data-pick-color]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const k = state.keys.find((item) => item.keyNum === state.selectedCalibKey);
      if (k) {
        k.colorId = btn.dataset.pickColor;
        saveState();
        renderApp();
      }
    });
  });

  document.querySelectorAll('[data-pick-shape]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const k = state.keys.find((item) => item.keyNum === state.selectedCalibKey);
      if (k) {
        k.shapeId = btn.dataset.pickShape;
        saveState();
        renderApp();
      }
    });
  });

  document.getElementById('btn-reset-keys')?.addEventListener('click', () => {
    state.keys = structuredClone(DEFAULT_KEYS);
    saveState();
    renderApp();
  });

  // Kreator własnej piosenki
  document.querySelectorAll('[data-append-note]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const note = btn.dataset.appendNote;
      const keyObj = state.keys.find((k) => k.note === note);
      if (keyObj) soundEngine.playNote(keyObj.freq, 0.3);
      const area = document.getElementById('custom-notes');
      if (area) {
        area.value = (area.value ? area.value + ' ' : '') + note;
        area.focus();
      }
    });
  });

  document.getElementById('btn-save-custom')?.addEventListener('click', () => {
    const titleEl = document.getElementById('custom-title');
    const notesEl = document.getElementById('custom-notes');
    const lyricsEl = document.getElementById('custom-lyrics');
    const title = (titleEl?.value || '').trim() || 'Moja melodia';
    const lines = parseNoteTextToLines(notesEl?.value || '', lyricsEl?.value || '');

    if (!lines.length) {
      notesEl?.focus();
      return;
    }

    const newSong = {
      id: 'custom-' + Date.now(),
      title,
      subtitle: 'Własna wygenerowana piosenka',
      emoji: '✨',
      category: 'Własne',
      difficulty: 'Łatwy',
      bpm: 110,
      isCustom: true,
      lines
    };

    state.customSongs.unshift(newSong);
    state.modal = null;
    state.activeSongId = newSong.id;
    saveState();
    renderApp();
  });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

// Start aplikacji + rejestracja Service Workera (offline PWA)
renderApp();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
