const scopes = [
  'streaming',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'user-read-recently-played',
  'playlist-modify-private',
  'ugc-image-upload',
  'user-follow-modify',
  'user-follow-read',
  'user-library-modify',
  'user-library-read',
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-read-playback-state',
  'user-modify-playback-state',
];

const Login = () => {
  const { SPOTIFY_URL, CLIENT_ID, REDIRECT_URL } = process.env || {};
  const AUTH_URL = `${SPOTIFY_URL}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URL}&scope=${scopes.join('%20')}`;

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <a className="btn btn-success btn-lg" href={AUTH_URL}>
        Login With Spotify
      </a>
    </div>
  );
};

export default Login;
