const CLIENT_ID = 'b871e062-cdbf-417c-8e91-6d23d0189ce5';
const TENANT_ID = 'REPLACE_WITH_TENANT_ID';
const API_URL   = 'https://func-nygdev-logger.azurewebsites.net/api/HttpTrigger';

const msal = new PublicClientApplication({
  auth: {
    clientId:    CLIENT_ID,
    authority:   `https://login.microsoftonline.com/${TENANT_ID}`,
    redirectUri: window.location.origin + window.location.pathname,
  },
});

const scopes = [`api://${CLIENT_ID}/user_impersonation`];

const btn    = document.getElementById('btn');
const status = document.getElementById('status');

async function getToken() {
  const [account] = msal.getAllAccounts();
  try {
    return (await msal.acquireTokenSilent({ scopes, account })).accessToken;
  } catch {
    return (await msal.acquireTokenPopup({ scopes })).accessToken;
  }
}

async function log() {
  btn.disabled  = true;
  status.textContent = 'Sending…';
  try {
    const token = await getToken();
    const res   = await fetch(API_URL, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ header: 'value' }),
    });
    const data = await res.json();
    status.textContent = res.ok ? `OK — ${JSON.stringify(data)}` : `Error ${res.status}`;
  } catch (e) {
    status.textContent = e.message;
  } finally {
    btn.disabled = false;
  }
}

(async () => {
  await msal.initialize();
  await msal.handleRedirectPromise();

  if (msal.getAllAccounts().length) {
    btn.textContent  = 'Log session';
    btn.onclick      = log;
  } else {
    btn.textContent  = 'Sign in';
    btn.onclick      = () => msal.loginRedirect({ scopes });
  }
})();
