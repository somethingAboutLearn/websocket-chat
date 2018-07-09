var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 3333 });

function noop() { }

function heartbeat() {
    this.isAlive = true
}

wss.on('connection', function (ws, req) {
    console.log('client connected ');
    console.log('user ==> ', ws.protocol)

    ws.user = ws.protocol

    ws.isAlive = true
    ws.on("pong", heartbeat)

    ws.on('message', function (message) {
        console.log(message);
        wss.broadcast(message)
    });

    ws.on("close", (e) => {
        console.log("client closed", e)
        ws.isAlive = false
    })

    ws.on("error", (error) => {
        console.log("error ==> ", error)
    })
});

wss.broadcast = function (data) {
    wss.clients.forEach(function (client) {
        client.send(data);
    });
};

const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) {
            return ws.terminate()
        }

        ws.isAlive = false;
        ws.ping(noop);
    });
}, 3000);

