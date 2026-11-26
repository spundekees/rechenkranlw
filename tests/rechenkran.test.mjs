// deps: index.html
// Rechenkran ohne LearningView: Spielablauf, Übung per Link, Eingabeprüfung, Logging.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { launch, openPage, fileUrl, sleep, EVIL } from './helpers.mjs';

let browser;
before(async () => { browser = await launch(); });
after(async () => { await browser.close(); });

// Spielt die laufende Runde mit der Kran-Steuerung durch (wrongAt: bei diesen Aufgaben-Nummern erst falsch absetzen)
export async function playRound(page, wrongAt = []) {
  const wrongDone = new Set();
  for (let step = 0; step < 600; step++) {
    const s = await page.evaluate(() => ({ mode: st.mode, carrying: st.carrying, slot: st.slot, idx: st.idx,
      ans: st.carrying ? st.queue[st.idx].ans : null, opts: st.options,
      blocked: [...document.querySelectorAll('#trucks .truck')].map(t => t.classList.contains('loaded') || t.classList.contains('dead')) }));
    if (s.mode === 'end') return;
    if (s.mode !== 'play') { await sleep(150); continue; }
    let target = 0;
    if (s.carrying) {
      const wrong = s.opts.findIndex((v, i) => v !== s.ans && !s.blocked[i]);
      target = (wrongAt.includes(s.idx) && !wrongDone.has(s.idx) && wrong >= 0) ? (wrongDone.add(s.idx), wrong + 1) : s.opts.indexOf(s.ans) + 1;
    }
    await page.evaluate((i) => { if (st.slot !== i) moveCraneTo(i); }, target);
    await page.evaluate(() => drop());
    await sleep(250);
  }
  throw new Error('Runde wurde nicht beendet');
}

test('Startmenü erscheint, Runde mit Container und Lastern läuft bis zum Ende', async () => {
  const { page, errors } = await openPage(browser, fileUrl('index.html'));
  assert.ok(await page.isVisible('#menu.show'), 'Menü sichtbar');
  await page.evaluate(() => { settings.mode = 'mul'; settings.rows = [3]; settings.mulOps = ['mul']; settings.count = 12; renderMenu(); });
  await page.click('#btnStart');
  await playRound(page, [1]);
  await sleep(1500);
  assert.ok(await page.isVisible('#endScreen.show'), 'Endbildschirm sichtbar');
  assert.match(await page.textContent('#endStats'), /sofort richtig/);
  assert.deepEqual(errors, []);
  await page.close();
});

test('Übung per Link wird übernommen und gesperrt angezeigt', async () => {
  const { page, errors } = await openPage(browser, fileUrl('index.html', 'rows=7,8&ops=mul,div&count=20&from=test'));
  const s = await page.evaluate(() => ({ rows: settings.rows, ops: settings.mulOps, count: settings.count, mode: settings.mode }));
  assert.deepEqual(s, { rows: [7, 8], ops: ['mul', 'div'], count: 20, mode: 'mul' });
  assert.match(await page.textContent('#lvFixed'), /Deine Übung nach dem Test: Einmaleins Mal & Geteilt · 7er- und 8er-Reihe/);
  assert.equal(await page.isVisible('#modeTabs'), false, 'Auswahl gesperrt');
  assert.deepEqual(errors, []);
  await page.close();
});

test('Ungültige Link-Parameter werden verworfen (Eingabeprüfung)', async () => {
  const { page, errors } = await openPage(browser, fileUrl('index.html', `rows=${encodeURIComponent(EVIL)},99,0&ops=evil&count=7`));
  const s = await page.evaluate(() => ({ locked: !document.querySelector('#lvFixed').hidden, rows: settings.rows }));
  assert.equal(s.locked, false, 'kein gültiger Link → normale Auswahl');
  assert.equal(await page.evaluate(() => window.__xss), undefined);
  assert.deepEqual(errors, []);
  await page.close();
});

test('Manipulierte Einstellungen im localStorage werden bereinigt', async () => {
  const { page } = await openPage(browser, fileUrl('index.html'));
  await page.evaluate((evil) => localStorage.setItem('rechenkran-v2', JSON.stringify({ mode: 'mul', rows: [evil, 4, 42], mulOps: ['mul', evil], count: evil, season: evil, __proto__: { x: 1 } })), EVIL);
  await page.reload();
  const s = await page.evaluate(() => ({ rows: settings.rows, ops: settings.mulOps, count: settings.count, season: settings.season }));
  assert.deepEqual(s, { rows: [4], ops: ['mul'], count: 20, season: 'auto' });
  await page.click('#btnStart'); await sleep(1500);
  await page.evaluate(() => { moveCraneTo(0); drop(); }); await sleep(1500);
  assert.equal(await page.evaluate(() => window.__xss), undefined, 'kein Skript aus Eingaben ausgeführt');
  await page.evaluate(() => localStorage.clear());
  await page.close();
});

test('Logging: Debug-Modus zeigt Log mit Zeitstempel, Level und Komponente', async () => {
  const { page, errors } = await openPage(browser, fileUrl('index.html', 'debug=1'));
  const lines = await page.evaluate(() => LOG.lines());
  assert.ok(lines.length > 0, 'Log enthält Einträge');
  assert.match(lines[0], /^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d \| (DEBUG|INFO) \| \w+ \| .+/);
  assert.ok(await page.isVisible('text=Debug-Log'), 'Log-Fenster sichtbar');
  // Fehler werden mit Stacktrace erfasst
  await page.evaluate(() => setTimeout(() => { throw new Error('Testfehler'); }));
  await sleep(100);
  const last = (await page.evaluate(() => LOG.lines())).at(-1);
  assert.match(last, /\| ERROR \| window \| .*Testfehler[\s\S]*Traceback:/);
  assert.deepEqual(errors, ['Testfehler']);
  await page.close();
});

test('Logging: Standard-Level WARNING protokolliert keine INFO-Meldungen', async () => {
  const { page } = await openPage(browser, fileUrl('index.html'));
  assert.deepEqual(await page.evaluate(() => LOG.lines()), []);
  await page.close();
});
