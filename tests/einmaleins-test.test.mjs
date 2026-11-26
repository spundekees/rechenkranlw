// deps: einmaleins-test.html
// 1·1-Test: Ablauf, Ergebnis mit Prozent und Rückmeldung, Übergabe an den Rechenkran,
// Lehrkraft-Auswertung, manipulierte Daten, Darstellung auf kleinen Bildschirmen.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { launch, openLV, openPage, fileUrl, sleep, EVIL } from './helpers.mjs';

let browser;
before(async () => { browser = await launch(); });
after(async () => { await browser.close(); });

const TEMPLATE = JSON.stringify({ version: 1, rows: [3, 7], ops: ['mul', 'div'], perRow: 5, attempts: 'once', showResult: true, feedback: false, practice: true });

// Beantwortet alle Aufgaben; wrong(t) entscheidet, ob absichtlich falsch geantwortet wird
async function answerAll(frame, wrong) {
  for (let i = 0; i < 500; i++) {
    const t = await frame.evaluate(() => { const at = data.attempts.at(-1); return at && !at.done ? at.tasks[at.answers.length] || null : null; });
    if (!t) return;
    const k = wrong(t) ? t.opts.findIndex(v => v !== t.ans) : t.opts.indexOf(t.ans);
    await frame.press('body', String(k + 1));
    await sleep(400);
  }
}

test('Schüler: Test mit Fehlern in der 7er-Reihe, Ergebnis mit Prozent, Rückmeldung und Übergabe', async () => {
  const lv = await openLV(browser, 'einmaleins-test.html', { mode: 'student', template: TEMPLATE });
  await lv.frame.click('.big-btn');
  await answerAll(lv.frame, t => t.row === 7 && t.op === '·');   // 7er Mal: alles falsch → 5/10 = 50 %
  await sleep(300);
  const text = await lv.frame.textContent('main');
  assert.match(text, /15 von 20 richtig · 75 %/);
  assert.match(text, /3er-Reihe10 von 10 · 100 %Super!/);
  assert.match(text, /7er-Reihe5 von 10 · 50 %Hier musst du noch üben\./);
  const saved = JSON.parse((await lv.store()).answer);
  assert.equal(saved.attempts[0].done, true);
  const score = (await lv.log()).find(m => m && m.result);
  assert.deepEqual(score.result.score, { raw: 15, max: 20 });
  // Übergabe an den Rechenkran: nur die rote Reihe, nur Mal
  await lv.frame.click('text=Jetzt üben');
  assert.match(await lv.frame.textContent('main'), /Auf zum Rechenkran!.*7er-Reihe/s);
  assert.equal(await lv.frame.getAttribute('a.big-btn', 'href'), 'https://spundekees.github.io/rechenkranlw/?rows=7&ops=mul&count=20&from=test');
  assert.deepEqual(lv.errors, []);
  await lv.ctx.close();
});

test('Schüler: Test nur einmal erlaubt', async () => {
  const at = { t: '2026-11-26T10:00:00Z', rows: [3], ops: ['mul'], tasks: [{ a: 3, op: '·', b: 4, ans: 12, row: 3, opts: [9, 12, 15, 16] }], answers: [{ given: 12, ms: 2000 }], done: true };
  const lv = await openLV(browser, 'einmaleins-test.html', { mode: 'student', template: TEMPLATE, answer: JSON.stringify({ version: 1, prefs: {}, attempts: [at] }) });
  await sleep(200);
  assert.match(await lv.frame.textContent('main'), /Du hast den Test schon gemacht/);
  await lv.ctx.close();
});

