// Routing and page rendering. Routes: #/ (home), #/basics, #/game/<id>.

const TYPES = {
  strategy: { label: 'Classic & strategy', note: 'Turn-based games where planning ahead wins.' },
  speed: { label: 'Fast & loud', note: 'Quick reactions, everyone playing at once.' },
  math: { label: 'Maths games', note: 'Number cards turned into sums, times tables and puzzles.' },
};
const TYPE_ORDER = ['strategy', 'speed', 'math'];
const LEVELS = ['', 'Easy', 'Medium', 'Challenging'];

const filters = { players: 'any', type: 'any', decks: 'any', extras: 'any' };
const app = document.getElementById('app');

function playersText(g) {
  const sorted = [...g.players].sort();
  const base = sorted.length === 1 ? (sorted[0] === 3 ? '3+' : `${sorted[0]}`) : `${sorted[0]}–${sorted[sorted.length - 1]}`;
  const best = sorted.length > 1 && g.players[0] !== sorted[0] ? ` (best with ${g.players[0]})` : '';
  return base + best;
}

function matches(g) {
  if (filters.players !== 'any' && !g.players.includes(+filters.players)) return false;
  if (filters.type !== 'any' && !g.tags.includes(filters.type)) return false;
  if (filters.decks !== 'any' && g.decks !== +filters.decks) return false;
  if (filters.extras === 'none' && g.needs.some(n => !n.includes('optional'))) return false;
  if (filters.extras === 'timer' && !g.needs.some(n => n.startsWith('timer'))) return false;
  if (filters.extras === 'clock' && !g.needs.some(n => n.includes('chess clock')) && !g.variants.some(v => v.name === 'On the clock')) return false;
  return true;
}

function tile(g) {
  return `<a class="tile ${g.type}" href="#/game/${g.id}">
    ${fan(g.icon)}
    <h3>${g.name}</h3>
    <p>${g.blurb}</p>
    <div class="facts">
      <span>${playersText(g)} players</span>
      <span>${g.decks} deck${g.decks > 1 ? 's' : ''}</span>
      <span>${g.time}</span>
      <span>${LEVELS[g.level]}</span>
    </div>
  </a>`;
}

function chipRow(key, label, options) {
  return `<div class="frow-f"><span>${label}</span>${options.map(([value, text]) =>
    `<button class="chip" data-key="${key}" data-value="${value}" aria-pressed="${filters[key] === value}">${text}</button>`).join('')}</div>`;
}

function renderList() {
  const shown = GAMES.filter(matches);
  const filtered = Object.values(filters).some(v => v !== 'any');
  const groups = TYPE_ORDER.map(type => {
    const list = shown.filter(g => g.type === type);
    if (!list.length) return '';
    return `<section class="group">
      <h2><span class="dot ${type}"></span>${TYPES[type].label}</h2>
      <p>${TYPES[type].note}</p>
      <div class="grid">${list.map(tile).join('')}</div>
    </section>`;
  }).join('');
  document.getElementById('list').innerHTML = shown.length
    ? groups
    : `<p class="empty">No game fits all of those. Try removing a filter.</p>`;
  document.getElementById('count').textContent = filtered ? `${shown.length} of ${GAMES.length} games` : `${GAMES.length} games`;
  document.querySelectorAll('.chip').forEach(b => b.setAttribute('aria-pressed', filters[b.dataset.key] === b.dataset.value));
}

function renderHome() {
  document.title = 'Card Table';
  app.innerHTML = `
    <div class="hero">
      <h1>Card games for the kitchen table</h1>
      <p>${GAMES.length} games for two or three players with one or two ordinary decks. Every game has step-by-step rules, pictures of the table, and ideas for keeping it fair between an adult and a child.</p>
    </div>
    <div class="callout">
      <h2>New to card games?</h2>
      Read <a href="#/basics">Before you start</a> (5 minutes): card values, shuffling, the words used in the rules, and which games to try first.
      Good first three: <a href="#/game/crazy-eights">Crazy Eights</a>, <a href="#/game/speed">Speed</a> and <a href="#/game/math-war">Maths War</a>.
    </div>
    <div class="filters">
      ${chipRow('players', 'Players', [['any', 'Any'], ['2', '2 players'], ['3', '3 players']])}
      ${chipRow('type', 'Kind', [['any', 'All'], ['strategy', 'Classic & strategy'], ['speed', 'Fast & loud'], ['math', 'Maths']])}
      ${chipRow('decks', 'Decks', [['any', 'Any'], ['1', '1 deck'], ['2', '2 decks']])}
      ${chipRow('extras', 'Extras', [['any', 'Any'], ['none', 'Just cards'], ['timer', 'Uses a timer'], ['clock', 'Uses the chess clock']])}
      <div class="frow-f"><button class="btn" id="pick">Pick a game for us</button><small id="count" class="count"></small></div>
    </div>
    <div id="list"></div>`;
  app.querySelectorAll('.chip').forEach(b => b.addEventListener('click', () => {
    filters[b.dataset.key] = b.dataset.value;
    renderList();
  }));
  document.getElementById('pick').addEventListener('click', () => {
    const shown = GAMES.filter(matches);
    if (!shown.length) return;
    location.hash = `#/game/${shown[Math.floor(Math.random() * shown.length)].id}`;
  });
  renderList();
}

