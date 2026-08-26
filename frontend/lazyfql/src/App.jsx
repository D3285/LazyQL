import { useConnection } from "./components/context/ConnectionContext";

import ConnectionPage from "./components/ConnectionPage";
import Workspace from "./components/Workspace";

function App() {
  const {
    isConnected,
    connect,
    disconnect,
  } = useConnection();

  if (!isConnected) {
    return (
      <ConnectionPage
        onConnect={connect}
      />
    );
  }

  return (
    <Workspace
      onDisconnect={disconnect}
    />
  );
}

export default App;