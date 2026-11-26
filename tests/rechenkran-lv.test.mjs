// deps: index.html
// Rechenkran in LearningView: Speichern, Ergebnis, Lehrkraft-Ansichten, Einstellungen, manipulierte Daten.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { launch, openLV, sleep, EVIL } from './helpers.mjs';

let browser;
before(async () => { browser = await launch(); });
after(async () => { await browser.close(); });

async function playRound(frame) {
  for (let step = 0; step < 600; step++) {
    const s = await frame.evaluate(() => ({ mode: st.mode, carrying: st.carrying, ans: st.carrying ? st.queue[st.idx].ans : null, opts: st.options }));
    if (s.mode === 'end') return;
    if (s.mode !== 'play') { await sleep(150); continue; }
    const target = s.carrying ? s.opts.indexOf(s.ans) + 1 : 0;
    await frame.evaluate((i) => { if (st.slot !== i) moveCraneTo(i); drop(); }, target);
    await sleep(250);
  }
  throw new Error('Runde wurde nicht beendet');
}

const TEMPLATE = JSON.stringify({ version: 1, settings: { mode: 'add', range: 20, addOps: ['plus'], cross: ['mit'], count: 12 }, allowChoice: false });

test('Schüler: feste Übung, Runde wird gespeichert und Ergebnis gemeldet', async () => {
  const lv = await openLV(browser, 'index.html', { mode: 'student', template: TEMPLATE });
  assert.match(await lv.frame.textContent('#lvFixed'), /Deine Übung: Plus bis 20 · mit Zehnerübergang/);
  await lv.frame.click('#btnStart');
  await playRound(lv.frame);
  await sleep(1500);
  const saved = JSON.parse((await lv.store()).answer);
  assert.equal(saved.rounds.length, 1);
  assert.equal(saved.rounds[0].done, true);
  assert.equal(saved.rounds[0].solved, 12);
  assert.ok(!JSON.stringify(saved).includes('name'), 'keine Namen im Speicherstand');
  assert.ok((await lv.log()).some(m => m && m.result && m.result.score), 'Ergebnis an LearningView gemeldet');
  assert.deepEqual(lv.errors, []);
  await lv.ctx.close();
});

test('Lehrkraft: Klassenübersicht zeigt manipulierte Daten nur als Text und bleibt bedienbar', async () => {
  const evilState = JSON.stringify({ rounds: [{ t: '2026-11-26T10:00:00Z', ex: EVIL, solved: '12', first: 10, errors: 2, wrong: [EVIL], done: true }], prefs: { __proto__: { polluted: 1 } } });
  const classData = [
    { studentId: '1', name: EVIL, surname: 'Test', data: evilState },
    { studentId: '2', name: 'Lin', surname: 'Meier', data: '{kaputt' },
    { studentId: '3', name: 'Tom', surname: 'Bauer', data: '' },
  ];
  const lv = await openLV(browser, 'index.html', { mode: 'class', template: TEMPLATE, classData });
  await sleep(300);
  const body = await lv.frame.textContent('#reportBody');
  assert.ok(body.includes('<img src=x'), 'HTML erscheint als Text');
  assert.match(body, /Ungültiger Speicherstand/);
  assert.match(body, /Noch nicht gespielt/);
  assert.equal(await lv.frame.evaluate(() => window.__xss), undefined);
  assert.equal(await lv.frame.evaluate(() => ({}).polluted), undefined, 'kein Prototype Pollution');
  assert.deepEqual(lv.errors, []);
  await lv.ctx.close();
});

test('Lehrkraft: Einzelansicht einer Schülerlösung', async () => {
  const answer = JSON.stringify({ version: 1, prefs: {}, rounds: [{ t: '2026-11-26T10:00:00Z', ex: 'Plus bis 20', planned: 12, solved: 12, first: 9, errors: 3, wrong: ['8 + 5 = 13'], sec: 80, done: true }] });
  const lv = await openLV(browser, 'index.html', { mode: 'studentReview', template: TEMPLATE, answer });
  await sleep(200);
  assert.match(await lv.frame.textContent('#reportSub'), /1 Runde · 12 Aufgaben · 3 Fehler · 75 % sofort richtig/);
  assert.deepEqual(lv.errors, []);
  await lv.ctx.close();
});

test('Lehrkraft: Einstellungen werden als appTemplate gespeichert', async () => {
  const lv = await openLV(browser, 'index.html', { mode: 'settings' });
  await lv.frame.click('#modeTabs button[data-mode=mul]');
  await lv.frame.click('#lvChoiceChips button:nth-child(1)');
  await sleep(1500);
  const tpl = JSON.parse((await lv.store()).template);
  assert.equal(tpl.settings.mode, 'mul');
  assert.equal(tpl.allowChoice, false);
  assert.deepEqual(lv.errors, []);
  await lv.ctx.close();
});

test('Manipuliertes appTemplate wird bereinigt', async () => {
  const evilTpl = JSON.stringify({ settings: { mode: 'mul', rows: [EVIL, 6], mulOps: [EVIL, 'div'], count: 999 }, allowChoice: false });
  const lv = await openLV(browser, 'index.html', { mode: 'student', template: evilTpl });
  const s = await lv.frame.evaluate(() => ({ rows: settings.rows, ops: settings.mulOps, count: settings.count }));
  assert.deepEqual(s, { rows: [6], ops: ['div'], count: 20 });
  assert.equal(await lv.frame.evaluate(() => window.__xss), undefined);
  await lv.ctx.close();
});
