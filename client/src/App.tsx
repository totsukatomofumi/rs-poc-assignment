import React, { useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./app/Dashboard";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

// app contains startup and configs
// no hooks, no rerender
function App() {
  // startup
  const upstreamAddr: string = "http://localhost:5240";
  const hubPath: string = "/dashboard";

  const hubConnection: HubConnection = new HubConnectionBuilder()
    .withUrl(upstreamAddr + hubPath)
    .build();

  useEffect(() => {
    async function start() {
      try {
        await hubConnection.start();
        console.log(`Connection with ${upstreamAddr} success!`);
      } catch (err) {
        console.log(err);
        setTimeout(start, 1000);
      }
    }

    start();

    hubConnection.onclose((err) => {
      console.log(err);
      start();
    });
  }, []);

  return (
    <Dashboard upstreamAddr={upstreamAddr} hubConnection={hubConnection} />
  );
}

export default App;
