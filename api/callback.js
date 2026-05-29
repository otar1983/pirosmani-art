// GitHub OAuth — step 2: კოდი გავცვალოთ access token-ზე და დავუბრუნოთ CMS-ს
module.exports = async (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const url = new URL(req.url, `https://${host}`);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const cookies = Object.fromEntries(
    (req.headers.cookie || '')
      .split(';')
      .map((c) => c.trim().split('='))
      .filter((p) => p[0])
  );

  // state cookie-ს გასუფთავება
  res.setHeader('Set-Cookie', 'oauth_state=; Max-Age=0; Path=/');

  if (!code || !state || state !== cookies.oauth_state) {
    return sendResult(res, 'error', 'ავტორიზაცია ვერ დადასტურდა (invalid state).');
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await tokenRes.json();
    if (!data.access_token) {
      return sendResult(res, 'error', data.error_description || 'access token ვერ მივიღეთ.');
    }
    return sendResult(res, 'success', { token: data.access_token, provider: 'github' });
  } catch (e) {
    return sendResult(res, 'error', String((e && e.message) || e));
  }
};

// CMS-ის popup window-სთან postMessage handshake (Decap/Sveltia პროტოკოლი)
function sendResult(res, status, content) {
  const message =
    status === 'success'
      ? `authorization:github:success:${JSON.stringify(content)}`
      : `authorization:github:error:${JSON.stringify({ message: String(content) })}`;

  const html = `<!doctype html><html><head><meta charset="utf-8"></head><body>
<script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage(${JSON.stringify(message)}, e.origin);
    window.removeEventListener('message', receiveMessage, false);
  }
  window.addEventListener('message', receiveMessage, false);
  if (window.opener) {
    window.opener.postMessage('authorizing:github', '*');
  } else {
    document.body.textContent = 'ფანჯარა გასახსნელი ვერ მოიძებნა.';
  }
})();
</script>
</body></html>`;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html);
}
