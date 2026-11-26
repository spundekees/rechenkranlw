// Gemeinsame Hilfen für die Browser-Tests: Datei direkt öffnen oder in einer nachgebauten LearningView-Seite.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const fileUrl = (file, query = '') => `file://${join(ROOT, file)}${query ? '?' + query : ''}`;
export const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export async function launch() {
  return chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
}

// Seite öffnen und Skriptfehler sammeln
export async function openPage(browser, url, viewport = { width: 1180, height: 820 }) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(url);
  return { page, errors };
}

// Nachbau des LearningView-Elternfensters nach https://learningview.org/embed-api.php
const parentHtml = `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0">
<iframe id="f" src="/content.html" style="width:100vw;height:100vh;border:0"></iframe>
<script>
  window.log = []; const f = document.getElementById('f');
  window.addEventListener('message', e => {
    if (e.source !== f.contentWindow) return;
    const d = e.data; log.push(d);
    const reply = m => f.contentWindow.postMessage(m, '*');
    const type = typeof d === 'string' ? d : (d.type || d.action);
    if (type === 'saveAnswerData') { store.answer = d.data; setTimeout(() => reply('SAVED'), 20); }
    else if (type === 'getAnswerData') reply({ type: 'sendAnswerData', data: store.answer });
    else if (type === 'saveAppTemplate') { store.template = d.data; reply('APP_TEMPLATE_SAVED'); }
    else if (type === 'getClassAnswerData') {
      reply({ type: 'classDataConsentPending', request: 'getClassAnswerData' });
      setTimeout(() => reply({ type: 'sendClassAnswerData', data: store.classData }), 50);
    }
  });
</script></body></html>`;

export async function openLV(browser, file, { mode, template = '', answer = '', classData = [], viewport = { width: 1180, height: 820 } }) {
  const ctx = await browser.newContext({ viewport });
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- Datei aus dem Repo, vom Test vorgegeben
  const content = readFileSync(join(ROOT, file), 'utf8')
    .replace('<head>', `<head><script>window.learningView = { mode: ${JSON.stringify(mode)}, appTemplate: ${JSON.stringify(template)} };</script>`);
  const store = JSON.stringify({ answer, template, classData });
  await ctx.route('https://learningview.org/**', route => route.request().url().endsWith('/content.html')
    ? route.fulfill({ contentType: 'text/html; charset=utf-8', body: content })
    : route.fulfill({ contentType: 'text/html; charset=utf-8', body: parentHtml.replace('<script>', `<script>window.store = ${store};`) }));
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('https://learningview.org/aufgabe.html');
  await page.waitForFunction(() => document.querySelector('iframe').contentWindow.document.readyState === 'complete');
  await sleep(300);
  const frame = page.frame({ url: /content\.html/ });
  return { ctx, page, frame, errors, store: () => page.evaluate(() => window.store), log: () => page.evaluate(() => window.log) };
}

// Bösartige Eingaben für Sicherheitstests
export const EVIL = '<img src=x onerror="window.__xss=1">';
