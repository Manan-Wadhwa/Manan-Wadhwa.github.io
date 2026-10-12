import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const [,, selector, out, scheme = 'light', w = '1280', h = '800'] = process.argv;
const chrome = spawn('chromium', ['--headless', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=9333',
  `--window-size=${w},${h}`, `--blink-settings=preferredColorScheme=${scheme === 'dark' ? 0 : 1}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 50; i++) { try { targets = await (await fetch('http://127.0.0.1:9333/json')).json(); break; } catch { await sleep(100); } }
const page = targets.find((t) => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (pending.has(d.id)) { pending.get(d.id)(d.result); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable');
await send('Page.navigate', { url: 'http://127.0.0.1:8000/' });
await sleep(2500);
const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value;
const box = await ev(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); el.scrollIntoView({block:'center'}); const r = el.getBoundingClientRect(); return {x: r.left + r.width/2, y: r.top + r.height/2}; })()`);
await sleep(200);
await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: box.x, y: box.y });
await sleep(800);
console.log(JSON.stringify(await ev(`({show: document.getElementById('tip').classList.contains('show'), text: document.getElementById('tip').textContent, titlesLeft: document.querySelectorAll('[title]').length})`)));
const shot = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync(out, Buffer.from(shot.data, 'base64'));
ws.close(); chrome.kill();
