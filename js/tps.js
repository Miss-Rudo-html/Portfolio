// ── Trusted Person System (TPS) v2.2.0 ──
// Set to true to re-enable the full TPS censor/unlock system
const TPS_ACTIVE = false;

(function () {
  if (!TPS_ACTIVE) return; // system on standby

  const TPS_CODE = '982128';
  const SESSION_KEY = 'tps_unlocked';

  let tpsUnlocked = sessionStorage.getItem(SESSION_KEY) === '1';

  // ── Apply / remove censors ──
  function applyCensors() {
    if (tpsUnlocked) return; // already unlocked this session

    // Face censor overlays
    // data-tps-face="full" = cover entire image (group shots)
    // data-tps-face        = cover face zone only (portraits)
    document.querySelectorAll('[data-tps-face]').forEach(wrap => {
      if (wrap.querySelector('.tps-face-censor, .tps-face-censor-full')) return;
      const censor = document.createElement('div');
      censor.className = wrap.dataset.tpsFace === 'full'
        ? 'tps-face-censor-full'
        : 'tps-face-censor';
      wrap.appendChild(censor);
    });

    // Name censors
    document.querySelectorAll('[data-tps-name]').forEach(el => {
      if (!el.dataset.tpsOriginal) {
        el.dataset.tpsOriginal = el.innerHTML;
      }
      el.classList.add('tps-name-censored');
    });
  }

  function removeCensors() {
    document.querySelectorAll('.tps-face-censor, .tps-face-censor-full').forEach(c => c.remove());
    document.querySelectorAll('[data-tps-name]').forEach(el => {
      el.classList.remove('tps-name-censored');
    });
  }

  // ── Modal logic ──
  let tpsInput = '';

  function openTPSModal() {
    tpsInput = '';
    updateDots();
    document.getElementById('tps-status').textContent = '';
    document.getElementById('tps-modal').style.display = 'flex';
  }

  function closeTPSModal() {
    document.getElementById('tps-modal').style.display = 'none';
  }

  function updateDots() {
    document.getElementById('tps-dots').textContent =
      '●'.repeat(tpsInput.length) + '○'.repeat(Math.max(0, 6 - tpsInput.length));
  }

  function unlock() {
    tpsUnlocked = true;
    sessionStorage.setItem(SESSION_KEY, '1');
    removeCensors();
    const status = document.getElementById('tps-status');
    status.textContent = '// TRUSTED — CONTENT UNLOCKED';
    status.style.color = '#00ff41';
    setTimeout(closeTPSModal, 800);
  }

  function handleEnter() {
    if (tpsInput === TPS_CODE) {
      unlock();
    } else {
      const status = document.getElementById('tps-status');
      status.textContent = '// ACCESS DENIED';
      status.style.color = '#ff5f57';
      tpsInput = '';
      updateDots();
    }
  }

  // ── Inject TPS button ──
  function injectButton() {
    // index.html: inject into terminal-bar (always visible, no overflow clipping)
    const termBar = document.getElementById('terminal-bar');
    if (termBar) {
      const tpsWrap = document.createElement('div');
      tpsWrap.id = 'tps-btn-wrap';
      tpsWrap.title = 'Trusted Person View';
      tpsWrap.innerHTML = `
        <button id="tps-icon-btn" aria-label="Trusted Person View">&#x1F464;</button>
        <span id="tps-label">Trusted Person View</span>
      `;
      tpsWrap.addEventListener('click', openTPSModal);
      termBar.appendChild(tpsWrap);
      return;
    }

    // theatre.html: inject into the topbar
    const topbar = document.getElementById('theatre-topbar');
    if (topbar) {
      const tpsBtn = document.createElement('button');
      tpsBtn.id = 'tps-topbar-btn';
      tpsBtn.title = 'Trusted Person View';
      tpsBtn.innerHTML = '&#x1F464;';
      tpsBtn.addEventListener('click', openTPSModal);
      topbar.appendChild(tpsBtn);
    }
  }

  // ── Inject modal ──
  function injectModal() {
    const modal = document.createElement('div');
    modal.id = 'tps-modal';
    modal.style.display = 'none';
    modal.innerHTML = `
      <div id="tps-box">
        <div id="tps-header">// TRUSTED PERSON ACCESS</div>
        <div id="tps-message">Some info has been redacted/censored for not only my safety but the safety of my friends. If you are my friend you can input the password to uncensor all content.</div>
        <div id="tps-dots-wrap"><span id="tps-dots">○○○○○○</span></div>
        <div id="tps-status"></div>
        <div id="tps-grid">
          <button class="kp-btn tps-kp" data-tpsval="1">1</button>
          <button class="kp-btn tps-kp" data-tpsval="2">2</button>
          <button class="kp-btn tps-kp" data-tpsval="3">3</button>
          <button class="kp-btn tps-kp" data-tpsval="4">4</button>
          <button class="kp-btn tps-kp" data-tpsval="5">5</button>
          <button class="kp-btn tps-kp" data-tpsval="6">6</button>
          <button class="kp-btn tps-kp" data-tpsval="7">7</button>
          <button class="kp-btn tps-kp" data-tpsval="8">8</button>
          <button class="kp-btn tps-kp" data-tpsval="9">9</button>
          <button class="kp-btn kp-clear" id="tps-clear">CLR</button>
          <button class="kp-btn tps-kp" data-tpsval="0">0</button>
          <button class="kp-btn kp-enter" id="tps-enter">ENT</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelectorAll('[data-tpsval]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (tpsInput.length >= 6) return;
        tpsInput += btn.dataset.tpsval;
        updateDots();
      });
    });
    document.getElementById('tps-clear').addEventListener('click', () => { tpsInput = ''; updateDots(); });
    document.getElementById('tps-enter').addEventListener('click', handleEnter);
    modal.addEventListener('click', e => { if (e.target === modal) closeTPSModal(); });
  }

  function init() {
    injectButton();
    injectModal();
    applyCensors();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.tpsOpen = openTPSModal;
})();
