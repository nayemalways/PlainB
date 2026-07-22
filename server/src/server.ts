import mongoose from 'mongoose';
import type { Server } from 'node:http';
import { DATABASE_URL, PORT } from './app/config/config.ts';
import app from './app.ts';
import { seedAdmin } from './app/utility/seedAdmin.ts';

let server: Server | undefined;

const bootstrap = async () => {
  console.log('Hello');
  await mongoose.connect(DATABASE_URL);
  console.log('Database Connected!');
  await seedAdmin();
  server = app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`));
  console.log('Server started');
};

bootstrap();

// SIGTERM signal detected and close the server
process.on('SIGTERM', () => {
  console.log('SIGTERM SIGNAL FOUND and server shutting down...');

  if (server) {
    server.close(() => {
      // server closing
      console.log('server closed');
      process.exit(1); // exit from server
    });
  } else {
    process.exit(1);
  }
});
// SIGINT signal send
process.on('SIGINT', () => {
  console.log('SIGINT SIGNAL FOUND; server is shutting down...');

  if (server) {
    server.close(() => {
      // server closing
      console.log('server closed');
      process.exit(1); // exit from server
    });
  } else {
    process.exit(1);
  }
});

// Unhandled rejection error
process.on('unhandledRejection', (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.log(`Unhandled rejection detected: ${message}`);

  if (server) {
    server.close(() => {
      // server closing
      console.log('server closed');
      process.exit(1); // exit from server
    });
  } else {
    process.exit(1);
  }
});

// Unhandled rejection error
process.on('uncaughtException', (error: Error) => {
  console.log(`Uncaught exception detected: ${error.message}`);

  if (server) {
    server.close(() => {
      // server closing
      console.log('server closed');
      process.exit(1); // exit from server
    });
  } else {
    process.exit(1);
  }
});
