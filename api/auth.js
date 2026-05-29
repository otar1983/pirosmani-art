// GitHub OAuth — step 1: გადავამისამართოთ მომხმარებელი GitHub-ის ავტორიზაციაზე
const crypto = require('crypto');

module.exports = (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.statusCode = 500;
    res.end('GITHUB_CLIENT_ID environment variable is not set on Vercel.');
    return;
  }

  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const redirectUri = `https://${host}/callback`;
  const state = crypto.randomBytes(16).toString('hex');

  // CSRF დაცვა: state ვინახავთ cookie-ში და callback-ზე ვამოწმებთ
  res.setHeader('Set-Cookie', `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'repo',
    state,
  });

  res.statusCode = 302;
  res.setHeader('Location', `https://github.com/login/oauth/authorize?${params.toString()}`);
  res.end();
};
