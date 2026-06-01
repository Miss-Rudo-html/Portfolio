// "Caym" ASCII art — figlet standard font
const ASCII_NAME = [
  '  ___                 ',
  ' / __|__ _ _  _ _ __  ',
  '| (__/ _` | || | \'  \\ ',
  ' \\___\\__,_|\\_, |_|_|_|',
  '           |__/       ',
].join('\n');

const BOOT_LINES = [
  'BIOS v2.1.4 .......................... OK',
  'Loading kernel modules ............... OK',
  'Mounting /dev/portfolio .............. OK',
  'Reading profile data ................. OK',
  'Decrypting identity .................. OK',
  '',
  '$ whoami',
  'Caym  //  he/him  //  dev + tech theatre',
  '',
];

const bootEl   = document.getElementById('boot-sequence');
const mainEl   = document.getElementById('main-content');
const asciiEl  = document.getElementById('ascii-name');
const typedEl  = document.getElementById('typed-display');
const feedback = document.getElementById('cmd-feedback');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function typeLine(text, speed = 20) {
  const div = document.createElement('div');
  bootEl.appendChild(div);
  for (const ch of text) {
    div.textContent += ch;
    if (ch !== ' ') await sleep(speed + Math.random() * 8);
  }
  await sleep(50);
}

async function runBoot() {
  for (const line of BOOT_LINES) {
    if (line === '') {
      bootEl.appendChild(document.createElement('div'));
      await sleep(120);
    } else {
      await typeLine(line, line.startsWith('$') ? 40 : 16);
    }
  }
  await sleep(400);
  bootEl.style.display = 'none';
  mainEl.classList.remove('hidden');

  asciiEl.textContent = '';
  for (const ch of ASCII_NAME) {
    asciiEl.textContent += ch;
    if (ch !== '\n' && ch !== ' ') await sleep(1);
  }
}

runBoot();

// ── Alias dropdown ──
const trigger = document.getElementById('name-trigger');
trigger.addEventListener('mouseenter', () => trigger.classList.add('open'));
trigger.addEventListener('mouseleave', () => trigger.classList.remove('open'));
trigger.addEventListener('focus',      () => trigger.classList.add('open'));
trigger.addEventListener('blur', e => {
  if (!trigger.contains(e.relatedTarget)) trigger.classList.remove('open');
});

// ── Card clicks ──
document.querySelectorAll('.section-card').forEach(card => {
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') card.click();
  });
  card.addEventListener('click', () => {
    if (card.id === 'friends-card') return;
    if (card.id === 'card-coding') window.location.href = 'coding.html';
    else if (card.id === 'card-theatre') window.location.href = 'theatre.html';
  });
});

// ── Interactive terminal input ──
let typed = '';

document.addEventListener('keydown', e => {
  // Ignore if focused on a link/button
  const tag = document.activeElement.tagName;
  if (tag === 'A' || tag === 'BUTTON') return;

  if (e.key === 'Enter') {
    handleCommand(typed.trim());
    typed = '';
    render();
  } else if (e.key === 'Backspace') {
    typed = typed.slice(0, -1);
    render();
    e.preventDefault();
  } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
    typed += e.key;
    render();
  }
});

function render() {
  typedEl.textContent = typed;
  // scroll terminal to bottom
  document.getElementById('terminal-body').scrollTop = 99999;
}

function handleCommand(cmd) {
  feedback.textContent = '';

  if (cmd === '') {
    // do nothing
  } else {
    feedback.textContent = `bash: ${cmd}: command not found`;
    feedback.style.color = '#ff5f5788';
    setTimeout(() => { feedback.textContent = ''; }, 2000);
  }
}
