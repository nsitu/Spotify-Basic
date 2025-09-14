// Client-side token caching 
const TOKEN_KEY = 'spotify_token'
const SKEW = 60 // seconds of clock skew

function getFromStorage() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY)
    if (!raw) return null
    const token = JSON.parse(raw)
    const now = Math.floor(Date.now() / 1000)
    if (token?.expires_at && now < (token.expires_at - SKEW)) return t
    return null
  } catch {
    return null
  }
}

function saveToStorage(token) {
  try {
    if (!token.expires_at && token.expires_in) {
      token.expires_at = Math.floor(Date.now() / 1000) + token.expires_in
    }
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token))
  } catch { }
}

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
