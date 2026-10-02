/* Body Sticks — spin, draw a stick, answer, learn.
   Content: data/sticks.json (built from content/*.json, see CONTENT-SPEC.md).
   Progress is stored per device in localStorage. */
(function () {
  'use strict';

  // ---------- constants ----------
  const SYSTEMS = [
    { id: 'cells', name: 'Cells & Genes', color: '#10B981' },
    { id: 'bones', name: 'Bones & Muscles', color: '#64748B' },
    { id: 'heart', name: 'Heart & Blood', color: '#DC2626' },
    { id: 'lungs', name: 'Lungs & Breathing', color: '#3B82F6' },
    { id: 'digestion', name: 'Food & Digestion', color: '#F97316' },
    { id: 'brain', name: 'Brain & Nerves', color: '#DB6B97' },
    { id: 'senses', name: 'Senses & Skin', color: '#8B5CF6' },
    { id: 'hormones', name: 'Hormones & Growing Up', color: '#EAB308' },
    { id: 'cleaning', name: 'Kidneys & Cleaning', color: '#A16207' },
    { id: 'germs', name: 'Germs & Medicine', color: '#0EA5E9' },
  ];
  const SYS = Object.fromEntries(SYSTEMS.map(s => [s.id, s]));
  const MODES = {
    odd: { color: 'green', name: 'Odd One Out', verb: 'Identify', blurb: 'Five things. Four belong together. Find the one that does not.' },
    taboo: { color: 'red', name: "Don't Say It", verb: 'Explain', blurb: 'Describe the word without saying the forbidden words. Playing alone? Guess the word from clues.' },
    case: { color: 'blue', name: "Doctor's Decision", verb: 'Diagnose', blurb: 'Read the patient story and decide what the doctor should do.' },
  };
  const COLOR_TO_MODE = { green: 'odd', red: 'taboo', blue: 'case' };
  const WHEEL = ['green', 'red', 'blue', 'green', 'red', 'blue']; // 60° each, clockwise from top
  const STICKS_TO_WIN = 5;
  const TABOO_SECONDS = 60;
  const LEVELS = { all: [1, 2, 3], easy: [1, 2], hard: [3] };

  // ---------- storage ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };

  // ---------- state ----------
  const S = {
    sticks: [],
    byId: {},
    progress: store.get('bs.progress', {}),   // id -> {s, c, w, last, box}
    clock: store.get('bs.clock', 0),          // draws ever made on this device
    settings: Object.assign({ topic: 'all', level: 'all' }, store.get('bs.settings', {})),
    names: store.get('bs.names', ['', '']),
    rotation: 0,
    round: null,
    t: null,                                  // current turn
    timer: null,
  };

  const $app = document.getElementById('app');
  const $modal = document.getElementById('modal');

  // ---------- helpers ----------
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const saveProgress = () => { store.set('bs.progress', S.progress); store.set('bs.clock', S.clock); };
  const learnedIn = sys => S.sticks.filter(s => s.system === sys && S.progress[s.id]?.c > 0).length;
  const totalIn = sys => S.sticks.filter(s => s.system === sys).length;
  const seenCount = () => S.sticks.filter(s => S.progress[s.id]?.s > 0).length;
  const learnedCount = () => S.sticks.filter(s => S.progress[s.id]?.c > 0).length;
  const titleOf = s => s.mode === 'taboo' ? s.word : s.mode === 'odd' ? `Odd one out: ${s.answer}` : s.answer;
  const isSolo = () => S.round && S.round.players.length === 1;

  function stopTimer() { if (S.timer) { clearInterval(S.timer); S.timer = null; } }

  // ---------- deck: spaced repetition ----------
  // Missed sticks come back after a few draws; unseen sticks come next; sticks
  // answered correctly return after a gap that doubles with each correct answer.
  function drawStick(mode) {
    const levels = LEVELS[S.settings.level] || LEVELS.all;
    const used = S.round.used;
    const inTopic = s => S.settings.topic === 'all' || s.system === S.settings.topic;
    let pool = S.sticks.filter(s => s.mode === mode && inTopic(s) && levels.includes(s.level) && !used.has(s.id));
    if (!pool.length) pool = S.sticks.filter(s => s.mode === mode && inTopic(s) && !used.has(s.id));
    if (!pool.length) pool = S.sticks.filter(s => s.mode === mode && !used.has(s.id));
    if (!pool.length) { used.clear(); pool = S.sticks.filter(s => s.mode === mode); }

    let best = null, bestScore = -1;
    for (const s of pool) {
      const p = S.progress[s.id];
      let score;
      if (!p || !p.s) score = 2;
      else {
        const since = S.clock - p.last;
        if (p.box === 0) score = since >= 6 ? 3 : 0.2;
        else score = Math.min(1, since / (15 * Math.pow(2, p.box)));
      }
      score += Math.random() * 0.6;
      if (score > bestScore) { bestScore = score; best = s; }
    }
    return best;
  }

  function record(stick, correct) {
    const p = S.progress[stick.id] || { s: 0, c: 0, w: 0, last: 0, box: 0 };
    p.s++; p.last = S.clock;
    if (correct) { p.c++; p.box = Math.min(p.box + 1, 5); } else { p.w++; p.box = 0; }
    S.progress[stick.id] = p;
    saveProgress();
  }

  // ---------- screens ----------
  function renderHome() {
    stopTimer();
    S.round = null;
    const total = S.sticks.length, seen = seenCount(), learned = learnedCount();
    const allSeen = total > 0 && seen >= total;
    const topicChips = [{ id: 'all', name: 'Everything' }, ...SYSTEMS].map(t =>
      `<button class="chip" data-topic="${t.id}" aria-pressed="${S.settings.topic === t.id}">${esc(t.name)}</button>`).join('');
    const levelChips = [['all', 'All levels'], ['easy', 'Easier'], ['hard', 'Hard only']].map(([id, name]) =>
      `<button class="chip" data-level="${id}" aria-pressed="${S.settings.level === id}">${name}</button>`).join('');

    $app.innerHTML = `
      <section class="hero">
        <div class="hero-sticks" aria-hidden="true"><span></span><span></span><span></span></div>
        <h1>Think like a doctor</h1>
        <p>Spin the wheel, draw a stick, and learn how your body works.</p>
      </section>

      <div class="play-options">
        <button class="play-card" id="soloBtn" type="button">
          <span class="emoji" aria-hidden="true">🩺</span>
          <h2>Play solo</h2>
          <p>Win ${STICKS_TO_WIN} sticks to finish a round.</p>
        </button>
        <button class="play-card" id="partyBtn" type="button">
          <span class="emoji" aria-hidden="true">👯</span>
          <h2>Play with friends</h2>
          <p>2 to 4 players on one screen. First to ${STICKS_TO_WIN} sticks wins.</p>
        </button>
      </div>

      ${allSeen ? `<div class="panel"><h3>You have seen all ${total} sticks</h3><p class="muted small">The game keeps going and brings back the ones you missed. Ask for the next batch of sticks.</p></div>` : ''}

      <div class="panel">
        <div class="stats">
          <div class="stat"><b>${learned}</b><span>sticks learned</span></div>
          <div class="stat"><b>${seen}</b><span>sticks seen</span></div>
          <div class="stat"><b>${total}</b><span>sticks in the tube</span></div>
        </div>
      </div>

      <div class="panel">
        <h3>Topic</h3>
        <div class="chips">${topicChips}</div>
        <h3 style="margin-top:14px">Difficulty</h3>
        <div class="chips">${levelChips}</div>
      </div>

      <div class="panel">
        <h3>Three kinds of sticks</h3>
        <div class="modes-legend">
          ${Object.values(MODES).map(m => `
            <div class="legend-item"><i style="background:var(--${m.color})"></i>
              <div><b>${m.name}</b><span>${m.blurb}</span></div></div>`).join('')}
        </div>
      </div>`;

    document.getElementById('soloBtn').onclick = () => startRound([{ name: 'You' }]);
    document.getElementById('partyBtn').onclick = renderSetup;
    $app.querySelectorAll('[data-topic]').forEach(b => b.onclick = () => { S.settings.topic = b.dataset.topic; store.set('bs.settings', S.settings); renderHome(); });
    $app.querySelectorAll('[data-level]').forEach(b => b.onclick = () => { S.settings.level = b.dataset.level; store.set('bs.settings', S.settings); renderHome(); });
  }

  function renderSetup() {
    const names = S.names.length >= 2 ? S.names : ['', ''];
    const draw = () => {
      $app.innerHTML = `
        <section class="setup">
          <h2>Who is playing?</h2>
          <p class="muted">Take turns spinning. Anyone can answer. First to ${STICKS_TO_WIN} sticks wins.</p>
          <div id="names">
            ${names.map((n, i) => `
              <div class="name-row">
                <input type="text" maxlength="14" placeholder="Player ${i + 1}" value="${esc(n)}" data-i="${i}" aria-label="Player ${i + 1} name">
                ${names.length > 2 ? `<button type="button" data-rm="${i}" aria-label="Remove player">✕</button>` : ''}
              </div>`).join('')}
          </div>
          <div class="row" style="margin-top:14px">
            ${names.length < 4 ? '<button class="btn secondary" id="addP" type="button">+ Add player</button>' : ''}
            <button class="btn" id="go" type="button">Start game</button>
          </div>
        </section>`;
      $app.querySelectorAll('input').forEach(inp => inp.oninput = () => { names[inp.dataset.i] = inp.value; });
      $app.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { names.splice(+b.dataset.rm, 1); draw(); });
      const add = document.getElementById('addP');
      if (add) add.onclick = () => { names.push(''); draw(); };
      document.getElementById('go').onclick = () => {
        const clean = names.map((n, i) => n.trim() || `Player ${i + 1}`);
        S.names = clean; store.set('bs.names', clean);
        startRound(clean.map(name => ({ name })));
      };
    };
    draw();
  }

  function startRound(players) {
    S.round = {
      players: players.map(p => ({ name: p.name, sticks: [] })),
      turn: 0,
      used: new Set(),
      history: [],
    };
    renderSpin();
  }

  function scoreboard() {
    const r = S.round;
    if (isSolo()) {
      const p = r.players[0];
      return `<div class="scoreboard"><div class="player turn">
        <div class="player-name">Your sticks <small>${p.sticks.length} / ${STICKS_TO_WIN}</small></div>
        <div class="slots">${slots(p)}</div></div></div>`;
    }
    return `<div class="scoreboard">${r.players.map((p, i) => `
      <div class="player ${i === r.turn ? 'turn' : ''}">
        <div class="player-name">${esc(p.name)} <small>${p.sticks.length} / ${STICKS_TO_WIN}</small></div>
        <div class="slots">${slots(p)}</div>
      </div>`).join('')}</div>`;
  }
  const slots = p => Array.from({ length: STICKS_TO_WIN }, (_, i) =>
    `<span class="slot ${p.sticks[i] ? 'filled ' + p.sticks[i].color : ''}"></span>`).join('');

  function wheelSVG() {
    const colors = { green: '#12806F', red: '#D23B3B', blue: '#1E4F91' };
    const seg = (i) => {
      const a0 = (i * 60 - 90) * Math.PI / 180, a1 = ((i + 1) * 60 - 90) * Math.PI / 180;
      const x0 = 100 + 100 * Math.cos(a0), y0 = 100 + 100 * Math.sin(a0);
      const x1 = 100 + 100 * Math.cos(a1), y1 = 100 + 100 * Math.sin(a1);
      return `<path d="M100,100 L${x0.toFixed(2)},${y0.toFixed(2)} A100,100 0 0,1 ${x1.toFixed(2)},${y1.toFixed(2)} Z" fill="${colors[WHEEL[i]]}" stroke="#fff" stroke-width="1.5"/>`;
    };
    const labels = WHEEL.map((c, i) => {
      const a = ((i + 0.5) * 60 - 90) * Math.PI / 180;
      const x = 100 + 62 * Math.cos(a), y = 100 + 62 * Math.sin(a);
      const icon = { green: '🔍', red: '🤫', blue: '🩺' }[c];
      return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="22" text-anchor="middle" dominant-baseline="central" transform="rotate(${(i + 0.5) * 60} ${x.toFixed(1)} ${y.toFixed(1)})">${icon}</text>`;
    }).join('');
    return `<svg class="wheel" id="wheel" viewBox="0 0 200 200" style="transform:rotate(${S.rotation}deg)">${WHEEL.map((_, i) => seg(i)).join('')}${labels}</svg>`;
  }

  function renderSpin() {
    stopTimer();
    const r = S.round;
    const who = isSolo() ? 'Your turn' : `${esc(r.players[r.turn].name)}, spin the wheel`;
    $app.innerHTML = `
      ${scoreboard()}
      <section class="spin-area">
        <h2>${who}</h2>
        <div class="wheel-wrap"><div class="pointer"></div>${wheelSVG()}<div class="hub"></div></div>
        <button class="btn big" id="spinBtn" type="button">Spin</button>
        <p class="muted small center">🔍 Odd One Out &nbsp; 🤫 Don't Say It &nbsp; 🩺 Doctor's Decision</p>
      </section>`;
    const btn = document.getElementById('spinBtn');
    btn.onclick = () => { btn.disabled = true; spin(); };
  }

  function spin() {
    const color = pick(['green', 'red', 'blue']);
    const segs = WHEEL.map((c, i) => c === color ? i : -1).filter(i => i >= 0);
    const k = pick(segs);
    const a = k * 60 + 8 + Math.random() * 44;         // landing angle on the wheel
    const want = (360 - a) % 360;                      // rotation that puts angle a under the pointer
    const cur = ((S.rotation % 360) + 360) % 360;
    S.rotation += 360 * 4 + ((want - cur + 360) % 360);
    const wheel = document.getElementById('wheel');
    wheel.style.transform = `rotate(${S.rotation}deg)`;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => beginTurn(COLOR_TO_MODE[color]), reduce ? 400 : 1950);
  }

  function beginTurn(mode) {
    beginTurnWith(drawStick(mode));
  }

  function beginTurnWith(stick) {
    S.round.used.add(stick.id);
    S.clock++;
    const t = { stick, phase: 'question', locked: new Set(), answering: null, wrong: new Set(), clues: 1 };
    if (stick.mode === 'odd') t.choices = shuffle(stick.items.map((x, i) => ({ text: x, note: stick.notes[i] })));
    if (stick.mode === 'case') t.choices = shuffle(stick.options.map((x, i) => ({ text: x, note: stick.optionNotes[i] })));
    if (stick.mode === 'taboo') {
      t.choices = shuffle([stick.word, ...stick.decoys].map(x => ({ text: x })));
      if (!isSolo()) t.phase = 'cover';
    }
    S.t = t;
    renderStick();
  }

  function stickHead(stick) {
    const m = MODES[stick.mode];
    const lvl = ['', 'Easy', 'Medium', 'Hard'][stick.level];
    const done = S.progress[stick.id]?.c > 0 ? '<span class="done-tag">Done before ✓</span>' : '';
    return `<div class="stick-meta"><span>${m.name}</span><span>${esc(SYS[stick.system].name)}</span><span>${lvl}</span>${done}</div>`;
  }

  function renderStick() {
    const { stick } = S.t;
    if (stick.mode === 'taboo' && !isSolo()) return renderTabooParty();
    const m = MODES[stick.mode];
    const t = S.t;
    let q = '';
    if (stick.mode === 'odd') q = `<p class="stick-q">Which one does not belong?</p>`;
    if (stick.mode === 'case') q = `<p class="stick-meta"><span>You are the ${esc(stick.role)}</span></p><p class="stick-q">${esc(stick.scenario)}</p>`;
    if (stick.mode === 'taboo') {
      q = `<p class="stick-q">What am I? Read the clues and pick the answer.</p>
        <div class="cluebox">${stick.clues.slice(0, t.clues).map((c, i) => `<div class="clue"><b>Clue ${i + 1}</b>${esc(c)}</div>`).join('')}</div>`;
    }
    const party = !isSolo();
    const optsLive = t.phase === 'question' && (!party || t.answering !== null);
    const options = t.choices.map((c, i) => {
      const cls = t.phase === 'reveal'
        ? (c.text === answerOf(stick) ? 'right' : t.wrong.has(c.text) ? 'wrong' : '')
        : t.wrong.has(c.text) ? 'wrong' : '';
      const dis = !optsLive || t.wrong.has(c.text);
      return `<button class="opt ${cls}" data-i="${i}" ${dis ? 'disabled' : ''} type="button"><span class="num">${i + 1}</span><span class="opt-text">${esc(c.text)}</span></button>`;
    }).join('');

    let below = '';
    if (t.phase === 'question' && !party) {
      const more = stick.mode === 'taboo' && t.clues < stick.clues.length
        ? '<button class="btn secondary" id="moreClue" type="button">Show another clue</button>' : '';
      below = `<div class="action-row">${more}<button class="btn secondary" data-skip type="button">Skip this stick</button></div>`;
    }
    if (t.phase === 'question' && party) {
      const r = S.round;
      if (t.answering === null) {
        below = `<div class="buzz"><h3>Know it? Tap your name, then pick your answer.</h3>
          <div class="buzz-row">${r.players.map((p, i) => t.locked.has(i) ? '' :
            `<button class="btn" data-buzz="${i}" type="button">${esc(p.name)}</button>`).join('')}</div>
          <div class="action-row"><button class="btn secondary" id="nobody" type="button">Nobody knows — show the answer</button><button class="btn secondary" data-skip type="button">Skip this stick</button></div></div>`;
      } else {
        below = `<div class="buzz"><h3>${esc(r.players[t.answering].name)}, pick your answer.</h3></div>`;
      }
    }

    $app.innerHTML = `
      ${scoreboard()}
      <article class="stick ${m.color}">
        <div class="stick-body">${stickHead(stick)}${q}<div class="options">${options}</div></div>
        <div class="stick-tag">${m.name}</div>
      </article>
      ${below}
      ${t.phase === 'reveal' ? revealHTML() : ''}`;

    $app.querySelectorAll('.opt').forEach(b => b.onclick = () => choose(t.choices[+b.dataset.i].text));
    $app.querySelectorAll('[data-buzz]').forEach(b => b.onclick = () => { t.answering = +b.dataset.buzz; renderStick(); });
    const more = document.getElementById('moreClue');
    if (more) more.onclick = () => { t.clues++; renderStick(); };
    const nobody = document.getElementById('nobody');
    if (nobody) nobody.onclick = () => resolve(null);
    bindSkip();
    bindReveal();
  }

  // Skip draws another stick of the same colour. Not counted as right or wrong;
  // the skipped stick is pushed back so it does not come up again straight away.
  function bindSkip() {
    $app.querySelectorAll('[data-skip]').forEach(b => b.onclick = skipStick);
  }
  function skipStick() {
    const t = S.t;
    if (!t || t.phase === 'reveal') return;
    stopTimer();
    const p = S.progress[t.stick.id];
    if (p) { p.last = S.clock; saveProgress(); }
    beginTurnWith(drawStick(t.stick.mode));
  }

  const answerOf = s => s.mode === 'taboo' ? s.word : s.answer;

  function choose(text) {
    const t = S.t;
    if (t.phase !== 'question') return;
    const right = text === answerOf(t.stick);
    if (isSolo()) return resolve(right ? 0 : null, right ? null : text);
    if (right) return resolve(t.answering);
    t.wrong.add(text);
    t.locked.add(t.answering);
    t.answering = null;
    const left = S.round.players.length - t.locked.size;
    const optionsLeft = t.choices.length - t.wrong.size;
    if (left === 0 || optionsLeft <= 1) return resolve(null);
    renderStick();
  }

  function renderTabooParty() {
    const t = S.t, stick = t.stick, r = S.round;
    const describer = r.players[r.turn];
    if (t.phase === 'cover') {
      $app.innerHTML = `${scoreboard()}
        <div class="cover">
          <div style="font-size:3rem" aria-hidden="true">🤫</div>
          <h2>Don't Say It</h2>
          <p class="muted">${esc(describer.name)} describes. Everyone else, look away from the screen!</p>
          <div class="action-row"><button class="btn big" id="ready" type="button">${esc(describer.name)} is ready</button></div>
          <div class="action-row"><button class="btn secondary" data-skip type="button">Skip this stick</button></div>
        </div>`;
      bindSkip();
      document.getElementById('ready').onclick = () => { t.phase = 'describe'; t.left = TABOO_SECONDS; renderTabooParty(); startTabooTimer(); };
      return;
    }
    if (t.phase === 'describe') {
      const guessers = r.players.map((p, i) => i === r.turn ? '' :
        `<button class="btn" data-g="${i}" type="button">${esc(p.name)} got it</button>`).join('');
      $app.innerHTML = `${scoreboard()}
        <article class="stick red">
          <div class="stick-body">
            ${stickHead(stick)}
            <div class="stick-word">${esc(stick.word)}</div>
            <p class="dont">Don't use these words</p>
            <div class="forbidden">${stick.forbidden.map(f => `<span>${esc(f)}</span>`).join('')}</div>
            <div class="cluebox"><b>Need ideas?</b> ${stick.clues.map(esc).join(' ')}</div>
          </div>
          <div class="stick-tag">Don't Say It</div>
        </article>
        <div class="timer" id="timer">${t.left}s</div>
        <div class="buzz"><h3>Who guessed it first?</h3><div class="buzz-row">${guessers}</div>
          <div class="action-row"><button class="btn secondary" id="skip" type="button">Nobody got it</button><button class="btn secondary" data-skip type="button">Skip this stick</button></div></div>`;
      bindSkip();
      $app.querySelectorAll('[data-g]').forEach(b => b.onclick = () => { stopTimer(); resolve(+b.dataset.g); });
      document.getElementById('skip').onclick = () => { stopTimer(); resolve(null); };
      return;
    }
    // reveal
    $app.innerHTML = `${scoreboard()}
      <article class="stick red">
        <div class="stick-body">${stickHead(stick)}
          <div class="stick-word">${esc(stick.word)}</div>
          <div class="forbidden">${stick.forbidden.map(f => `<span>${esc(f)}</span>`).join('')}</div>
        </div>
        <div class="stick-tag">Don't Say It</div>
      </article>
      ${revealHTML()}`;
    bindReveal();
  }

  function startTabooTimer() {
    stopTimer();
    S.timer = setInterval(() => {
      const t = S.t;
      t.left--;
      const el = document.getElementById('timer');
      if (el) { el.textContent = `${t.left}s`; el.classList.toggle('low', t.left <= 10); }
      if (t.left <= 0) { stopTimer(); resolve(null); }
    }, 1000);
  }

  function resolve(winner, wrongPick) {
    const t = S.t, r = S.round;
    if (t.phase === 'reveal') return;
    if (wrongPick) t.wrong.add(wrongPick);
    t.phase = 'reveal';
    t.winner = winner;
    if (t.stick.mode === 'taboo') t.clues = t.stick.clues.length;
    record(t.stick, winner !== null);
    if (winner !== null) r.players[winner].sticks.push({ id: t.stick.id, color: MODES[t.stick.mode].color });
    r.history.push({ id: t.stick.id, winner });
    renderStick();
    const rev = document.querySelector('.reveal');
    if (rev) rev.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function revealHTML() {
    const t = S.t, s = t.stick, r = S.round;
    let verdict;
    if (t.winner !== null) {
      verdict = `<div class="verdict good">✓ ${isSolo() ? 'Correct! You win the stick.' : `${esc(r.players[t.winner].name)} wins the stick!`}</div>`;
    } else {
      verdict = `<div class="verdict bad">${isSolo() ? 'Not this time. The stick goes back in the tube.' : 'Nobody wins this one. Back in the tube.'}</div>`;
    }
    let detail = '';
    if (s.mode === 'odd') {
      detail = `<p class="answer-line">The odd one out is <b>${esc(s.answer)}</b>. ${esc(s.reason)}</p>
        <ul class="notes">${s.items.map((x, i) => `<li class="${x === s.answer ? 'is-answer' : ''}"><b>${esc(x)}</b><span>${esc(s.notes[i])}</span></li>`).join('')}</ul>`;
    } else if (s.mode === 'case') {
      detail = `<p class="answer-line">Best answer: <b>${esc(s.answer)}</b></p>
        <ul class="notes">${s.options.map((x, i) => `<li class="${x === s.answer ? 'is-answer' : ''}"><b>${esc(x)}</b><span>${esc(s.optionNotes[i])}</span></li>`).join('')}</ul>`;
    } else {
      detail = `<p class="answer-line">The word was <b>${esc(s.word)}</b>.</p>
        ${isSolo() ? '' : `<ul class="notes"><li><b>Clues</b><span>${s.clues.map(esc).join(' ')}</span></li></ul>`}`;
    }
    const last = r.players.some(p => p.sticks.length >= STICKS_TO_WIN);
    return `<section class="reveal">
      ${verdict}${detail}
      <div class="learn"><h4>Learn it</h4><p>${esc(s.explain)}</p></div>
      ${s.fact ? `<p class="fact"><b>Did you know?</b> ${esc(s.fact)}</p>` : ''}
      <div class="action-row"><button class="btn big" id="nextBtn" type="button">${last ? 'See who won' : 'Next spin'}</button></div>
    </section>`;
  }

  function bindReveal() {
    const next = document.getElementById('nextBtn');
    if (!next) return;
    next.onclick = () => {
      const r = S.round;
      const champ = r.players.findIndex(p => p.sticks.length >= STICKS_TO_WIN);
      if (champ >= 0) return renderRoundEnd(champ);
      if (!isSolo()) r.turn = (r.turn + 1) % r.players.length;
      renderSpin();
    };
  }

  function renderRoundEnd(champ) {
    const r = S.round;
    const p = r.players[champ];
    const tries = r.history.length;
    const learnedNow = r.history.filter(h => h.winner !== null).map(h => S.byId[h.id]);
    const missed = r.history.filter(h => h.winner === null).map(h => S.byId[h.id]);
    $app.innerHTML = `
      <section class="winner">
        <div class="trophy" aria-hidden="true">🏆</div>
        <h2>${isSolo() ? 'Round complete!' : `${esc(p.name)} is the Future Doctor!`}</h2>
        <p class="muted">${isSolo() ? `You won ${STICKS_TO_WIN} sticks in ${tries} tries.` : `${tries} sticks played this round.`}</p>
      </section>
      <div class="panel"><h3>Sticks won this round</h3>
        <ul class="round-list">${learnedNow.map(s => `<li><i style="background:var(--${MODES[s.mode].color})"></i><span><b>${esc(titleOf(s))}</b> · ${esc(SYS[s.system].name)}</span></li>`).join('')}</ul>
      </div>
      ${missed.length ? `<div class="panel"><h3>Coming back later (missed)</h3>
        <ul class="round-list">${missed.map(s => `<li><i style="background:var(--${MODES[s.mode].color})"></i><span><b>${esc(titleOf(s))}</b> · ${esc(SYS[s.system].name)}</span></li>`).join('')}</ul></div>` : ''}
      <div class="action-row">
        <button class="btn big" id="again" type="button">Play again</button>
        <button class="btn big secondary" id="map2" type="button">See my body map</button>
        <button class="btn big secondary" id="home2" type="button">Home</button>
      </div>`;
    confetti();
    const players = r.players.map(x => ({ name: x.name }));
    document.getElementById('again').onclick = () => startRound(players);
    document.getElementById('map2').onclick = openMap;
    document.getElementById('home2').onclick = renderHome;
  }

  function confetti() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const colors = ['#12806F', '#D23B3B', '#1E4F91', '#E9A21B'];
    for (let i = 0; i < 70; i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = pick(colors);
      c.style.animationDuration = 1.8 + Math.random() * 1.8 + 's';
      c.style.animationDelay = Math.random() * 0.5 + 's';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 4500);
    }
  }

  // ---------- body map ----------
  function bodySVG() {
    const op = id => { const tot = totalIn(id); return (0.12 + 0.88 * (tot ? learnedIn(id) / tot : 0)).toFixed(2); };
    const g = (id, inner) => `<g class="organ" data-sys="${id}" style="opacity:${op(id)}"><title>${SYS[id].name}</title>${inner}</g>`;
    return `<svg class="body-svg" viewBox="0 0 200 400" role="img" aria-label="Body map showing what you have learned">
      <g fill="#F1D3B8" stroke="#D9B392" stroke-width="2">
        <rect x="30" y="100" width="22" height="135" rx="11"/><rect x="148" y="100" width="22" height="135" rx="11"/>
        <rect x="62" y="225" width="34" height="160" rx="15"/><rect x="104" y="225" width="34" height="160" rx="15"/>
        <path d="M58 95 Q100 82 142 95 L150 120 Q146 190 140 245 L60 245 Q54 190 50 120 Z"/>
        <rect x="90" y="78" width="20" height="20" rx="6"/>
        <circle cx="100" cy="48" r="34"/>
      </g>
      ${g('bones', `<g stroke="#64748B" stroke-width="5" stroke-linecap="round"><line x1="41" y1="110" x2="41" y2="225"/><line x1="159" y1="110" x2="159" y2="225"/><line x1="79" y1="240" x2="79" y2="375"/><line x1="121" y1="240" x2="121" y2="375"/><path d="M70 120 Q100 112 130 120 M70 130 Q100 122 130 130 M72 140 Q100 132 128 140" fill="none" stroke-width="3"/></g>`)}
      ${g('brain', `<ellipse cx="100" cy="38" rx="25" ry="17" fill="#DB6B97"/><path d="M100 22 V54 M88 30 q6 6 0 12 M112 30 q-6 6 0 12" stroke="#B04A74" stroke-width="2" fill="none"/>`)}
      ${g('senses', `<circle cx="88" cy="58" r="4.5" fill="#8B5CF6"/><circle cx="112" cy="58" r="4.5" fill="#8B5CF6"/><ellipse cx="65" cy="52" rx="5" ry="10" fill="#8B5CF6"/><ellipse cx="135" cy="52" rx="5" ry="10" fill="#8B5CF6"/><path d="M96 70 q4 3 8 0" stroke="#8B5CF6" stroke-width="3" fill="none" stroke-linecap="round"/>`)}
      ${g('hormones', `<ellipse cx="94" cy="90" rx="6" ry="4" fill="#EAB308"/><ellipse cx="106" cy="90" rx="6" ry="4" fill="#EAB308"/><ellipse cx="100" cy="196" rx="14" ry="4" fill="#EAB308"/>`)}
      ${g('lungs', `<ellipse cx="80" cy="140" rx="17" ry="30" fill="#3B82F6"/><ellipse cx="120" cy="140" rx="17" ry="30" fill="#3B82F6"/><path d="M100 104 V122" stroke="#3B82F6" stroke-width="5"/>`)}
      ${g('heart', `<path d="M104 136 c-6-10-20-6-18 4 c2 8 18 18 18 18 s16-10 18-18 c2-10-12-14-18-4z" fill="#DC2626"/>`)}
      ${g('digestion', `<ellipse cx="114" cy="182" rx="15" ry="10" fill="#F97316" transform="rotate(-20 114 182)"/><rect x="74" y="203" width="52" height="32" rx="14" fill="#F97316"/><path d="M80 214 h40 M80 224 h40" stroke="#C2570C" stroke-width="2"/>`)}
      ${g('cleaning', `<ellipse cx="70" cy="196" rx="7" ry="11" fill="#A16207"/><ellipse cx="130" cy="196" rx="7" ry="11" fill="#A16207"/><ellipse cx="100" cy="243" rx="10" ry="7" fill="#A16207"/>`)}
      ${g('cells', `<circle cx="174" cy="300" r="20" fill="#10B981"/><circle cx="178" cy="296" r="7" fill="#065F46"/><circle cx="166" cy="308" r="2.5" fill="#065F46"/>`)}
      ${g('germs', `<path d="M26 280 l18 7 v14 c0 12-8 19-18 24 c-10-5-18-12-18-24 v-14 z" fill="#0EA5E9"/><path d="M26 293 v18 M17 302 h18" stroke="#fff" stroke-width="4"/>`)}
    </svg>`;
  }

  function openMap() {
    const rows = SYSTEMS.map(s => {
      const l = learnedIn(s.id), tot = totalIn(s.id);
      const pct = tot ? Math.round(100 * l / tot) : 0;
      const badge = pct >= 100 ? 'Expert' : pct >= 60 ? 'Gold' : pct >= 30 ? 'Silver' : pct >= 10 ? 'Bronze' : '';
      return `<button class="sys" data-sys="${s.id}" type="button">
        <b>${esc(s.name)}</b>${badge ? `<span class="badge">${badge}</span>` : '<span></span>'}
        <small>${l} of ${tot} learned</small><span></span>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${s.color}"></div></div>
      </button>`;
    }).join('');
    showModal(`
      <div class="sheet-head"><h2>My body map</h2><button class="ghost" data-close type="button">Close</button></div>
      <p class="muted small" style="margin-bottom:12px">Each part fills in as you learn sticks about it. Tap a part to read your doctor's notebook.</p>
      <div class="map-grid">${bodySVG()}<div class="sys-list">${rows}</div></div>`);
    $modal.querySelectorAll('[data-sys]').forEach(el => el.addEventListener('click', () => openNotebook(el.dataset.sys)));
  }

  function openNotebook(sys) {
    const learned = S.sticks.filter(s => s.system === sys && S.progress[s.id]?.c > 0);
    showModal(`
      <div class="sheet-head"><h2>${esc(SYS[sys].name)}</h2><button class="ghost" id="backMap" type="button">Back</button></div>
      <p class="muted small">${learned.length} of ${totalIn(sys)} sticks learned.</p>
      ${learned.length ? `<ul class="notebook">${learned.map(s => `<li><b>${esc(titleOf(s))}</b>${esc(s.explain)}</li>`).join('')}</ul>`
        : '<p style="margin-top:14px">Nothing here yet. Win sticks about this part of the body to fill your notebook.</p>'}`);
    document.getElementById('backMap').onclick = openMap;
  }

  function showModal(html) {
    $modal.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">${html}</div>`;
    $modal.hidden = false;
    $modal.querySelectorAll('[data-close]').forEach(b => b.onclick = closeModal);
  }
  function closeModal() { $modal.hidden = true; $modal.innerHTML = ''; }
  $modal.addEventListener('click', e => { if (e.target === $modal) closeModal(); });

  // ---------- keyboard: 1–5 picks an option ----------
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !$modal.hidden) return closeModal();
    const n = parseInt(e.key, 10);
    if (!n || !S.t || S.t.phase !== 'question') return;
    const btn = $app.querySelector(`.opt[data-i="${n - 1}"]:not(:disabled)`);
    if (btn) btn.click();
  });

  // ---------- boot ----------
  document.getElementById('homeBtn').onclick = () => {
    if (S.round && !confirm('Leave this game and go home?')) return;
    renderHome();
  };
  document.getElementById('mapBtn').onclick = openMap;

  fetch('data/sticks.json')
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(data => {
      S.sticks = data;
      S.byId = Object.fromEntries(data.map(s => [s.id, s]));
      renderHome();
      // Layout testing only: ?debug exposes a hook to open any stick directly.
      if (new URLSearchParams(location.search).has('debug')) {
        window.__bs = {
          show(id, players = 1, phase) {
            startRound(Array.from({ length: players }, (_, i) => ({ name: `Player ${i + 1}` })));
            const stick = S.byId[id];
            beginTurnWith(stick);
            if (phase === 'reveal') resolve(null, null);
            if (phase === 'describe') { S.t.phase = 'describe'; S.t.left = TABOO_SECONDS; renderStick(); }
          },
        };
      }
    })
    .catch(() => { $app.innerHTML = '<div class="panel">Could not load the sticks. Check your connection and refresh.</div>'; });
})();
