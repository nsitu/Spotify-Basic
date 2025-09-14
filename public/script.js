import { getToken } from './token.js'

// fetchNewReleases(token): asks Spotify for the latest album releases using your access token.
// Input: token string from getToken(). Output: a fetch() Response you can parse.
async function fetchNewReleases(token) {
  const url = new URL('https://api.spotify.com/v1/browse/new-releases')
  return fetch(url, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token }
  })
}

// display(items): takes an array of album objects and adds them to the page.
// It picks the largest available image, shows the album name, and links to the artists.
const display = (items) => {
  items.forEach(item => {
    // Find the largest image (highest width)
    let largestImg = null;
    if (item.images && item.images.length > 0) {
      largestImg = item.images.reduce((max, img) => img.width > max.width ? img : max, item.images[0]);
    }
    // List contributing artists
    let artists = '';
    if (item.artists && item.artists.length > 0) {
      artists = '<p>Artists: ' + item.artists.map(a => `<a href="${a.external_urls.spotify}" target="_blank">${a.name}</a>`).join(', ') + '</p>';
    }
    const div = document.createElement('div')
    div.innerHTML =
      `${largestImg ? `<img src="${largestImg.url}" alt="${item.name}" style="max-width:100%;height:auto;" />` : ''}
      <h3>${item.name}</h3> 
      ${artists}`
    document.querySelector('main').appendChild(div)
  })
}

// Main script logic: get a token, fetch new releases, display them.
try {
  let token = await getToken()
  let response = await fetchNewReleases(token.access_token)

  // If token is invalid/expired server-side, refresh and retry once
  if (response.status === 401) {
    localStorage.removeItem('spotify_token')
    token = await getToken()
    response = await fetchNewReleases(token.access_token)
  }
  const json = await response.json()
  console.log(json)
  display(json.albums?.items || [])
} catch (err) {
  console.error(err)
}

