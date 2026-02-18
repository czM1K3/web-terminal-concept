import { AttachAddon } from "@xterm/addon-attach";
import { useEffect } from "react";
import { useXTerm } from "react-xtermjs";
import { FitAddon } from '@xterm/addon-fit';
import type { ITerminalOptions } from "@xterm/xterm";

const terminalOptions: ITerminalOptions = {
  fontFamily: '"FiraCode Nerd Font", monospace',
  fontSize: 14,
};

export const MyTerminal = () => {
  const { instance, ref } = useXTerm({ options: terminalOptions });

  useEffect(() => {
    let socket: WebSocket | undefined = undefined;
    if (instance) {
      socket = new WebSocket("ws://localhost:3000");
      const attachAddon = new AttachAddon(socket);
      instance.loadAddon(attachAddon);
      const fitAddon = new FitAddon();
      instance.loadAddon(fitAddon);
      instance.onResize(({ cols, rows }) => {
        const data = { cols, rows };
        socket?.send(JSON.stringify(data));
        // console.log(`New size is ${cols}x${rows}`)
      });
      socket.onopen = () => { 
        fitAddon.fit();
      };
      window.onresize = () => {
        fitAddon.fit();
      };
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
      style={{ width: "100vw", height: "100vh", textAlign: "left" }}
      className="terminal"
    />
  );
};
