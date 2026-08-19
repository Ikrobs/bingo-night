import React, { useState, useEffect, useRef } from "react";
import { Gamepad2, Check, Undo2, RotateCcw, AlertCircle, Keyboard, Smartphone } from "lucide-react";
import ConnBadge from "./ConnBadge";
import NumberGrid from "./NumberGrid";
import { loadState, saveState, emptyState } from "../utils/storage";

export default function ControlView({ state, setState, connected, onExit, isMutatingRef }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  
  // Flag de controle: TRUE usa teclado virtual. FALSE usa o nativo do celular/físico do PC.
  const [useVirtualKeypad, setUseVirtualKeypad] = useState(true);
  const inputRef = useRef(null);
 
  useEffect(() => {
    if (!useVirtualKeypad) inputRef.current?.focus();
  }, [useVirtualKeypad, input]);
 
  if (!state) return null;
 
  const total = state.total;
  const remaining = total - state.drawn.length;
  const current = state.drawn[state.drawn.length - 1] ?? null;
  const finished = remaining === 0;
 
  async function submitBall(ballValue) {
    if (busy || finished || !ballValue) return;
    const n = Number(ballValue);
    if (!Number.isInteger(n) || n < 1 || n > total) {
      setError(`Válido apenas de 1 a ${total}.`);
      return;
    }
    if (isMutatingRef) isMutatingRef.current = true;
    setBusy(true);

    const fresh = (await loadState()) || state;
    if (fresh.drawn.includes(n)) {
      setError(`A bola ${n} já foi sorteada!`);
      setBusy(false);
      if (isMutatingRef) isMutatingRef.current = false;
      return;
    }
    
    const next = { ...fresh, drawn: [...fresh.drawn, n], status: "running", updatedAt: Date.now() };
    await saveState(next);
    setState(next);
    setInput("");
    setError("");
    setBusy(false);
    if (isMutatingRef) isMutatingRef.current = false;
  }

  function handleVirtualKeyPress(num) {
    if (finished || busy) return;
    setError("");
    setInput((prev) => {
      const next = prev + num;
      if (Number(next) > total) return prev;
      return next;
    });
  }

  function handleVirtualBackspace() {
    if (finished || busy) return;
    setError("");
    setInput((prev) => prev.slice(0, -1));
  }

  function handleVirtualClear() {
    setInput("");
    setError("");
  }
 
  async function undoLast() {
    if (busy || state.drawn.length === 0) return;
    if (isMutatingRef) isMutatingRef.current = true;
    setBusy(true);

    const fresh = (await loadState()) || state;
    const next = { ...fresh, drawn: fresh.drawn.slice(0, -1), updatedAt: Date.now() };
    await saveState(next);
    setState(next);
    setBusy(false);
    if (isMutatingRef) isMutatingRef.current = false;
    setError("");
  }
 
  async function resetGame() {
    if (isMutatingRef) isMutatingRef.current = true;
    setBusy(true);
    const next = emptyState(state.total);
    await saveState(next);
    setState(next);
    setBusy(false);
    if (isMutatingRef) isMutatingRef.current = false;
    setConfirmReset(false);
    setInput("");
    setError("");
  }
 
  return (
    <div className="screen-control">
      <header className="header-control">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-brand" />
          <span className="font-black uppercase text-sm tracking-wide">OPERADOR</span>
        </div>
        <div className="flex items-center gap-3">
          <ConnBadge connected={connected} />
          <button onClick={onExit} className="text-zinc-500 hover:text-brand font-mono text-xs uppercase tracking-tight">[ SAIR ]</button>
        </div>
      </header>

      <main className="main-layout">
        
        {/* Bloco de Comandos e Inputs (Fica à direita no PC/Horizontal) */}
        <div className="w-full flex flex-col gap-4 shrink-0">
          
          {/* Painel Leitura Rápida */}
          <div className="display-panel-operator">
            <div className="text-brand text-xs font-black uppercase tracking-widest mb-0.5">Última Bola Cantada</div>
            <div className="text-5xl font-black italic tracking-tighter">{current ? String(current).padStart(2, '0') : "—"}</div>
          </div>

          {/* Leitor de Entrada */}
          <form onSubmit={(e) => { e.preventDefault(); submitBall(input); }} className="w-full space-y-2">
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={input}
              disabled={finished || busy}
              readOnly={useVirtualKeypad}
              onChange={(e) => setInput(e.target.value.replace(/\D/g, ""))}
              placeholder={useVirtualKeypad ? "Aguardando toque" : "Toque para digitar"}
              className="input-ball-control shadow-inner outline-none focus:border-brand transition-colors"
            />

            {error && (
              <div className="flex items-center gap-2 text-red-800 font-mono text-xs bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </form>

          {/* Chave Seletora de Tipo de Teclado */}
          <div className="w-full flex justify-end">
            <button
              onClick={() => { handleVirtualClear(); setUseVirtualKeypad(!useVirtualKeypad); }}
              className="flex items-center gap-1.5 font-mono text-xs uppercase font-bold text-zinc-500 hover:text-brand transition-colors bg-zinc-100 px-2.5 py-1.5 border border-zinc-300 rounded"
            >
              {useVirtualKeypad ? (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-brand" />
                  <span>Usar teclado do celular</span>
                </>
              ) : (
                <>
                  <Keyboard className="w-3.5 h-3.5 text-brand" />
                  <span>Usar Teclado Virtual</span>
                </>
              )}
            </button>
          </div>

          {/* Teclado Virtual com Mapeamento de Linhas Padrão em Linha Única (7-8-9 no topo) */}
          {useVirtualKeypad && (
            <div className="keypad-grid my-1">
              {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
                <button key={num} type="button" onClick={() => handleVirtualKeyPress(String(num))} className="keypad-btn">{num}</button>
              ))}
              <button type="button" onClick={handleVirtualBackspace} className="keypad-btn text-brand font-mono text-xl font-bold">⌫</button>
              <button type="button" onClick={() => handleVirtualKeyPress("0")} className="keypad-btn">0</button>
              <button 
                type="button" 
                onClick={() => submitBall(input)} 
                disabled={!input || busy || finished}
                className="keypad-btn bg-brand text-bg-dark disabled:bg-zinc-200 disabled:text-zinc-400"
              >
                <Check className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>
          )}

          <div className="flex justify-between items-center w-full px-1 font-mono text-xs text-zinc-500 font-bold uppercase tracking-wider">
            <span>{state.drawn.length} sorteadas</span>
            <span>{remaining} restantes</span>
          </div>

          {/* Ações de Gerenciamento da Rodada */}
          <div className="flex gap-2 w-full border-t border-zinc-300/60 pt-3">
            <button
              onClick={undoLast}
              disabled={busy || state.drawn.length === 0}
              className="flex-1 flex items-center justify-center gap-1.5 bg-bg-dark text-bg-vintage hover:bg-zinc-800 disabled:opacity-30 p-2.5 rounded-xl font-bold text-xs uppercase"
            >
              <Undo2 className="w-3.5 h-3.5" /> Desfazer
            </button>
   
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-card-light border border-zinc-400/40 text-zinc-700 hover:text-red-700 p-2.5 rounded-xl font-bold text-xs uppercase"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reiniciar
              </button>
            ) : (
              <div className="flex-1 bg-red-50 border border-red-200 rounded-xl p-1.5 flex items-center justify-around text-[11px] font-mono font-bold">
                <button onClick={resetGame} className="text-red-700 uppercase">Confirmar Zerar</button>
                <span className="text-zinc-300">|</span>
                <button onClick={() => setConfirmReset(false)} className="text-zinc-500">Voltar</button>
              </div>
            )}
          </div>

        </div>

        {/* Grade do Tabuleiro Geral (Fica à esquerda no PC/Horizontal) */}
        <NumberGrid total={total} drawn={state.drawn} compact />

      </main>
    </div>
  );
}
