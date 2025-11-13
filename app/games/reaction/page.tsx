"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

type Phase = "idle" | "waiting" | "go" | "result" | "tooSoon";

export default function ReactionGamePage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [lastTime, setLastTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [falseStarts, setFalseStarts] = useState(0);

  const [showConfetti, setShowConfetti] = useState(false);
  const [showErrorEffect, setShowErrorEffect] = useState(false);

  const waitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const goTimestampRef = useRef<number | null>(null);

  // Limpieza de timeouts al desmontar
  useEffect(() => {
    return () => {
      if (waitTimeoutRef.current) clearTimeout(waitTimeoutRef.current);
      if (autoResetTimeoutRef.current) clearTimeout(autoResetTimeoutRef.current);
    };
  }, []);

  const resetVisuals = () => {
    setShowConfetti(false);
    setShowErrorEffect(false);
  };

  const startRound = () => {
    // limpiar timeouts previos
    if (waitTimeoutRef.current) {
      clearTimeout(waitTimeoutRef.current);
      waitTimeoutRef.current = null;
    }
    if (autoResetTimeoutRef.current) {
      clearTimeout(autoResetTimeoutRef.current);
      autoResetTimeoutRef.current = null;
    }
    resetVisuals();

    setPhase("waiting");
    setLastTime(null);
    goTimestampRef.current = null;

    // delay aleatorio entre 1.5 y 4 segundos
    const delay = Math.floor(1500 + Math.random() * 2500);

    waitTimeoutRef.current = setTimeout(() => {
      goTimestampRef.current = performance.now();
      setPhase("go");
    }, delay);
  };

  const handleClickArea = () => {
    // Zona grande central clicable
    if (phase === "idle" || phase === "result" || phase === "tooSoon") {
      // Ignoramos clics aquí; que usen el botón de "Empezar" / "Intentar de nuevo"
      return;
    }

    if (phase === "waiting") {
      // Se ha adelantado
      if (waitTimeoutRef.current) {
        clearTimeout(waitTimeoutRef.current);
        waitTimeoutRef.current = null;
      }
      setPhase("tooSoon");
      setFalseStarts((f) => f + 1);
      setShowErrorEffect(true);

      autoResetTimeoutRef.current = setTimeout(() => {
        resetVisuals();
        setPhase("idle");
      }, 2000);

      return;
    }

    if (phase === "go") {
      const now = performance.now();
      if (!goTimestampRef.current) return;

      const diff = Math.round(now - goTimestampRef.current);
      setLastTime(diff);
      setBestTime((prev) => (prev === null ? diff : Math.min(prev, diff)));
      setAttempts((a) => a + 1);
      setPhase("result");
      setShowConfetti(true);

      autoResetTimeoutRef.current = setTimeout(() => {
        resetVisuals();
        setPhase("idle");
      }, 3000);
    }
  };

  const getCardClasses = () => {
    let base =
      "flex h-52 sm:h-56 w-full max-w-xl items-center justify-center rounded-3xl border shadow-xl transition-colors transition-transform duration-200 select-none cursor-pointer ";

    if (phase === "idle") {
      base += "border-zinc-700 bg-zinc-900/80 hover:border-zinc-500";
    } else if (phase === "waiting") {
      base +=
        "border-amber-500/70 bg-amber-900/60 text-amber-100 shadow-amber-800/40";
    } else if (phase === "go") {
      base +=
        "border-emerald-500/80 bg-emerald-700/80 text-emerald-50 shadow-emerald-800/50";
    } else if (phase === "tooSoon") {
      base +=
        "border-red-500/80 bg-red-700/80 text-red-50 shadow-red-800/50";
    } else if (phase === "result") {
      base +=
        "border-emerald-500/80 bg-emerald-800/80 text-emerald-50 shadow-emerald-900/60";
    }

    if (showErrorEffect) {
      base += " shake";
    }

    return base;
  };

  const renderCardContent = () => {
    if (phase === "idle") {
      return (
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <p className="text-sm text-zinc-400">
            Pulsa en <span className="font-semibold text-zinc-200">Empezar</span>{" "}
            y espera a que la tarjeta se ponga verde.
          </p>
          <p className="text-xs text-zinc-500">
            Toca lo más rápido que puedas cuando se ponga en <span className="text-emerald-300 font-semibold">verde</span>.
          </p>
        </div>
      );
    }

    if (phase === "waiting") {
      return (
        <div className="flex flex-col items-center gap-3 px-4 text-center">
          <span className="text-2xl">⏳</span>
          <p className="text-lg font-semibold">Espera al verde...</p>
          <p className="text-xs text-amber-100/90">
            No pulses todavía, te penalizará si te adelantas.
          </p>
        </div>
      );
    }

    if (phase === "go") {
      return (
        <div className="flex flex-col items-center gap-3 px-4 text-center">
          <span className="text-4xl">⚡</span>
          <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ¡YA!
          </p>
          <p className="text-xs text-emerald-100/90">
            Toca ahora la tarjeta lo más rápido que puedas.
          </p>
        </div>
      );
    }

    if (phase === "tooSoon") {
      return (
        <div className="flex flex-col items-center gap-3 px-4 text-center">
          <span className="text-3xl">⛔</span>
          <p className="text-lg font-semibold">Te has adelantado</p>
          <p className="text-xs text-red-100/90">
            Espera a que la tarjeta se vuelva verde antes de tocar.
          </p>
        </div>
      );
    }

    // result
    return (
      <div className="flex flex-col items-center gap-3 px-4 text-center">
        <span className="text-3xl">🏁</span>
        <p className="text-lg font-semibold">
          Tu tiempo:{" "}
          <span className="text-emerald-200">
            {lastTime !== null ? `${lastTime} ms` : "—"}
          </span>
        </p>
        {bestTime !== null && (
          <p className="text-xs text-emerald-100/90">
            Mejor marca:{" "}
            <span className="font-semibold">{bestTime} ms</span>
          </p>
        )}
        <p className="text-[11px] text-emerald-100/60">
          Se iniciará otra ronda en unos segundos, o pulsa{" "}
          <span className="font-semibold">Intentar de nuevo</span>.
        </p>
      </div>
    );
  };

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-zinc-900 text-zinc-50 flex items-center justify-center px-4 overflow-hidden">
        {/* Confeti al marcar un tiempo */}
        {showConfetti && (
          <Confetti
            numberOfPieces={phase === "result" ? 400 : 250}
            recycle={false}
            tweenDuration={2200}
            onConfettiComplete={(instance) => {
              instance?.reset();
              setShowConfetti(false);
            }}
          />
        )}

        {/* Efecto de fallo: flash rojo */}
        {showErrorEffect && <div className="red-flash-overlay" />}

        <main className="w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 shadow-2xl sm:p-10 transition-transform">
          <div className="flex flex-col items-center gap-8">
            {/* Cabecera + volver + stats */}
            <div className="flex w-full items-start justify-between gap-4">
              <div className="flex flex-col gap-3 text-left">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-[11px] font-medium text-zinc-200 hover:bg-zinc-800 hover:border-zinc-400 transition-colors"
                >
                    <ChevronLeft className="h-3 w-3" />
                  Volver
                </Link>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-400">
                    Juego de reflejos
                  </p>
                  <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">
                    ¿Qué tan rápido reaccionas?
                  </h1>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1 flex items-center gap-1">
                    <span>🏁</span>
                    <span className="font-semibold">{attempts}</span>
                  </div>
                  <div className="rounded-full border border-red-500/60 bg-red-500/10 px-3 py-1 flex items-center gap-1">
                    <span>⛔</span>
                    <span className="font-semibold">{falseStarts}</span>
                  </div>
                </div>
                {bestTime !== null && (
                  <p className="text-[11px] text-zinc-500">
                    Mejor:{" "}
                    <span className="font-semibold text-zinc-200">
                      {bestTime} ms
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Tarjeta central clicable */}
            <button
              type="button"
              onClick={handleClickArea}
              className={getCardClasses()}
            >
              {renderCardContent()}
            </button>

            {/* Botón de control inferior */}
            <div className="flex w-full justify-center">
              {phase === "idle" && (
                <button
                  type="button"
                  onClick={startRound}
                  className="inline-flex items-center justify-center rounded-full border border-emerald-500/70 bg-emerald-600/90 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 hover:border-emerald-400 transition-colors"
                >
                  Empezar ronda
                </button>
              )}

              {(phase === "result" || phase === "tooSoon") && (
                <button
                  type="button"
                  onClick={startRound}
                  className="inline-flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 px-5 py-2 text-sm font-semibold text-zinc-100 shadow-md hover:bg-zinc-800 hover:border-zinc-400 transition-colors"
                >
                  Intentar de nuevo
                </button>
              )}

              {phase === "waiting" && (
                <span className="text-xs text-zinc-500">
                  Esperando al verde...
                </span>
              )}

              {phase === "go" && (
                <span className="text-xs text-emerald-300">
                  ¡Toca ya la tarjeta!
                </span>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Estilos globales para efecto de fallo y shake */}
      <style jsx global>{`
        @keyframes screen-shake {
          0% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-4px);
          }
          40% {
            transform: translateX(4px);
          }
          60% {
            transform: translateX(-4px);
          }
          80% {
            transform: translateX(4px);
          }
          100% {
            transform: translateX(0);
          }
        }

        .shake {
          animation: screen-shake 0.35s ease-in-out;
        }

        @keyframes red-flash {
          0% {
            opacity: 0;
          }
          20% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
          }
        }

        .red-flash-overlay {
          position: fixed;
          inset: 0;
          background: radial-gradient(
            circle at center,
            rgba(248, 113, 113, 0.3),
            rgba(127, 29, 29, 0.85)
          );
          pointer-events: none;
          animation: red-flash 0.5s ease-out;
          z-index: 30;
        }
      `}</style>
    </>
  );
}
