const main = document.querySelector('main')

fetch('/token')
  .then(response => response.json())
  .then(token => {
    // create headers using a fresh token
    options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token.access_token
      }
    }
    // see also: https://developer.spotify.com/documentation/web-api/reference/get-recommendations
    const url = new URL('https://api.spotify.com/v1/browse/new-releases')

    // Fetch 
    fetch(url, options)
      .then(response => response.json())
      .then(response => {
        console.log(response)
        display(response.albums?.items)
      })
      .catch(err => console.error(err))


  })


const display = (items) => {
  items.forEach(item => {
    const div = document.createElement('div')
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
    div.innerHTML =
      `${largestImg ? `<img src="${largestImg.url}" alt="${item.name}" style="max-width:100%;height:auto;" />` : ''}
      <h3>${item.name}</h3> 
      ${artists}`
    main.appendChild(div)
  })
}