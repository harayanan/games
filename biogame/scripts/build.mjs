// Validates content/*.json against CONTENT-SPEC.md and writes public/data/sticks.json.
// Usage: node scripts/build.mjs            (validate all + build)
//        node scripts/build.mjs heart      (validate one system's files only, no build)
// Each system can have several batch files: content/heart.json, content/heart-2.json, …
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SYSTEMS = ['cells', 'bones', 'heart', 'lungs', 'digestion', 'brain', 'senses', 'hormones', 'cleaning', 'germs'];
const MODES = ['odd', 'taboo', 'case'];

const only = process.argv[2];
const files = readdirSync(join(root, 'content')).filter(f => f.endsWith('.json'))
  .filter(f => !only || f.replace(/(-\d+)?\.json$/, '') === only);

const errors = [];
const all = [];
const ids = new Set();
const targets = new Map(); // normalised taboo word / case answer+scenario -> id

const isStr = (v, min = 1) => typeof v === 'string' && v.trim().length >= min;
const strArr = (v, n) => Array.isArray(v) && v.length === n && v.every(s => isStr(s));
const words = s => s.trim().split(/\s+/).length;
const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');

for (const file of files) {
  const system = file.replace(/(-\d+)?\.json$/, '');
  let sticks;
  try { sticks = JSON.parse(readFileSync(join(root, 'content', file), 'utf8')); }
  catch (e) { errors.push(`${file}: invalid JSON (${e.message})`); continue; }
  if (!SYSTEMS.includes(system)) errors.push(`${file}: unknown system id`);
  if (!Array.isArray(sticks)) { errors.push(`${file}: not an array`); continue; }

  for (const s of sticks) {
    const e = msg => errors.push(`${file} ${s.id ?? '(no id)'}: ${msg}`);
    if (!isStr(s.id) || !/^[a-z]+-(odd|taboo|case)-\d{2,3}$/.test(s.id)) e('bad id format');
    if (ids.has(s.id)) e('duplicate id');
    ids.add(s.id);
    if (s.system !== system) e(`system "${s.system}" does not match file`);
    if (!MODES.includes(s.mode)) e(`bad mode "${s.mode}"`);
    else if (!s.id.includes(`-${s.mode}-`)) e('id mode does not match mode');
    if (![1, 2, 3].includes(s.level)) e('level must be 1, 2 or 3');
    if (!isStr(s.explain, 60)) e('explain missing or too short (<60 chars)');
    if (s.fact !== undefined && !isStr(s.fact)) e('fact must be a non-empty string if present');

    if (s.mode === 'odd') {
      if (!strArr(s.items, 5)) e('items must be 5 strings');
      if (!strArr(s.notes, 5)) e('notes must be 5 strings');
      if (!s.items?.includes(s.answer)) e('answer not in items');
      if (new Set(s.items?.map(norm)).size !== 5) e('items not unique');
      if (!isStr(s.reason)) e('reason missing');
    }
    if (s.mode === 'taboo') {
      if (!isStr(s.word)) e('word missing');
      if (!strArr(s.forbidden, 4)) e('forbidden must be 4 strings');
      if (!strArr(s.clues, 3)) e('clues must be 3 strings');
      if (!strArr(s.decoys, 3)) e('decoys must be 3 strings');
      if (isStr(s.word)) {
        const w = s.word.toLowerCase();
        const stem = w.length > 5 ? w.slice(0, w.length - 2) : w;
        s.clues?.forEach((c, i) => { if (c.toLowerCase().includes(stem)) e(`clue ${i + 1} contains the target word`); });
        if (s.decoys?.some(d => norm(d) === norm(s.word))) e('decoy equals word');
        // Forbidden words, matched at word starts so "Nerve" catches "nervous" but "Ear" skips "hear".
        s.forbidden?.forEach(f => {
          const lower = f.toLowerCase();
          const stem = (lower.length > 4 ? lower.replace(/(es|e|s)$/, '') : lower).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const re = new RegExp(`\\b${stem}`, 'i');
          s.clues?.forEach((c, i) => { if (re.test(c)) e(`clue ${i + 1} uses forbidden word "${f}"`); });
        });
        const key = 'taboo:' + norm(s.word);
        if (targets.has(key)) e(`target word "${s.word}" already used by ${targets.get(key)}`);
        targets.set(key, s.id);
      }
    }
    if (s.mode === 'case') {
      if (!isStr(s.role)) e('role missing');
      if (!isStr(s.scenario)) e('scenario missing');
      else {
        if (words(s.scenario) > 55) e(`scenario too long (${words(s.scenario)} words)`);
        if (!s.scenario.trim().endsWith('?')) e('scenario must end with a question');
      }
      if (!strArr(s.options, 4)) e('options must be 4 strings');
      if (!strArr(s.optionNotes, 4)) e('optionNotes must be 4 strings');
      if (!s.options?.includes(s.answer)) e('answer not in options');
      if (new Set(s.options?.map(norm)).size !== 4) e('options not unique');
    }
  }

  const count = m => sticks.filter(s => s.mode === m).length;
  const summary = `${system}: ${sticks.length} sticks (odd ${count('odd')}, taboo ${count('taboo')}, case ${count('case')}; ` +
    `L1 ${sticks.filter(s => s.level === 1).length} L2 ${sticks.filter(s => s.level === 2).length} L3 ${sticks.filter(s => s.level === 3).length})`;
  console.log(summary.replace(`${system}:`, `${file}:`));
  all.push(...sticks);
}

if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  errors.forEach(x => console.error('  ' + x));
  process.exit(1);
}

if (!only) {
  mkdirSync(join(root, 'public', 'data'), { recursive: true });
  writeFileSync(join(root, 'public', 'data', 'sticks.json'), JSON.stringify(all));
  console.log(`\nOK — wrote ${all.length} sticks to public/data/sticks.json`);
} else {
  console.log('\nOK');
}
