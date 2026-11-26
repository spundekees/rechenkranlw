// Absichtlich unsicherer Code: Jede Zeile muss von .semgrep/rules.yml erkannt werden (Gegenprobe).
window.parent.postMessage({ a: 1 }, '*');
window.addEventListener('message', (e) => { console.log(e.data); });
eval('1+1');
document.write('x');
const el = document.body; const name = location.hash; el.innerHTML = name;
localStorage.setItem('k', studentName);
window.open('https://example.org', '_blank');
