// Helpers that draw playing cards and table layouts as HTML.
// Card codes: rank + suit letter, e.g. "7h", "10s", "Kd", "Ac". "x" is a face-down card.
// Add "!" to highlight a card, "~" to fade it and ">" to turn it sideways: "8s!", "Kc~", "9h>".

const SUIT = { s: ['♠', 'spades'], h: ['♥', 'hearts'], d: ['♦', 'diamonds'], c: ['♣', 'clubs'] };
const RANK_NAME = { A: 'Ace', J: 'Jack', Q: 'Queen', K: 'King' };

function parseCode(raw) {
  let code = raw;
  let mods = '';
  while (/[!~>]$/.test(code)) { mods += code.slice(-1); code = code.slice(0, -1); }
  return { code, extra: (mods.includes('!') ? ' hl' : '') + (mods.includes('~') ? ' dim' : '') + (mods.includes('>') ? ' side' : '') };
}

// One card.
function c(raw, more = '') {
  const { code, extra } = parseCode(raw);
  if (code === 'x') return `<span class="card back${extra} ${more}" role="img" aria-label="face-down card"></span>`;
  const s = code.slice(-1).toLowerCase();
  const r = code.slice(0, -1).toUpperCase();
  const [sym, sname] = SUIT[s];
  const red = s === 'h' || s === 'd' ? ' red' : '';
  const isFace = 'JQK'.includes(r);
  return `<span class="card${red}${isFace ? ' face' : ''}${extra} ${more}" role="img" aria-label="${RANK_NAME[r] || r} of ${sname}">`
    + `<span class="ix">${r}<br>${sym}</span><span class="pip">${isFace ? r : sym}</span></span>`;
}

// A row of cards from a space-separated list.
const cards = (list, cls = '') => `<span class="cards ${cls}">${list.trim().split(/\s+/).map(code => c(code)).join('')}</span>`;
// Overlapping cards, as held in a hand.
const fan = list => cards(list, 'fan');
// A pile (stacked look) with a label under it.
const pile = (code, label) => lab(c(code, 'stack'), label);
// An empty spot on the table.
const slot = label => `<span class="card slot">${label}</span>`;
// Anything with a small label underneath.
const lab = (inner, label) => `<span class="lab">${inner}${label ? `<small>${label}</small>` : ''}</span>`;
// A dashed area of the table with a heading.
const zone = (label, ...inner) => `<div class="zone"><small>${label}</small>${inner.join('')}</div>`;

const row = (...a) => `<div class="frow">${a.join('')}</div>`;
const rowNoWrap = (...a) => `<div class="frow nowrap">${a.join('')}</div>`;
const col = (...a) => `<div class="fcol">${a.join('')}</div>`;
const felt = (...a) => `<div class="felt">${a.join('')}</div>`;
const grid3 = (...a) => `<div class="grid3">${a.join('')}</div>`;
// A grid of n columns. Cells are HTML strings; '' leaves a cell empty.
const gridN = (n, cells, cls = '') => `<div class="gridn ${cls}" style="grid-template-columns: repeat(${n}, auto)">${cells.map(x => `<span class="cell">${x}</span>`).join('')}</div>`;
// A game piece (bunny, coin) with a short label.
const token = (label, cls = '') => `<span class="token ${cls}">${label}</span>`;
const divider = () => '<div class="divider"></div>';

const op = s => `<span class="op">${s}</span>`;
const say = s => `<span class="say">${s}</span>`;
const arrow = (s = '→') => `<span class="arrow">${s}</span>`;

// A figure box with a caption.
const fig = (inner, caption, title) =>
  `<figure class="fig">${title ? `<h4>${title}</h4>` : ''}${inner}${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
const figs = (...a) => `<div class="figrow">${a.join('')}</div>`;

// A card named inside a sentence, e.g. t('7h') -> 7♥ in red.
function t(code) {
  const s = code.slice(-1).toLowerCase();
  const r = code.slice(0, -1).toUpperCase();
  return `<span class="tc${s === 'h' || s === 'd' ? ' red' : ''}">${r}${SUIT[s][0]}</span>`;
}

// A table from a header row and body rows.
const table = (head, rows) =>
  `<table class="simple"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead>`
  + `<tbody>${rows.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
