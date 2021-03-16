var redirectUri = 'https://ktmrose.github.io';
var clientId = "";
var clientSec = "";

const scopes = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'playlist-modify-public',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
];

const AUTHORIZE = "https://accounts.spotify.com/authorize";

function getcode() {
    let code = null;
    const queryString = window.location.search;
    if (queryString.length > 0) {
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
    }
    console.log(code);
    return code;
}

function handleRedirect() {
    let code = getcode();
}

function onPageLoad() {
    if (window.location.search.length > 0) {
        handleRedirect();
    }
}

function requestAuthorization() {
    clientId = document.getElementById("clientId").value;
    clientSec = document.getElementById("clientSecret").value;
    localStorage.setItem("client_id", clientId);
    localStorage.setItem("client_sec", clientSec);

    let url = AUTHORIZE;
    url += "?client_id=" + clientId;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirectUri);
    url += "&show_dialog=true";

    let scopeString = "";
    scopes.forEach( scope => scopeString += (scope + " "));
    url += "&scope=" + scopeString;

    window.location.href = url;
}