function renderSection(s) {
  return `<section class="sec">
    <h2>${s.title}</h2>
    ${s.text ? `<p>${s.text}</p>` : ''}
    ${s.steps ? `<ol class="steps">${s.steps.map(x => `<li>${x}</li>`).join('')}</ol>` : ''}
    ${s.bullets ? `<ul>${s.bullets.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}
    ${s.html || ''}
  </section>`;
}

function renderGame(g) {
  document.title = `${g.name} · Card Table`;
  const i = GAMES.indexOf(g);
  const prev = GAMES[(i - 1 + GAMES.length) % GAMES.length];
  const next = GAMES[(i + 1) % GAMES.length];
  const needs = g.needs.length ? g.needs.join(', ') : 'Nothing else';
  app.innerHTML = `
    <a class="back" href="#/">← All games</a>
    <header class="ghead">
      <span class="type-chip ${g.type}">${TYPES[g.type].label}</span>
      <h1>${g.name}</h1>
      <p class="blurb">${g.blurb}</p>
      <p class="learn"><b>Practises:</b> ${g.learn}</p>
    </header>
    <div class="meta">
      <div><small>Players</small><b>${playersText(g)}</b></div>
      <div><small>Cards</small><b>${g.decks} deck${g.decks > 1 ? 's' : ''}</b></div>
      <div><small>Time</small><b>${g.time}</b></div>
      <div><small>Level</small><b>${LEVELS[g.level]}</b></div>
      <div><small>Also need</small><b>${needs}</b></div>
    </div>
    <div class="goal"><small>Goal</small><b>${g.goal}</b></div>
    <div class="remind"><h2>On your turn</h2><ol>${g.remind.map(r => `<li>${r}</li>`).join('')}</ol></div>
    ${g.sections.map(renderSection).join('')}
    <section class="sec">
      <h2>Keeping it fair (adult vs child)</h2>
      <p>Pick one of these when the adult keeps winning. Drop it once the child starts winning without it.</p>
      <ul>${g.fair.map(f => `<li>${f}</li>`).join('')}</ul>
    </section>
    ${g.three ? `<section class="sec"><h2>Three players</h2><p>${g.three}</p></section>` : ''}
    ${g.variants.length ? `<section class="sec"><h2>Try next</h2><div class="variants">${g.variants.map(v =>
      `<div class="box"><h3>${v.name}</h3>${v.text}</div>`).join('')}</div></section>` : ''}
    <div class="actions">
      <button class="btn ghost" onclick="window.print()">Print these rules</button>
    </div>
    <nav class="pager">
      <a href="#/game/${prev.id}">← ${prev.name}</a>
      <a href="#/game/${next.id}">${next.name} →</a>
    </nav>`;
}

function renderBasics() {
  document.title = 'Before you start · Card Table';
  const suits = ['s', 'h', 'd', 'c'];
  app.innerHTML = `
    <a class="back" href="#/">← All games</a>
    <header class="ghead">
      <h1>Before you start</h1>
      <p class="blurb">Everything the rules assume you know, in one page.</p>
    </header>

    <section class="sec">
      <h2>The deck</h2>
      <p>A deck has 52 cards: four suits of 13 cards each. Take the jokers out; no game here uses them.</p>
      ${fig(row(...suits.map(s => lab(c('A' + s), { s: 'Spades', h: 'Hearts', d: 'Diamonds', c: 'Clubs' }[s]))),
        `Hearts and diamonds are red. Spades and clubs are black.`, 'Four suits')}
      ${fig(`<div style="overflow-x:auto">${cards('Ac 2c 3c 4c 5c 6c 7c 8c 9c 10c Jc Qc Kc', 'fan')}</div>`,
        `Each suit runs Ace, 2 to 10, Jack, Queen, King. Jack, Queen and King are the <b>face cards</b>. Whether the Ace counts high (above the King) or low (as 1) depends on the game; each set of rules says which.`, 'Thirteen ranks')}
    </section>

    <section class="sec">
      <h2>Card values in the maths games</h2>
      ${table(['Card', 'Usual value', 'Notes'], [
        ['Ace', '1', ''],
        ['2 to 10', 'the number on the card', 'In Number Builder and Target, a 10 is used as the digit 0.'],
        ['Jack, Queen, King', 'taken out', 'For harder games, put them back as 11, 12, 13.'],
      ])}
      <p>Taking out the face cards leaves 40 cards. Keep them in a separate pile or envelope so they are easy to add back.</p>
    </section>

    <section class="sec">
      <h2>Shuffling and dealing</h2>
      <ul>
        <li><b>Wash</b>: spread all the cards face down on the table and swirl them around with both hands, then gather them up. Easiest for small hands, and it mixes two decks well.</li>
        <li><b>Overhand</b>: hold the deck in one hand and pull small groups off the top into the other hand. Do it about 10 times.</li>
        <li><b>Riffle</b>: split the deck in two, bend the corners up with your thumbs and let them fall together. Seven riffles mixes a deck properly.</li>
        <li><b>Dealing</b>: give one card at a time, face down, going clockwise and starting with the player on the dealer's left. Take turns being the dealer.</li>
      </ul>
    </section>

    <section class="sec">
      <h2>Words used in the rules</h2>
      ${table(['Word', 'Meaning'], [
        ['Stock', 'The face-down pile of cards left after dealing. You draw from it.'],
        ['Discard pile', 'The face-up pile where played or thrown-away cards go.'],
        ['Hand', 'The cards you hold. Keep them so others can\'t see.'],
        ['Rank', 'The number or letter on a card (7, Q, A).'],
        ['Suit', 'Spades, hearts, diamonds or clubs.'],
        ['Wild card', 'A card that can stand for any other card.'],
        ['Trick', 'One round where each player plays one card and the best card wins them all.'],
        ['Lead', 'Play the first card of a trick.'],
        ['Follow suit', 'Play a card of the same suit as the one that was led.'],
        ['Trumps', 'The suit that beats all other suits for that hand.'],
        ['Meld', 'A group of cards laid on the table, like a set or a run in Rummy.'],
        ['Round', 'One deal, played until someone wins it. A game is usually several rounds.'],
      ])}
    </section>

    <section class="sec">
      <h2>Timers and the chess clock</h2>
      <ul>
        <li><b>Normal timer</b>: used for timed rounds in <a href="#/game/make-24">Make 24</a> and <a href="#/game/target">Target</a>, and to cap the length of <a href="#/game/math-war">Maths War</a> and <a href="#/game/egyptian-ratscrew">Egyptian Ratscrew</a>.</li>
        <li><b>Chess clock app</b>: two timers, one per player. Only one runs at a time. When your turn is done, tap your side: your time stops and the other player's starts. If your time reaches zero, you lose. Used in <a href="#/game/times-showdown">Times Table Showdown</a>, and as a variant in <a href="#/game/crazy-eights">Crazy Eights</a> and <a href="#/game/rummy">Rummy</a>.</li>
        <li>A chess clock is also a simple way to handicap: give the child more time than the adult.</li>
      </ul>
    </section>

    <section class="sec">
      <h2>Things from around the house</h2>
      <ul>
        <li><b>Paper and pencil</b> for keeping score. Draw a column for each player and write the running total after every round.</li>
        <li><b>Spoons</b> (wooden or plastic) for <a href="#/game/spoons">Spoons</a>.</li>
        <li><b>A card holder</b> if holding 10 or more cards is hard: stand them in the gap of a half-open hardback book, or push them between two plastic jar lids placed back to back.</li>
        <li><b>A tray or placemat</b> stops cards sliding on a smooth table and marks out the playing area.</li>
        <li><b>Two decks with different backs</b> make two-deck games easy to sort out afterwards.</li>
      </ul>
    </section>

    <section class="sec">
      <h2>Keeping it fair</h2>
      <p>Every game page has a short list of handicaps for when the adult keeps winning. General ideas that work in most games:</p>
      <ul>
        <li>Play the first few games with all hands face up and say your thinking out loud. The child learns the strategy, not only the rules.</li>
        <li>Give the child extra time, extra cards, or a lower target score.</li>
        <li>Remove one handicap at a time once the child wins about half the games.</li>
      </ul>
    </section>

    <section class="sec">
      <h2>A suggested order</h2>
      ${table(['Stage', 'Games'], [
        ['First week', '<a href="#/game/crazy-eights">Crazy Eights</a>, <a href="#/game/speed">Speed</a>, <a href="#/game/math-war">Maths War</a>'],
        ['Next', '<a href="#/game/kings-corner">Kings Corner</a>, <a href="#/game/golf">Golf</a>, <a href="#/game/salute">Salute!</a>, <a href="#/game/make-24">Make 24</a>, <a href="#/game/times-showdown">Times Table Showdown</a>'],
        ['Then', '<a href="#/game/rummy">Rummy</a>, <a href="#/game/egyptian-ratscrew">Egyptian Ratscrew</a>, <a href="#/game/number-builder">Number Builder</a>, <a href="#/game/target">Target</a>'],
        ['With a third player', '<a href="#/game/spoons">Spoons</a>, <a href="#/game/oh-hell">Oh Hell!</a>, three-player <a href="#/game/salute">Salute!</a>'],
        ['When the rest feel easy', '<a href="#/game/german-whist">German Whist</a>, <a href="#/game/spite-and-malice">Spite and Malice</a>, <a href="#/game/casino">Casino</a>'],
      ])}
    </section>`;
}

function route() {
  const hash = location.hash.replace(/^#\/?/, '');
  const [page, id] = hash.split('/');
  if (page === 'game' && GAME_BY_ID[id]) renderGame(GAME_BY_ID[id]);
  else if (page === 'basics') renderBasics();
  else renderHome();
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();
