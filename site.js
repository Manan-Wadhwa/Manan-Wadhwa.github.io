// Theme toggle: an explicit choice is saved; otherwise the system setting wins.
const root = document.documentElement;
const toggle = document.getElementById('theme-toggle');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

function currentTheme() {
  return root.dataset.theme || (systemDark.matches ? 'dark' : 'light');
}

function syncIcon() {
  toggle.textContent = currentTheme() === 'dark' ? '☀' : '☾';
}

toggle.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
  syncIcon();
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
  tip.classList.remove('show');
}

document.addEventListener('mouseover', (e) => {
  const el = e.target.closest('[data-tip]');
  if (el && el !== tipFor) showTip(el);
  else if (!el && tipFor) hideTip();
});
document.addEventListener('focusin', (e) => {
  const el = e.target.closest('[data-tip]');
  if (el) showTip(el);
});
document.addEventListener('focusout', hideTip);
// Touch: tapping a non-link shows its tip; tapping anywhere else hides it.
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-tip]');
  if (el && !el.closest('a, button') && el !== tipFor) showTip(el);
  else if (!el) hideTip();
});
window.addEventListener('scroll', hideTip, { passive: true });
window.addEventListener('resize', hideTip);
