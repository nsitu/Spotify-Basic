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
      const url = new URL('https://api.spotify.com/v1/recommendations')
      url.searchParams.set('seed_artists', '4NHQUGzhtTLFvgF5SZesLK')
      url.searchParams.set('seed_genres','classical,country')
      url.searchParams.set('seed_tracks','0c6xIDDpzE81m2q797ordA')
    
    // Fetch 
    fetch(url, options)
      .then(response => response.json()) 
      .then(response => { 
        console.log(response)
        display(response.tracks) 
      })
      .catch(err => console.error(err))
     
      
  })


 const display = (tracks) => { 
    tracks.forEach(track =>{
      const div = document.createElement('div')
      div.innerHTML = 
        `<h3>${track.name}</h3>
        <p>Popularity: ${track.popularity}</p>`
      main.appendChild(div)
    })
 }