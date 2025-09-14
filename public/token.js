// Client-side token caching   

// getFromStorage(): tries to read a saved token from localStorage and
// checks if it's still valid (not close to expiry). Returns the token object or null.
function getFromStorage() {
  try {
    const raw = localStorage.getItem('spotify_token')
    if (!raw) return null
    const token = JSON.parse(raw)
    const now = Math.floor(Date.now() / 1000)
    if (token?.expires_at && now < (token.expires_at - 60)) return token
    return null
  } catch {
    return null
  }
}

// saveToStorage(token): stores the token in localStorage and computes an
// absolute expiry time if only expires_in (seconds) was provided.
function saveToStorage(token) {
  try {
    if (!token.expires_at && token.expires_in) {
      token.expires_at = Math.floor(Date.now() / 1000) + token.expires_in
    }
    localStorage.setItem('spotify_token', JSON.stringify(token))
  } catch { }
}

// getToken(): returns a valid token. It first tries local cache and
// if missing/expired, calls the server /token endpoint to get a fresh one.
async function getToken() {
  const cached = getFromStorage()
  if (cached) return cached
  const res = await fetch('/token', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch token')
  const token = await res.json()
  saveToStorage(token)
  return token
}

export { getToken }
