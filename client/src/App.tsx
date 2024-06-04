import React, { useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './app/Dashboard';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

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
    console.log("hello");
    hubConnection.start().then(() => {
      console.log(`Connection with ${upstreamAddr} success!`)
    });
  }, []);

  return <Dashboard upstreamAddr={upstreamAddr} hubConnection={hubConnection} />;
}

export default App;