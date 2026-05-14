const CONFIG = {
  clientId:    'b871e062-cdbf-417c-8e91-6d23d0189ce5',
  tenantId:    'REPLACE_WITH_TENANT_ID',
  apiClientId: 'b871e062-cdbf-417c-8e91-6d23d0189ce5',
  apiUrl:      'https://func-nygdev-logger.azurewebsites.net/api/HttpTrigger',
};

const msalInstance = new msal.PublicClientApplication({
  auth: {
    clientId:    CONFIG.clientId,
    authority:   `https://login.microsoftonline.com/${CONFIG.tenantId}`,
    redirectUri: window.location.origin + window.location.pathname,
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
});

const loginRequest = {
  scopes: [`api://${CONFIG.apiClientId}/user_impersonation`],
};

// ── DOM refs ──────────────────────────────────────────────────────────────────

const loginView  = document.getElementById('login-view');
const logView    = document.getElementById('log-view');
const userInfo   = document.getElementById('user-info');
const userName   = document.getElementById('user-name');
const btnLogin   = document.getElementById('btn-login');
const btnLogout  = document.getElementById('btn-logout');
const btnSubmit  = document.getElementById('btn-submit');
const form       = document.getElementById('session-form');
const statusEl   = document.getElementById('status');

// ── Auth ──────────────────────────────────────────────────────────────────────

async function acquireToken() {
  const account = msalInstance.getAllAccounts()[0];
  try {
    const result = await msalInstance.acquireTokenSilent({ ...loginRequest, account });
    return result.accessToken;
  } catch {
    const result = await msalInstance.acquireTokenPopup(loginRequest);
    return result.accessToken;
  }
}

function showLoggedIn(account) {
  loginView.style.display = 'none';
  logView.style.display   = 'flex';
  userInfo.hidden          = false;
  userName.textContent     = account.name ?? account.username;
}

function showLoggedOut() {
  loginView.style.display = '';
  logView.style.display   = 'none';
  userInfo.hidden          = true;
}

// ── UI helpers ────────────────────────────────────────────────────────────────

function setStatus(msg, type = 'info') {
  statusEl.textContent  = msg;
  statusEl.className    = type;
}

// ── Event handlers ────────────────────────────────────────────────────────────

btnLogin.addEventListener('click', () => msalInstance.loginRedirect(loginRequest));

btnLogout.addEventListener('click', () =>
  msalInstance.logoutRedirect({ postLogoutRedirectUri: window.location.href })
);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  btnSubmit.disabled = true;
  setStatus('Sending…');

  const body = {
    exercise: document.getElementById('exercise').value.trim(),
    sets:     document.getElementById('sets').value.trim(),
    notes:    document.getElementById('notes').value.trim(),
    loggedAt: new Date().toISOString(),
  };

  try {
    const token    = await acquireToken();
    const response = await fetch(CONFIG.apiUrl, {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    setStatus(`Logged ✓  (id: ${data.id})`, 'ok');
    form.reset();
  } catch (err) {
    setStatus(`Failed: ${err.message}`, 'error');
  } finally {
    btnSubmit.disabled = false;
  }
});

// ── Boot ──────────────────────────────────────────────────────────────────────

(async () => {
  await msalInstance.initialize();

  const redirectResult = await msalInstance.handleRedirectPromise();
  if (redirectResult) {
    showLoggedIn(redirectResult.account);
    return;
  }

  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    showLoggedIn(accounts[0]);
  } else {
    showLoggedOut();
  }
})();
