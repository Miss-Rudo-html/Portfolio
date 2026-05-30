const ASCII_NAME = [
  ' ____            _          ',
  '|  _ \\ _   _  __| | ___   _',
  '| |_) | | | |/ _` |/ _ \\ (_)',
  '|  _ <| |_| | (_| | (_) |   ',
  '|_| \\_\\__,_|\\__,_|\\___/ ___',
  '                        |___|',
].join('\n');

const BOOT_LINES = [
  'BIOS v2.1.4 .......................... OK',
  'Loading kernel modules ............... OK',
  'Mounting /dev/portfolio .............. OK',
  'Reading profile data ................. OK',
  'Decrypting identity .................. OK',
  '',
  '$ whoami',
  'Rudo_  //  she/her  //  dev + tech theatre',
  '',
];

const bootEl    = document.getElementById('boot-sequence');
const mainEl    = document.getElementById('main-content');
const asciiEl   = document.getElementById('ascii-name');

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

  // Type ASCII name fast
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
trigger.addEventListener('blur',       (e) => {
  if (!trigger.contains(e.relatedTarget)) trigger.classList.remove('open');
});
trigger.addEventListener('keydown', e => {
  if (e.key === 'Escape') trigger.classList.remove('open');
});

// ── Card click → append command ──
document.querySelectorAll('.section-card').forEach(card => {
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') card.click();
  });
  card.addEventListener('click', () => {
    if (card.id === 'friends-card') return;
    if (card.id === 'card-coding') {
      window.location.href = 'coding.html';
    } else if (card.id === 'card-theatre') {
      window.location.href = 'theatre.html';
    }
  });
});

// ── Interactive terminal input ──
const typedEl  = document.getElementById('typed-display');
const feedback = document.getElementById('cmd-feedback');
let typed = '';

document.addEventListener('keydown', e => {
  const tag = document.activeElement.tagName;
  if (tag === 'A' || tag === 'BUTTON') return;
  if (mainEl.classList.contains('hidden')) return;

  if (e.key === 'Enter') {
    handleCommand(typed.trim());
    typed = '';
    renderTyped();
  } else if (e.key === 'Backspace') {
    typed = typed.slice(0, -1);
    renderTyped();
    e.preventDefault();
  } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
    typed += e.key;
    renderTyped();
  }
});

function renderTyped() {
  typedEl.textContent = typed;
  document.getElementById('terminal-body').scrollTop = 99999;
}

function handleCommand(cmd) {
  feedback.textContent = '';
  if (cmd.toLowerCase() === 'caym') {
    feedback.textContent = '// access granted — switching profile...';
    feedback.style.color = '#00ff41';
    setTimeout(() => { window.location.href = 'secret.html'; }, 700);
  } else if (cmd === '') {
    // nothing
  } else {
    feedback.textContent = `bash: ${cmd}: command not found`;
    feedback.style.color = '#ff5f5788';
    setTimeout(() => { feedback.textContent = ''; }, 2000);
  }
}

function appendCommand(cmd) {
  const promptEl = document.querySelector('.prompt-line');
  const body     = document.getElementById('terminal-body');

  const p = document.createElement('p');
  p.className = 'prompt-line';
  p.innerHTML = `<span class="prompt-sym">visitor@portfolio:~$</span> <span class="cmd">${cmd}</span>`;
  body.insertBefore(p, promptEl);

  const reply = document.createElement('p');
  reply.style.cssText = 'font-size:.78rem;color:#00c832;margin-top:.3rem;';
  reply.textContent = '[ section coming soon — check back later ]';
  body.insertBefore(reply, promptEl);

  document.getElementById('cursor-line').innerHTML = ' <span class="cursor">█</span>';
  body.scrollTop = body.scrollHeight;
}