test('Lehrkraft: Klassenübersicht mit Prozent bei „Gesamt“, manipulierte Daten nur als Text', async () => {
  const mk = (rightRow) => {
    const at = { t: '2026-11-26T10:00:00Z', rows: [3, 7], ops: ['mul'], tasks: [], answers: [], done: true };
    for (const r of [3, 7]) for (const k of [2, 4, 6, 8, 9]) { at.tasks.push({ a: r, op: '·', b: k, ans: r * k, row: r, opts: [] }); at.answers.push({ given: r === rightRow ? r * k : 0, ms: 3000 }); }
    return JSON.stringify({ version: 1, prefs: {}, attempts: [at] });
  };
  const evil = JSON.stringify({ attempts: [{ t: EVIL, rows: [3], ops: ['mul'], tasks: [{ a: 3, op: '·', b: 2, ans: 6, row: '__proto__', opts: [] }], answers: [{ given: 6 }], done: true }] });
  const classData = [
    { studentId: '1', name: 'Ada', surname: 'Müller', data: mk(3) },
    { studentId: '2', name: EVIL, surname: 'X', data: evil },
    { studentId: '3', name: 'Lin', surname: 'Meier', data: '' },
    // ein gültiger und ein manipulierter Durchgang
    { studentId: '4', name: 'Tom', surname: 'Bauer', data: JSON.stringify({ attempts: [JSON.parse(mk(7)).attempts[0], JSON.parse(evil).attempts[0]] }) },
  ];
  const lv = await openLV(browser, 'einmaleins-test.html', { mode: 'class', template: TEMPLATE, classData });
  await sleep(300);
  const rows = await lv.frame.evaluate(() => [...document.querySelectorAll('tbody > tr')].map(tr => tr.textContent));
  assert.ok(rows.some(r => /Ada Müller5\/50\/55\/10 · 50 %/.test(r)), 'Gesamt mit Prozent');
  assert.ok(rows.some(r => r.includes('<img src=x') && r.includes('Ungültiger Speicherstand')), 'Manipulierter Datensatz verworfen, Name als Text');
  assert.ok(rows.some(r => /^Tom Bauer.*1 ungültiger Durchgang verworfen$/.test(r)), 'Hinweis auf verworfenen Durchgang');
  assert.ok(rows.some(r => /^Klasse5\/105\/1010\/20 · 50 %$/.test(r)), 'Klassenzeile mit Prozent');
  assert.equal(await lv.frame.evaluate(() => window.__xss), undefined);
  assert.deepEqual(lv.errors, []);
  await lv.ctx.close();
});

test('Lehrkraft: Einstellungen inkl. „Nach dem Test üben“ werden gespeichert', async () => {
  const lv = await openLV(browser, 'einmaleins-test.html', { mode: 'settings' });
  await lv.frame.click('text=nicht anbieten');
  await sleep(1200);
  const tpl = JSON.parse((await lv.store()).template);
  assert.equal(tpl.practice, false);
  assert.deepEqual(lv.errors, []);
  await lv.ctx.close();
});

test('Darstellung: Aufgabe einzeilig, Knöpfe ohne Scrollen sichtbar (Handy bis Computer)', async () => {
  for (const [w, h] of [[270, 440], [390, 700], [925, 525], [1180, 820]]) {
    for (const big of [false, true]) {
      const { page, errors } = await openPage(browser, fileUrl('einmaleins-test.html'), { width: w, height: h });
      await page.click('.big-btn');
      if (big) await page.click('#btnBig');
      await page.evaluate(() => { const at = data.attempts.at(-1); at.tasks[0] = { a: 100, op: ':', b: 10, ans: 10, row: 10, opts: [8, 9, 10, 100] }; runTask(); });
      const r = await page.evaluate(() => {
        const t = document.querySelector('.task'), a = [...document.querySelectorAll('.ans')];
        return { bottom: Math.max(...a.map(x => x.getBoundingClientRect().bottom)), oneLine: t.scrollWidth <= t.clientWidth + 1, hscroll: document.documentElement.scrollWidth > innerWidth };
      });
      assert.ok(r.bottom <= h, `${w}x${h}${big ? ' groß' : ''}: Knöpfe sichtbar (${r.bottom})`);
      assert.ok(r.oneLine, `${w}x${h}: Aufgabe einzeilig`);
      assert.equal(r.hscroll, false, `${w}x${h}: kein Querscrollen`);
      assert.deepEqual(errors, []);
      await page.close();
    }
  }
});

test('Logging im Test: Fehler beim Speichern wird als ERROR protokolliert', async () => {
  const lv = await openLV(browser, 'einmaleins-test.html', { mode: 'student', template: TEMPLATE });
  await lv.page.evaluate(() => document.querySelector('iframe').contentWindow.postMessage({ type: 'saveAnswerDataError', error: 'SAVE_FAILED' }, '*'));
  await sleep(100);
  const lines = await lv.frame.evaluate(() => LOG.lines());
  assert.ok(lines.some(l => /\| ERROR \| lv \| Speichern fehlgeschlagen: SAVE_FAILED/.test(l)));
  await lv.ctx.close();
});
