const anticallHandler = require('./handler/anticallHandler'); // adjust path

// after connection established and `conn` is ready:
conn.ev.on('call', async (update) => {
  await anticallHandler(conn, update);
});
