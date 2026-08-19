import React, { useState, useEffect, useCallback, useRef } from "react";
import RoleSelect from "./components/RoleSelect";
import ControlView from "./components/ControlView";
import DisplayView from "./components/DisplayView";
import { loadState, saveState, emptyState, POLL_MS } from "./utils/storage";

export default function App() {
  const [role, setRole] = useState(null); // null | "control" | "display"
  const [state, setState] = useState(null);
  const [connected, setConnected] = useState(true);
  const [loading, setLoading] = useState(true);
  const isMutatingRef = useRef(false);

  const refresh = useCallback(async () => {
    if (isMutatingRef.current) return;
    const s = await loadState();
    if (s) {
      setState(s);
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, []);
 
  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    async function poll() {
      await refresh();
      if (isMounted) {
        setLoading(false);
        timeoutId = setTimeout(poll, POLL_MS);
      }
    }

    poll();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [refresh]);
 
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#121214] text-zinc-500 font-mono tracking-widest text-xs uppercase">
        Iniciando Moto Clube Engine...
      </div>
    );
  }
 
  return (
    <>
      {!role && (
        <RoleSelect
          state={state}
          onPick={async (r, total) => {
            if (!state && r === "control") {
              const fresh = emptyState(total);
              await saveState(fresh);
              setState(fresh);
            }
            setRole(r);
          }}
        />
      )}
 
      {role === "display" && (
        <DisplayView state={state} connected={connected} onExit={() => setRole(null)} />
      )}
 
      {role === "control" && (
        <ControlView
          state={state}
          setState={setState}
          connected={connected}
          onExit={() => setRole(null)}
          isMutatingRef={isMutatingRef}
        />
      )}
    </>
  );
}
