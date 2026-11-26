// ESLint: Code-Qualität und Sicherheitsregeln (SAST) für das JavaScript in den HTML-Dateien
import js from '@eslint/js';
import globals from 'globals';
import html from 'eslint-plugin-html';
import security from 'eslint-plugin-security';
import noUnsanitized from 'eslint-plugin-no-unsanitized';

export default [
  { ignores: ['node_modules/**', 'tests/.extracted/**', 'tests/artifacts/**', 'tests/fixtures/**'] },
  js.configs.recommended,
  security.configs.recommended,
  {
    files: ['**/*.html'],
    plugins: { html, 'no-unsanitized': noUnsanitized },
    languageOptions: { ecmaVersion: 2022, sourceType: 'script', globals: { ...globals.browser } },
    rules: {
      'no-unsanitized/method': 'error',
      'no-unsanitized/property': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      // Abgeschaltet: meldet jeden Zugriff obj[key], auch Array-Indizes aus dem eigenen Code (bekannte Fehlalarme).
      // Abhilfe stattdessen: Alle Daten von außen werden geprüft (sanitizeSettings, sanitizeState, sanitizeCfg, sanitizeData).
      'security/detect-object-injection': 'off',
    },
  },
  {
    files: ['tests/**/*.mjs', 'eslint.config.mjs'],
    languageOptions: {
      ecmaVersion: 2022, sourceType: 'module',
      // Tests führen Code auch im Browser aus (page.evaluate) und greifen dort auf Variablen der Seite zu
      globals: { ...globals.node, ...globals.browser, st: 'readonly', settings: 'readonly', moveCraneTo: 'readonly', drop: 'readonly',
        renderMenu: 'readonly', data: 'readonly', runTask: 'readonly', LOG: 'readonly' },
    },
    rules: { 'security/detect-object-injection': 'off' },
  },
];
