// Theme toggle: an explicit choice is saved; otherwise the system setting wins.
const root = document.documentElement;
const toggle = document.getElementById('theme-toggle');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

function currentTheme() {
  return root.dataset.theme || (systemDark.matches ? 'dark' : 'light');
}

function syncIcon() {
  const dark = currentTheme() === 'dark';
  toggle.textContent = dark ? '☀' : '☾';
  toggle.dataset.tip = dark ? 'For the 2pm readers.' : 'For the 2am readers.';
}

toggle.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
  syncIcon();
  if (tipFor === toggle) showTip(toggle);
});
systemDark.addEventListener('change', syncIcon);
syncIcon();

// Email is assembled here so it isn't sitting in the HTML for scrapers.
const email = document.getElementById('email');
const address = email.dataset.user + '@' + email.dataset.domain;
email.href = 'mailto:' + address;
email.textContent = address;

// Tooltips: title="..." in the HTML becomes a small themed box on hover,
// focus or tap. data-tip-img="path" adds a picture above the text.
const tip = document.createElement('div');
tip.id = 'tip';
tip.setAttribute('role', 'tooltip');
document.body.appendChild(tip);

document.querySelectorAll('[title]').forEach((el) => {
  el.dataset.tip = el.title;
  el.removeAttribute('title');
});

let tipFor = null;
let armed = null;
let lastPointer = 'mouse';
document.addEventListener('pointerdown', (e) => { lastPointer = e.pointerType; }, true);

function showTip(el) {
  tipFor = el;
  tip.textContent = '';
  if (el.dataset.tipImg) {
    const img = document.createElement('img');
    img.src = el.dataset.tipImg;
    img.alt = '';
    img.onload = placeTip;
    tip.appendChild(img);
  }
  tip.appendChild(document.createTextNode(el.dataset.tip));
  tip.classList.toggle('long', el.dataset.tip.length > 160);
  tip.classList.add('show');
  placeTip();
}

function placeTip() {
  if (!tipFor) return;
  const r = tipFor.getBoundingClientRect();
  const t = tip.getBoundingClientRect();
  const gap = 8;
  let top = r.top - t.height - gap;
  tip.classList.toggle('below', top < gap);
  if (top < gap) top = r.bottom + gap;
  let left = r.left + r.width / 2 - t.width / 2;
  left = Math.max(gap, Math.min(left, window.innerWidth - t.width - gap));
  tip.style.top = top + 'px';
  tip.style.left = left + 'px';
  tip.style.setProperty('--arrow-x', (r.left + r.width / 2 - left) + 'px');
}

function hideTip() {
  tipFor = null;
  armed = null;
  tip.classList.remove('show');
}

document.addEventListener('mouseover', (e) => {
  if (lastPointer === 'touch') return; // taps are handled by click below
  const el = e.target.closest('[data-tip]');
  if (el && el !== tipFor) showTip(el);
  else if (!el && tipFor) hideTip();
});
document.addEventListener('focusin', (e) => {
  const el = e.target.closest('[data-tip]');
  if (el) showTip(el);
});
document.addEventListener('focusout', hideTip);
// Touch: the first tap on anything with a tip shows it (links included, so
// phones see link tips too); a second tap on the same link follows it.
// Tapping anywhere else hides the tip.
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-tip]');
  if (!el) { hideTip(); return; }
  if (lastPointer === 'touch' && el.matches('a[href]') && armed !== el) {
    e.preventDefault();
    armed = el;
    showTip(el);
    return;
  }
  if (!el.closest('a, button') && el !== tipFor) showTip(el);
});
window.addEventListener('scroll', hideTip, { passive: true });
window.addEventListener('resize', hideTip);

// Notes toggle: shows every note in the page body at once, so they can be
// read without hovering or tapping each one.
const notesToggle = document.getElementById('notes-toggle');
const boxes = new Map();
document.querySelectorAll('main [data-tip]').forEach((el) => {
  const anchor = el.closest('li, p, figure') || el;
  if (!boxes.has(anchor)) {
    const box = document.createElement('div');
    box.className = 'notes-box';
    if (anchor.matches('li')) anchor.appendChild(box);
    else anchor.after(box);
    boxes.set(anchor, box);
  }
  const note = document.createElement('div');
  note.className = 'note';
  if (el.dataset.tipImg) {
    const img = document.createElement('img');
    img.src = el.dataset.tipImg;
    img.alt = '';
    img.loading = 'lazy';
    note.appendChild(img);
  }
  if (!el.matches('.title, figcaption')) {
    const label = document.createElement('b');
    label.textContent = el.textContent.trim() + ': ';
    note.appendChild(label);
  }
  note.appendChild(document.createTextNode(el.dataset.tip));
  boxes.get(anchor).appendChild(note);
});

function setNotes(on) {
  document.body.classList.toggle('notes-on', on);
  notesToggle.setAttribute('aria-pressed', on);
  if (on) hideTip();
}
notesToggle.addEventListener('click', () => {
  const on = !document.body.classList.contains('notes-on');
  setNotes(on);
  try { localStorage.setItem('notes', on ? '1' : ''); } catch (e) {}
});
try { if (localStorage.getItem('notes')) setNotes(true); } catch (e) {}
