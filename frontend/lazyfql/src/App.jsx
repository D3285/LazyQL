import { useState } from "react";

import HomePage from "./components/HomePage";
import ConnectionPage from "./components/ConnectionPage";
import Workspace from "./components/Workspace";

import { useConnection } from "./components/context/ConnectionContext";

function App() {
  const { isConnected, disconnect } = useConnection();

  const [showConnection, setShowConnection] =
    useState(false);

  if (isConnected) {
    return (
      <Workspace
        onDisconnect={() => {
          disconnect();
          setShowConnection(false);
        }}
      />
    );
  }

  if (showConnection) {
    return (
      <ConnectionPage
        onBack={() => setShowConnection(false)}
      />
    );
  }

  return (
    <HomePage
      onGetStarted={() =>
        setShowConnection(true)
      }
    />
  );
}

export default App;