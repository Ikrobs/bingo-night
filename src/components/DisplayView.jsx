import React, { useEffect, useState, useRef } from "react";
import ConnBadge from "./ConnBadge";
import NumberGrid from "./NumberGrid";

export default function DisplayView({ state, connected, onExit }) {
  const [pulse, setPulse] = useState(false);
  const prevLenRef = useRef(0);
 
  useEffect(() => {
    if (!state) return;
    if (state.drawn.length > prevLenRef.current) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 900);
      prevLenRef.current = state.drawn.length;
      return () => clearTimeout(t);
    }
    prevLenRef.current = state.drawn.length;
  }, [state]);
 
  if (!state) {
    return <div className="screen-select font-mono text-bg-vintage uppercase tracking-widest bg-bg-dark h-screen w-full flex items-center justify-center">Sincronizando Globo…</div>;
  }
 
  const current = state.drawn[state.drawn.length - 1] ?? null;
  const recent = state.drawn.slice(-4).reverse();
 
  return (
    <div className="screen-display select-none">
      
      {/* Bloco Superior (12vh) */}
      <header className="header-display">
        <div className="flex flex-col line-none">
          <span className="text-brand font-black uppercase text-[10px] tracking-[0.5em] font-sans">TOXIC RIDERS MC</span>
          <h2 className="text-4xl font-black uppercase tracking-tighter italic text-bg-dark">BINGO <span className="text-brand">NIGHT</span></h2>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs font-bold text-bg-dark">
          <span className="bg-bg-dark text-bg-vintage px-3 py-1.5 tracking-wider uppercase text-[11px]">
            CANTADAS: {state.drawn.length} / {state.total}
          </span>
          <ConnBadge connected={connected} />
          <button onClick={onExit} className="text-text-muted hover:text-brand font-mono uppercase text-[10px] tracking-tight transition-colors">[ SAIR ]</button>
        </div>
      </header>
 
      {/* Bloco Central (53vh) */}
      <div className="middle-zone">
        
        {/* Histórico Recente (3 Colunas) */}
        <div className="history-box">
          <div className="history-title">Últimas Esferas Cantadas</div>
          <div className="grid grid-cols-3 gap-4">
            {recent.slice(1).map((n) => (
              <div key={n} className="history-item-ball">
                {String(n).padStart(2, '0')}
              </div>
            ))}
            {recent.length <= 1 && (
              <div className="col-span-3 text-center text-text-muted font-mono italic py-4 uppercase tracking-wider text-xs">
                Aguardando giro do globo...
              </div>
            )}
          </div>
        </div>
 
        {/* Bola Gigante da Vez (2 Colunas) */}
        <div className="current-ball-globe">
          <div className="globe-mesh-lines" />
          <div className="text-brand text-[10px] font-black uppercase tracking-[0.4em] mb-2 z-10 font-sans">BOLA DA VEZ</div>
          <div className={`giant-sphere ${pulse ? "giant-sphere-active" : ""}`}>
            <div className="font-black text-bg-dark tracking-tighter tabular-nums italic text-7xl md:text-8xl">
              {current ? String(current).padStart(2, '0') : "—"}
            </div>
          </div>
        </div>
      </div>
 
      {/* Bloco Inferior / Cartela de Conferência (35vh) */}
      <div className="footer-display">
        <NumberGrid total={state.total} drawn={state.drawn} />
      </div>

    </div>
  );
}
