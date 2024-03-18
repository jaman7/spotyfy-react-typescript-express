require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const lyricsFinder = require("lyrics-finder")
const SpotifyWebApi = require("spotify-web-api-node")

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 5174;



app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then(data => {
      return res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch(err => {
      res.sendStatus(400);
    })
});

app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });



  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      return res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch(err => {
      res.sendStatus(400);
    })
});

app.get("/lyrics", async (req, res) => {
  const lyrics =
    (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found";
  res.json({ lyrics });
});

app.post("/me", async (req, res) => {
    const code = req.body.token;
    const spotifyApi = new SpotifyWebApi({clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET});
    spotifyApi.setAccessToken(code);
    spotifyApi.getMe().then(data => res.json(data.body)).catch(err => { res.sendStatus(400);});
});

app.post("/me/tracks", async (req, res) => {
    const code = req.body.token;
    const spotifyApi = new SpotifyWebApi({clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET});
    spotifyApi.setAccessToken(code);
    spotifyApi.getMySavedTracks({limit: 50, locale: 'pl_PL'}).then(data => res.json(data.body)).catch(err => { res.sendStatus(400);});
});

app.post("/me/player/recently-played", async (req, res) => {
  const code = req.body.token;
  const spotifyApi = new SpotifyWebApi({clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET});
  spotifyApi.setAccessToken(code);
  spotifyApi.getMyRecentlyPlayedTracks().then(data => res.json(data.body)).catch(() =>  res.sendStatus(400));
});

app.post("/users/:userId/playlists", async (req, res) => {
  const code = req.body.token;
  const spotifyApi = new SpotifyWebApi({clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET});
  spotifyApi.setAccessToken(code);
  spotifyApi.getUserPlaylists().then(data => res.json(data.body)).catch(() =>  res.sendStatus(400));
});

app.post("/users/:userId/playlists/:playlistId/tracks", async (req, res) => {
  const code = req.body.token;
  const playlistId = req.params.playlistId;
  const spotifyApi = new SpotifyWebApi({clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET});
  spotifyApi.setAccessToken(code);
  spotifyApi.getPlaylistTracks(playlistId).then(data => res.json(data.body)).catch(() =>  res.sendStatus(400));
});

app.get("/search", async (req, res) => {
  const {token, q, type} = req.query
  const spotifyApi = new SpotifyWebApi({clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET});
  spotifyApi.setAccessToken(token);
  spotifyApi.searchTracks(q, {type: type}).then(data => res.json(data.body)).catch(() =>  res.sendStatus(400));
});

app.post("/me/albums", async (req, res) => {
  const code = req.body.token;
  const spotifyApi = new SpotifyWebApi({clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET});
  spotifyApi.setAccessToken(code);
  spotifyApi.getMySavedAlbums().then(data => res.json(data.body)).catch(() =>  res.sendStatus(400));
});

app.post("/album/:albumid", async (req, res) => {
  const code = req.body.token;
  const albumid = req.params.albumid;
  const spotifyApi = new SpotifyWebApi({clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET});
  spotifyApi.setAccessToken(code);
  spotifyApi.getAlbum(albumid).then(data => res.json(data.body)).catch(() =>  res.sendStatus(400));
});

app.post("/albums", async (req, res) => {
  const code = req.body.token;
  const albumsIds = req.body.albumsIds;
  const spotifyApi = new SpotifyWebApi({clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET});
  spotifyApi.setAccessToken(code);
  spotifyApi.getAlbums(albumsIds).then(data => res.json(data.body)).catch(() =>  res.sendStatus(400));
});

app.post("/artist/:artistid", async (req, res) => {
  const code = req.body.token;
  const artistid = req.params.artistid;
  const spotifyApi = new SpotifyWebApi({clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET});
  spotifyApi.setAccessToken(code);
  spotifyApi.getArtist(artistid).then(data => res.json(data.body)).catch(() =>  res.sendStatus(400));
});

app.post("/artist/:artistId/albums", async (req, res) => {
  const code = req.body.token;
  const artistId = req.params.artistId;
  const spotifyApi = new SpotifyWebApi({clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET});
  spotifyApi.setAccessToken(code);
  spotifyApi.getArtistAlbums(artistId).then(data => res.json(data.body)).catch(() =>  res.sendStatus(400));
});

app.post("/artist/:artistId/tracks", async (req, res) => {
  const code = req.body.token;
  const artistId = req.params.artistId;
  const spotifyApi = new SpotifyWebApi({clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET});
  spotifyApi.setAccessToken(code);
  spotifyApi.getArtistTopTracks(artistId).then(data => res.json(data.body)).catch(() =>  res.sendStatus(400));
});

app.post("/browse/new-releases", async (req, res) => {
  const code = req.body.token;
  const spotifyApi = new SpotifyWebApi({clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET});
  spotifyApi.setAccessToken(code);
  spotifyApi.getNewReleases({limit: 50, locale: 'pl_PL'}).then(data => res.json(data.body)).catch(() =>  res.sendStatus(400));
});

app.post("/browse/featured-playlists", async (req, res) => {
  const code = req.body.token;
  const spotifyApi = new SpotifyWebApi({clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET});
  spotifyApi.setAccessToken(code);
  spotifyApi.getFeaturedPlaylists({limit: 50, locale: 'pl_PL'}).then(data => res.json(data.body)).catch(() =>  res.sendStatus(400));
});

app.post("/browse/categories", async (req, res) => {
  const code = req.body.token;
  const offset= req.body.offset;
  const spotifyApi = new SpotifyWebApi({clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET});
  spotifyApi.setAccessToken(code);
  spotifyApi.getCategories({limit: 50, offset, locale: 'pl_PL'}).then(data => res.json(data.body)).catch(() =>  res.sendStatus(400));
});

app.post("/browse/categories/:categoryId/playlists", async (req, res) => {
  const code = req.body.token;
  const categoryId = req.params.categoryId;
  const spotifyApi = new SpotifyWebApi({clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET});
  spotifyApi.setAccessToken(code);
  spotifyApi.getPlaylistsForCategory(categoryId, {limit: 50, locale: 'pl_PL'}).then(data => res.json(data.body)).catch(() =>  res.sendStatus(400));
});

app.post("/playlists/:playlistsId/tracks", async (req, res) => {
  const code = req.body.token;
  const playlistsId = req.params.playlistsId;
  const spotifyApi = new SpotifyWebApi({clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET});
  spotifyApi.setAccessToken(code);
  spotifyApi.getPlaylistTracks(playlistsId).then(data => res.json(data.body)).catch(() =>  res.sendStatus(400));
});

app.listen(PORT);
