import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import pkg from '@next/env';
const { loadEnvConfig } = pkg;

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url || '', true);
      handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Global instance for API routes if needed, or simply handle events here.
  // In a real app we might use Redis adapter here:
  // const { createAdapter } = require('@socket.io/redis-adapter');
  // const { createClient } = require('redis');
  // const pubClient = createClient({ url: 'redis://localhost:6379' });
  // const subClient = pubClient.duplicate();
  // Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  //   io.adapter(createAdapter(pubClient, subClient));
  // });

  io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    // Listen for new journal entries to broadcast
    socket.on('new_journal_entry', (data) => {
      console.log('New journal entry received:', data.transactionId);
      socket.broadcast.emit('journal_posted', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
