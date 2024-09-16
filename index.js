import express from 'express' 

let token = {}

const app = express();

const getToken = async () => {
  let currentTimestamp = Math.floor(Date.now() / 1000)  
  console.log('Current time is '+currentTimestamp)
  if (currentTimestamp < token.expires_at){
    console.log('Using Existing Token, valid until '+token.expires_at)
    return token
  }
  else{
    console.log('Fetching new token.') 
     // Spotify Uses Basic Authentication 
    //  so we have to encode the ID and Secret with base64
    // See also: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization#basic_authentication
    let authString = Buffer
      .from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET)
      .toString('base64')
  
    // construct fetch headers including the authString and grant_type
    // as required by Spotify
    const options = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic '+authString
      },
      body: new URLSearchParams({'grant_type': 'client_credentials'})
    }
    // request a token from Spotify 
    let response = await fetch('https://accounts.spotify.com/api/token', options)
    token = await response.json() 
    token.expires_at = currentTimestamp + token.expires_in 
    console.log('Fetched new token, valid until ' + token.expires_at )
    return token  
  }
}


app.use(express.static( 'public'))
 
app.get('/token', async (req, res) => {    
   let freshToken = await getToken()
   res.send(freshToken)
})


// Start listening for requests.
app.listen(process.env.PORT,()=>{
  console.log("Express is live.")
})
