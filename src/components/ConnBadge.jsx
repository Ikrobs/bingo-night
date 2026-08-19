import React from "react";
import { Wifi, WifiOff } from "lucide-react";

export default function ConnBadge({ connected }) {
  return (
    <div className={`conn-badge ${connected ? "conn-online" : "conn-offline"}`}>
      {connected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
      <span>{connected ? "sincronizado" : "offline"}</span>
    </div>
  );
}
