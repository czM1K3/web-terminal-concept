import { AttachAddon } from "@xterm/addon-attach";
import { useEffect } from "react";
import { useXTerm } from "react-xtermjs";

export const MyTerminal = () => {
  const { instance, ref } = useXTerm();

  useEffect(() => {
    let socket: WebSocket | undefined = undefined;
    if (instance) {
      socket = new WebSocket("ws://localhost:3000");
      const attachAddon = new AttachAddon(socket);
      instance.loadAddon(attachAddon);
      socket.onclose = () => {
        alert("Closed");
      };
    }
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [instance]);

  return (
    <div
      ref={ref}
      style={{ width: "100%", height: "100%", textAlign: "left" }}
    />
  );
};
