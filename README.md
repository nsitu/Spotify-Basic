# Spotify Auth Demo
[![Open in Coder](https://ixdcoder.com/open-in-coder.svg)](https://ixdcoder.com/templates/Node/workspace?name=Spotify&mode=auto&param.git_repo=https://bender.sheridanc.on.ca/system-design/spotify)

## About
This demo shows how we can connect to the [Spotify API](https://developer.spotify.com/) using the [Client Credentials](https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow) OAuth flow. The backend (NodeJS) provides an up-to-date Token for the frontend (in the public folder). so that requests can be made from Spotify. 

## Environment Variables
Be sure to add environment variables for your Spotify `CLIENT_ID` and `CLIENT_SECRET` so that a fresh token can be fetched when needed. You can find these credentials in your Spotify Developer dashboard. For example, you might paste these as key value pairs at the end of your `.env` file so that NodeJS can find them. It might look something like this:
```
CLIENT_ID=abc123***
CLIENT_SECRET=abc123***
```


