"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import ReactCountryFlag from "react-country-flag";
import countries from "world-countries";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

type Flag = {
  country: string;
  code: string; // ISO 3166-1 alpha-2
};

type Round = {
  flag: Flag;
  options: Flag[];
};

// Todas (o casi todas) las banderas posibles usando world-countries
const FLAGS: Flag[] = countries
  .filter((c: any) => typeof c.cca2 === "string" && c.cca2.length === 2)
  .map((c: any) => ({
    country: c.translations?.spa?.common || c.name.common,
    code: c.cca2 as string,
  }));

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createRound(): Round {
  const correctFlag = FLAGS[Math.floor(Math.random() * FLAGS.length)];
  const otherFlags = FLAGS.filter((f) => f.country !== correctFlag.country);
  const randomOthers = shuffleArray(otherFlags).slice(0, 3);
  const options = shuffleArray([correctFlag, ...randomOthers]);

  return {
    flag: correctFlag,
    options,
  };
}

export default function FlagGamePage() {
  const [round, setRound] = useState<Round | null>(null);
  const [selected, setSelected] = useState<Flag | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showErrorEffect, setShowErrorEffect] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const autoNextTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorEffectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // Primera ronda sólo en cliente (evita errores de hidratación)
  useEffect(() => {
    setRound(createRound());
  }, []);

  const handleNext = () => {
    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }
    if (errorEffectTimeoutRef.current) {
      clearTimeout(errorEffectTimeoutRef.current);
      errorEffectTimeoutRef.current = null;
    }

    setRound(createRound());
    setSelected(null);
    setStatus("idle");
    setShowConfetti(false);
    setShowErrorEffect(false);
  };

  const handleAnswer = (option: Flag) => {
    if (!round || status !== "idle") return;

    setSelected(option);
    const isCorrect = option.country === round.flag.country;

    if (isCorrect) {
      setStatus("correct");
      setCorrectCount((c) => c + 1);
      setShowConfetti(true);
      // En este caso NO programamos timeout:
      // dejamos que el propio Confetti llame a handleNext al terminar.
    } else {
      setStatus("wrong");
      setWrongCount((c) => c + 1);
      setShowErrorEffect(true);

      // El efecto rojo dura ~0.5s
      if (errorEffectTimeoutRef.current) {
        clearTimeout(errorEffectTimeoutRef.current);
      }
      errorEffectTimeoutRef.current = setTimeout(() => {
        setShowErrorEffect(false);
      }, 600);

      // Después de 3 segundos, nueva bandera al fallar
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
      }
      autoNextTimeoutRef.current = setTimeout(() => {
        handleNext();
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
      }
      if (errorEffectTimeoutRef.current) {
        clearTimeout(errorEffectTimeoutRef.current);
      }
    };
  }, []);

  const getOptionClasses = (option: Flag) => {
    const base =
      "flex items-center justify-center rounded-2xl border px-4 py-3 text-base font-semibold transition-all duration-150 shadow-md sm:text-lg";

    if (!round) return base + " border-zinc-800 bg-zinc-900/60";

    const isSelected = selected?.country === option.country;
    const isCorrectOption = option.country === round.flag.country;

    if (status === "idle") {
      return (
        base +
        " border-zinc-700 bg-zinc-900/70 hover:-translate-y-1 hover:border-zinc-400 hover:bg-zinc-900"
      );
    }

    if (status === "correct") {
      if (isCorrectOption) {
        return (
          base +
          " border-emerald-500 bg-emerald-600 text-white shadow-lg shadow-emerald-700/40"
        );
      }
      return base + " border-zinc-800 bg-zinc-900/60 opacity-60";
    }

    // status === "wrong"
    if (isCorrectOption) {
      return (
        base +
        " border-emerald-500 bg-emerald-600 text-white shadow-lg shadow-emerald-700/40"
      );
    }

    if (isSelected) {
      return (
        base +
        " border-red-500 bg-red-600 text-white shadow-lg shadow-red-700/40"
      );
    }

    return base + " border-zinc-800 bg-zinc-900/60 opacity-60";
  };

  if (!round) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-zinc-900 text-zinc-50 flex items-center justify-center px-4">
        <main className="w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 shadow-2xl sm:p-10 text-center">
          <p className="text-zinc-400">Cargando bandera...</p>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-zinc-900 text-zinc-50 flex items-center justify-center px-4 overflow-hidden">
        {/* Confeti al acertar: más denso y dejamos que él decida cuándo pasar de ronda */}
        {showConfetti && (
          <Confetti
            numberOfPieces={600}
            recycle={false}
            tweenDuration={2600}
            onConfettiComplete={(confetti) => {
              confetti?.reset();
              handleNext();
            }}
          />
        )}

        {/* Efecto contrario al confeti al fallar: flash rojo + shake */}
        {showErrorEffect && <div className="red-flash-overlay" />}

        <main
          className={
            "w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 shadow-2xl sm:p-10 transition-transform" +
            (showErrorEffect ? " shake" : "")
          }
        >
          <div className="flex flex-col items-center gap-8">
            {/* Cabecera + marcadores + volver */}
            <div className="flex w-full items-center justify-between gap-4">
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
                    Juego de banderas
                  </p>
                  <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">
                    ¿De qué país es esta bandera?
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <div className="rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1 flex items-center gap-1">
                  <span>✅</span>
                  <span className="font-semibold">{correctCount}</span>
                </div>
                <div className="rounded-full border border-red-500/60 bg-red-500/10 px-3 py-1 flex items-center gap-1">
                  <span>❌</span>
                  <span className="font-semibold">{wrongCount}</span>
                </div>
              </div>
            </div>

            {/* Bandera arriba centrada */}
            <div className="flex items-center justify-center">
              <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-zinc-900/80 border border-zinc-700 shadow-xl">
                <ReactCountryFlag
                  countryCode={round.flag.code}
                  svg
                  style={{
                    width: "4.5rem",
                    height: "4.5rem",
                    borderRadius: "0.75rem",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
                  }}
                />
              </div>
            </div>

            {/* Opciones abajo */}
            <div className="grid w-full gap-4 sm:grid-cols-2">
              {round.options.map((option) => (
                <button
                  key={option.country}
                  type="button"
                  onClick={() => handleAnswer(option)}
                  disabled={status !== "idle"}
                  className={getOptionClasses(option)}
                >
                  {option.country}
                </button>
              ))}
            </div>

            {/* Mensaje inferior */}
            <div className="flex w-full flex-col items-center gap-3 pt-2 text-center min-h-[3rem]">
              {status === "correct" && (
                <p className="text-emerald-400 font-medium">
                  ✅ ¡Correcto! Era {round.flag.country}. Nueva bandera cuando
                  termine el confeti...
                </p>
              )}
              {status === "wrong" && selected && (
                <p className="text-red-400 font-medium">
                  ❌ {selected.country} no es correcto. Era{" "}
                  <span className="text-emerald-300 font-semibold">
                    {round.flag.country}
                  </span>
                  . Nueva bandera en 3 segundos...
                </p>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Estilos globales para el efecto de fallo (lo contrario al confeti) */}
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
