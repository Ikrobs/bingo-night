import React from "react";
import { Gamepad2, Tv } from "lucide-react";

export default function RoleSelect({ state, onPick }) {
  const hasGame = !!state && state.drawn && state.drawn.length > 0;
 
  return (
    <div className="screen-select">
      <div className="box-select">
        <div className="text-center mb-8 border-b-2 border-zinc-800 pb-6">
          <div className="text-brand text-xs font-black tracking-[0.4em] uppercase mb-1">
            TOXIC RIDERS MC
          </div>
          <h1 className="text-4xl font-black text-bg-vintage uppercase tracking-tighter italic">
            BINGO <span className="text-brand">NIGHT</span>
          </h1>
          {hasGame && (
            <p className="text-zinc-400 text-xs font-mono mt-3 bg-zinc-950 py-1.5 px-3 rounded inline-block border border-zinc-800">
              JOGO ATIVO: {state.drawn.length}/{state.total} BOLAS
            </p>
          )}
        </div>
 
        <div className="space-y-4">
          <button onClick={() => onPick("control")} className="btn-role btn-role-pc">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-bg-dark flex items-center justify-center text-brand">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-black uppercase tracking-tight text-lg">Mesa de Controle</div>
              <div className="text-zinc-600 text-xs font-mono">Painel do Operador (Celular/PC)</div>
            </div>
          </button>
 
          <button onClick={() => onPick("display")} className="btn-role btn-role-tv">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-brand flex items-center justify-center text-bg-dark">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <div className="font-black uppercase tracking-tight text-lg">Painel da TV</div>
              <div className="text-zinc-400 text-xs font-mono">Exibição de Tela Cheia para o Público</div>
            </div>
          </button>
        </div>

        <p className="text-center text-zinc-500 text-[11px] font-mono mt-8 leading-relaxed">
          Abra este link no PC e na TV. O painel do operador controla dinamicamente a quantidade de bolas do jogo.
        </p>
      </div>
    </div>
  );
}
