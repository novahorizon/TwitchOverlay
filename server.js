const http = require("http");
var os = require("os");
var fs = require("fs");

const host = "127.0.0.1";
const port = 8080;
const streamer = "" //left blank for Git

let main;
fs.readFile(__dirname + "/overlay.html", 'utf8', (err, data) => {main = data;});


let dataSource = -100;
let newtimer = false;

const requestListener = function (req, res) {
    if (req.url === '/') {
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("connection", "keep-alive");
    res.setHeader("Content-Type", "text/html");
    res.end(main);
    console.log(main);
    } else {
        console.log(`bad request: ${req.url}`);
        res.statusCode = 404;
        res.end();
    }
};


const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8079});

wss.on('connection', (ws) => {
    setInterval(() => {
        if (newtimer) {
            newtimer = false;
            const data = JSON.stringify({ timer: dataSource });
            ws.send(data);
    }}, 100);
});


const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`server running at http://${host}:${port}`);
});

const tmi = require('tmi.js');
const { json } = require("stream/consumers");
const { createHash } = require("crypto");

const client = new tmi.Client({
	channels: [streamer]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    let streamer = false;
    let mod = false;
    if (tags['badges']) {
    if (tags['badges']['broadcaster']) streamer = true;
    if (tags['badges']['moderator']) mod = true;
    }
	console.log(`${streamer}: ${mod}: ${tags['display-name']}: ${message}`);
    if (mod || streamer){
        let msg = message.split(" ");
        if (msg[0] == "!timer"){
            dataSource = parseInt(msg[1]);
            console.log(`activating timer for ${msg[1]} seconds.`)
            newtimer = true;
        }
    }
});
