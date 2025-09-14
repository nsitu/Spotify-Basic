# Spotify Basic
This demo shows how we can connect to the [Spotify API](https://developer.spotify.com/) using the [Client Credentials](https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow) OAuth flow. 

## Backend
The backend `server.js` uses a simple [Express](https://expressjs.com) app to publish a `/token` endpoint. It exposes a fresh Spotify Token on demand. It does this by forwarding the token request to Spotify. It assumes that we will store our spotify credentials as server environment variables. 

## Frontend
The frontend lives in the `/public` folder. It includes scripts for fetching and caching a token via the backend `/token` endpoint. It hits the Spotify latest releases endpoint directly, passing the Token along in the Headers. 

## Environment Variables
Be sure to add server environment variables for your Spotify `CLIENT_ID` and `CLIENT_SECRET` so that a fresh token can be fetched when needed. You can find these credentials in your Spotify Developer dashboard. For example, you might paste these as key value pairs at the end of your `.env` file so that NodeJS can find them. It might look something like this:
```
CLIENT_ID=abc123***
CLIENT_SECRET=abc123***
```

## Vercel 
This project hsa been setup for compatibility with Vercel. [Read more](https://vercel.com/docs/frameworks/backend/express) about how Express apps are hosted on Vercel. 

