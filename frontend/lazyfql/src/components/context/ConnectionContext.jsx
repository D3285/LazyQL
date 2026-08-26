import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getDatabaseSchema } from "../../api/schema";

const ConnectionContext = createContext(null);

export function ConnectionProvider({ children }) {
  const [session, setSession] = useState(null);

  const [schema, setSchema] = useState(null);

  const [isSchemaLoading, setIsSchemaLoading] =
    useState(false);

  const [schemaError, setSchemaError] =
    useState("");

  const connect = (sessionData) => {
    if (!sessionData?.session_id) {
      throw new Error(
        "Backend did not return a session_id."
      );
    }

    setSession({
      sessionId: sessionData.session_id,
      databaseType:
        sessionData.database_type || null,
    });

    // Clear old database schema
    setSchema(null);
    setSchemaError("");
  };

  const disconnect = () => {
    setSession(null);
    setSchema(null);
    setSchemaError("");
  };

  /*
   * Once a database session exists,
   * automatically load its schema.
   */
  useEffect(() => {
    let mounted = true;

    async function loadSchema() {
      if (!session?.sessionId) {
        return;
      }

      try {
        setIsSchemaLoading(true);
        setSchemaError("");

        const data = await getDatabaseSchema(
          session.sessionId
        );

        if (mounted) {
          setSchema(data);
        }
      } catch (error) {
        if (mounted) {
          setSchemaError(
            error?.message ||
              "Unable to load database schema."
          );
        }
      } finally {
        if (mounted) {
          setIsSchemaLoading(false);
        }
      }
    }

    loadSchema();

    return () => {
      mounted = false;
    };
  }, [session?.sessionId]);

  const value = useMemo(
    () => ({
      session,

      sessionId:
        session?.sessionId || null,

      databaseType:
        session?.databaseType || null,

      isConnected:
        Boolean(session?.sessionId),

      // Schema
      schema,

      isSchemaLoading,

      schemaError,

      connect,

      disconnect,
    }),
    [
      session,
      schema,
      isSchemaLoading,
      schemaError,
    ]
  );

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  const context = useContext(
    ConnectionContext
  );

  if (!context) {
    throw new Error(
      "useConnection must be used inside ConnectionProvider."
    );
  }

  return context;
}