var redirectUri = 'https://ktmrose.github.io';
var clientId = "";
var clientSec = "";
var access_token = null;
var refresh_token = null;

const scopes = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'playlist-modify-public',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'streaming',
    'user-read-email',
    'user-read-private'
];

const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
const PLAY = "https://api.spotify.com/v1/me/player/play";
const QUEUE = "https://api.spotify.com/v1/me/player/queue";
const SKIP = "https://api.spotify.com/v1/me/player/next";
const PLAYBACKSTATE = "https://api.spotify.com/v1/me/player";

function getAuthCode() {
    let code = null;
    const queryString = window.location.search;

    if (queryString.length > 0) {
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
    }
    return code;
}

function handleAuthorizationResponse() {
    if (this.status === 200) {
        var data = JSON.parse(this.responseText);

        if (data.access_token !== undefined) {
            access_token = data.access_token;
            sessionStorage.setItem("access_token", access_token);
        }
        if (data.refresh_token !== undefined) {
            refresh_token = data.refresh_token;
            sessionStorage.setItem("refresh_token", refresh_token);
        }
        onPageLoad();
    } else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function callAuthorizationApi(body) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(clientId + ":" + clientSec));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function refreshAccessToken() {
    refresh_token = sessionStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + clientId;
    callAuthorizationApi(body);
}

function callSpotifyApi(method, url, body, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;
}

function fetchAccessToken(code) {
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirectUri);
    body += "&client_id=" + clientId;
    body += "&client_secret=" + clientSec;
    callAuthorizationApi(body);
}

function handleRedirect() {
    let code = getAuthCode();
    fetchAccessToken(code);
    window.history.pushState("", "", redirectUri);
}

function handleSongAddition() {
    if (this.status == 204) {
        console.log("Check your queue to see if your song was added.");
    } else if (this.status == 404) {
        console.log("Device not found");
    } else {
        console.log(this.responseText);
    }
}

function addSongToQ(){

    let songId;
    songId = document.getElementById("track").value;
    if (songId !== undefined) {
        pushSongToQ(songId);
    }
}

function pushSongToQ(trackID) {

    callSpotifyApi("POST", QUEUE + "?uri=spotify%3Atrack%3A"+ trackID, null, handleSongAddition);
}

function playQ() {

}

/**
 * When page loads, checks session storage for client ID and client Secret. If none, displays html
 * that prompts the user for these. Then checks if access token is in session storage.
 */
function onPageLoad() {
    clientId = sessionStorage.getItem("client_id");
    clientSec = sessionStorage.getItem("client_secret");
    if (window.location.search.length > 0) {
        handleRedirect();
    } else {
        access_token = sessionStorage.getItem("access_token");
        if (access_token == null) {
            document.getElementById("tokenSection").style.display = 'block';
        } else {
            document.getElementById("songSelection").style.display = 'block';
            // addSongToQ();
            // refreshPlaylists();
            // currentlyPlaying();
        }
    }
}

function requestAuthorization() {
    clientId = document.getElementById("clientId").value;
    clientSec = document.getElementById("clientSecret").value;
    sessionStorage.setItem("client_id", clientId);
    sessionStorage.setItem("client_secret", clientSec);

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