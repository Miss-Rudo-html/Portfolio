// Shared keypad — used on profile pages to lock theatre access
(function () {
  const CODE = '9898';
  const modal  = document.getElementById('keypad-modal');
  const dots   = document.getElementById('keypad-dots');
  const status = document.getElementById('keypad-status');
  if (!modal) return;

  let input = '';
  let onSuccess = null;

  function updateDots() {
    const filled = '●'.repeat(input.length);
    const empty  = '○'.repeat(Math.max(0, 4 - input.length));
    dots.textContent = filled + empty;
  }

  function openKeypad(successCb) {
    onSuccess = successCb;
    input = '';
    updateDots();
    status.textContent = '';
    status.className = '';
    modal.classList.add('open');
  }

  function closeKeypad() {
    modal.classList.remove('open');
  }

  document.querySelectorAll('.kp-btn[data-val]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (input.length >= 4) return;
      input += btn.dataset.val;
      updateDots();
      status.textContent = '';
      status.className = '';
    });
  });

  document.getElementById('kp-clear').addEventListener('click', () => {
    input = '';
    updateDots();
    status.textContent = '';
    status.className = '';
  });

  document.getElementById('kp-enter').addEventListener('click', () => {
    if (input === CODE) {
      status.textContent = '// ACCESS GRANTED';
      status.className = 'success';
      setTimeout(() => { closeKeypad(); if (onSuccess) onSuccess(); }, 600);
    } else {
      status.textContent = '// ACCESS DENIED';
      status.className = 'error';
      document.getElementById('keypad-box').classList.add('shake');
      setTimeout(() => document.getElementById('keypad-box').classList.remove('shake'), 400);
      input = '';
      updateDots();
    }
  });

  modal.addEventListener('click', e => { if (e.target === modal) closeKeypad(); });

  // Expose openKeypad globally so the profile JS can call it
  window.openKeypad = openKeypad;
})();
