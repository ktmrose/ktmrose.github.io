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
];

const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";

function getcode() {
    let code = null;
    const queryString = window.location.search;
    if (queryString.length > 0) {
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
    }
    // console.log(code);
    return code;
}

function handleAuthorizationResponse() {
    if (this.status === 200) {

        var data = JSON.parse(this.responseText);
        if (data.access_token !== undefined) {
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if (data.refresh_token !== undefined) {
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
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

function fetchAccessToken(code) {
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirectUri);
    body += "&client_id=" + clientId;
    body += "&client_secret=" + clientSec;
    callAuthorizationApi(body);
}

function handleRedirect() {
    let code = getcode();
    fetchAccessToken(code);
    window.history.pushState("", "", redirectUri);
}

function onPageLoad() {
    clientId = localStorage.getItem("client_id");
    clientSec = localStorage.getItem("client_secret");
    if (window.location.search.length > 0) {
        handleRedirect();
    } else {
        access_token = localStorage.getItem("access_token");
        if (access_token == null) {
            document.getElementById("tokenSection").style.display = 'block';
        } else {

        }
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