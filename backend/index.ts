const map = new Map<Bun.ServerWebSocket<undefined>, Bun.Subprocess<"ignore", "pipe", "inherit">>();

Bun.serve({
  fetch(req, server) {
    // upgrade the request to a WebSocket
    if (server.upgrade(req)) {
      return; // do not return a Response
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    message(ws, message) {
      // console.log("received", message);
      const proc = map.get(ws);
      proc?.terminal?.write(message);
    },
    open(ws) {
      // console.log("connected");
      const proc = Bun.spawn(["bash"], {
        terminal: {
          cols: 80,
          rows: 24,
          data(_terminal, data) {
            const decoder = new TextDecoder();
            const str = decoder.decode(data);
            ws.send(str);
          },
          exit() {
            ws.close();
            map.delete(ws);
          },
        },
      });
      map.set(ws, proc);
    },
    close(ws, code, message) {
      // console.log("closed", code, message);
      const proc = map.get(ws);
      proc?.terminal?.close();
      map.delete(ws);
    },
    drain(ws) {
      console.log("drain, idk");
    },
  },
});
