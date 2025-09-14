import express from 'express'

const app = express();

// getToken(): asks Spotify for a new app-only access token using your
// CLIENT_ID and CLIENT_SECRET. Returns JSON with access_token and expiry info.
const getToken = async () => {
  const currentTimestamp = Math.floor(Date.now() / 1000)
  if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
    throw new Error('Missing CLIENT_ID or CLIENT_SECRET in environment')
  }
  console.log('Fetching new token at ' + currentTimestamp)
  // Spotify Uses Basic Authentication
  // See also: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization#basic_authentication
  const authString = Buffer
    .from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET)
    .toString('base64')

  // construct fetch headers including the authString and grant_type
  // as required by Spotify
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + authString
    },
    body: new URLSearchParams({ 'grant_type': 'client_credentials' })
  }

  const response = await fetch('https://accounts.spotify.com/api/token', options)
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error('Spotify token request failed: ' + response.status + ' ' + text)
  }
  const data = await response.json()
  data.expires_at = currentTimestamp + (data.expires_in || 0)
  console.log('Fetched new token, valid until ' + data.expires_at)
  return data
}

// Serve static files locally; Vercel ignores express.static in production and serves public/** at the edge
app.use(express.static('public'))

// In production on Vercel, requests to '/' won't be handled by express.static.
// Redirect to the static index.html which Vercel serves from public/ via the Edge Network.
// Route handler: sends the browser to /index.html so your static page loads.
app.get('/', (req, res) => {
  // Avoid Express's sendFile absolute path requirement in serverless envs
  // and let Vercel's static hosting serve /public/index.html at /index.html
  res.redirect('/index.html')
})

// Route handler /token: returns a fresh token to the frontend, with short-lived cache headers disabled.
app.get('/token', async (req, res) => {
  try {
    const freshToken = await getToken()
    // Prevent any intermediary caching
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    // Return only what the client needs
    res.json({ access_token: freshToken.access_token, expires_at: freshToken.expires_at })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to fetch token' })
  }
})


const port = 3000
// app.listen(...): starts the web server and prints a message when it's ready.
// You can then open the URL in your browser to use the app locally.
app.listen(port, () => {
  console.log(`Express is live at http://localhost:${port}`)
})
