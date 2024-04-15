import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';

const server = http.createServer();
const wss = new WebSocketServer({ noServer: true });
const wssGet = new WebSocketServer({ noServer: true });
const wssPost = new WebSocketServer({ noServer: true});
const wssDelete = new WebSocketServer({ noServer: true});
const port = 8000;

let messages = [
  'Hello from server!',
  'This is another message from the server.',
];

wssGet.on('connection', function connection(ws) {
  ws.on('error', console.error);

  console.log('[SERVER GET]');

  ws.send(JSON.stringify(messages));

  ws.on('close', () => {
    console.log('[SERVER GET] Disconnected.');
  });
});

wssPost.on('connection', function connection(ws) {
  ws.on('error', console.error);

  console.log('[SERVER POST] Connected');

  ws.on('message', (message) => {
    console.log('[SERVER POST] Messages old:', messages);
    messages.push(JSON.parse(message));
    console.log('[SERVER POST] Messages new:', messages);
  });

  ws.on('close', () => {
    console.log('[SERVER POST] Disconnected.');
  });
});

wssDelete.on('connection', function connection(ws) {
  ws.on('error', console.error);

  console.log('[SERVER DELETE] Connected');

  ws.on('message', (message) => {
    console.log('[SERVER DELETE] Messages old:', messages);
    messages.filter((msg) => msg !== message);
    console.log('[SERVER DELETE] Messages new:', messages);
  });

  ws.on('close', () => {
    console.log('[SERVER DELETE] Disconnected.');
  });
});

server.on('upgrade', function(request, socket, head) {
  const { pathname } = new URL(request.url, 'ws://localhost' + port);
  console.log('[SERVER] Request URL:', pathname);

  if (pathname === '/get' ) {
    wssGet.handleUpgrade(request, socket, head, function done(ws) {
      wssGet.emit('connection', ws, request);
    });
  }

  if (pathname === '/post' ) {
    wssPost.handleUpgrade(request, socket, head, function done(ws) {
      wssPost.emit('connection', ws, request);
    });
  }

  if (pathname === '/delete' ) {
    wssDelete.handleUpgrade(request, socket, head, function done(ws) {
      wssDelete.emit('connection', ws, request);
    });
  }
});

server.listen(port, 'localhost', () => {
  console.log(`[SERVER] Listening on port ${port}`);
});
