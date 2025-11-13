"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

type ColorId = "red" | "blue" | "green" | "yellow";

type ColorDef = {
    id: ColorId;
    name: string;
    emoji: string;
    textClass: string;
    bgClass: string;
    borderClass: string;
};

type Round = {
    target: ColorDef;       // La palabra: lo que hay que elegir
    displayColor: ColorDef; // El color real del texto (para confundir)
};

const COLORS: ColorDef[] = [
    {
        id: "red",
        name: "ROJO",
        emoji: "🔴",
        textClass: "text-red-400",
        bgClass: "bg-red-600",
        borderClass: "border-red-500",
    },
    {
        id: "blue",
        name: "AZUL",
        emoji: "🔵",
        textClass: "text-sky-400",
        bgClass: "bg-sky-600",
        borderClass: "border-sky-500",
    },
    {
        id: "green",
        name: "VERDE",
        emoji: "🟢",
        textClass: "text-emerald-400",
        bgClass: "bg-emerald-600",
        borderClass: "border-emerald-500",
    },
    {
        id: "yellow",
        name: "AMARILLO",
        emoji: "🟡",
        textClass: "text-yellow-300",
        bgClass: "bg-yellow-500",
        borderClass: "border-yellow-400",
    },
];

function shuffleArray<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

// Crea una ronda nueva (palabra objetivo + color visual del texto)
function createRound(): Round {
    const target = COLORS[Math.floor(Math.random() * COLORS.length)];

    // Para el color de visualización, elegimos aleatorio (a veces coincide, a veces no)
    const displayColor =
        COLORS[Math.floor(Math.random() * COLORS.length)];

    return { target, displayColor };
}

export default function ColorsGamePage() {
    const [round, setRound] = useState<Round | null>(null);
    const [selectedId, setSelectedId] = useState<ColorId | null>(null);
    const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
    const [showConfetti, setShowConfetti] = useState(false);
    const [showErrorEffect, setShowErrorEffect] = useState(false);

    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);

    const autoNextTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const errorEffectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null
    );

    // Primera ronda solo en cliente (evitar historias de hidratación)
    useEffect(() => {
        setRound(createRound());
    }, []);

    useEffect(() => {
        return () => {
            if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
            if (errorEffectTimeoutRef.current)
                clearTimeout(errorEffectTimeoutRef.current);
        };
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
        setSelectedId(null);
        setStatus("idle");
        setShowConfetti(false);
        setShowErrorEffect(false);
    };

    const handleAnswer = (color: ColorDef) => {
        if (!round || status !== "idle") return;

        setSelectedId(color.id);
        const isCorrect = color.id === round.target.id;

        if (isCorrect) {
            setStatus("correct");
            setCorrectCount((c) => c + 1);
            setShowConfetti(true);
            // El confeti llamará a handleNext cuando termine
        } else {
            setStatus("wrong");
            setWrongCount((c) => c + 1);
            setShowErrorEffect(true);

            if (errorEffectTimeoutRef.current) {
                clearTimeout(errorEffectTimeoutRef.current);
            }
            errorEffectTimeoutRef.current = setTimeout(() => {
                setShowErrorEffect(false);
            }, 600);

            if (autoNextTimeoutRef.current) {
                clearTimeout(autoNextTimeoutRef.current);
            }
            autoNextTimeoutRef.current = setTimeout(() => {
                handleNext();
            }, 2500);
        }
    };

    const getOptionClasses = (color: ColorDef) => {
        const base =
            "flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-base font-semibold transition-all duration-150 shadow-md sm:text-lg";

        if (!round) return base + " border-zinc-800 bg-zinc-900/60";

        const isSelected = selectedId === color.id;
        const isCorrectOption = round && color.id === round.target.id;

        // Estado normal
        if (status === "idle") {
            return (
                base +
                " border-zinc-700 bg-zinc-900/70 hover:-translate-y-1 hover:border-zinc-400 hover:bg-zinc-900"
            );
        }

        // Si la ronda es correcta: solo el correcto en verde
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
            // La opción correcta en verde
            return (
                base +
                " border-emerald-500 bg-emerald-600 text-white shadow-lg shadow-emerald-700/40"
            );
        }

        if (isSelected) {
            // La que has marcado mal en rojo
            return (
                base +
                " border-red-500 bg-red-600 text-white shadow-lg shadow-red-700/40"
            );
        }

        // El resto apagadas
        return base + " border-zinc-800 bg-zinc-900/60 opacity-60";
    };


    if (!round) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-zinc-900 text-zinc-50 flex items-center justify-center px-4">
                <main className="w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 shadow-2xl sm:p-10 text-center">
                    <p className="text-zinc-400">Preparando colores...</p>
                </main>
            </div>
        );
    }

    return (
        <>
            <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-zinc-900 text-zinc-50 flex items-center justify-center px-4 overflow-hidden">
                {/* Confeti al acertar */}
                {showConfetti && (
                    <Confetti
                        numberOfPieces={450}
                        recycle={false}
                        tweenDuration={2200}
                        onConfettiComplete={(instance) => {
                            instance?.reset();
                            handleNext();
                        }}
                    />
                )}

                {/* Efecto de fallo: flash rojo + shake */}
                {showErrorEffect && <div className="red-flash-overlay" />}

                <main
                    className={
                        "w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 shadow-2xl sm:p-10 transition-transform" +
                        (showErrorEffect ? " shake" : "")
                    }
                >
                    <div className="flex flex-col items-center gap-8">
                        {/* Cabecera + volver + marcadores */}
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
                                        Juego de colores
                                    </p>
                                    <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">
                                        Elige el color correcto según la palabra
                                    </h1>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 text-xs sm:text-sm">
                                <div className="flex items-center gap-2">
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
                        </div>

                        {/* Texto central con efecto Stroop */}
                        <div className="flex items-center justify-center">
                            <div className="flex h-40 w-100 items-center justify-center rounded-3xl bg-zinc-900/80 border border-zinc-700 shadow-xl">
                                <span
                                    className={
                                        "text-4xl sm:text-5xl font-extrabold tracking-wide drop-shadow " +
                                        round.displayColor.textClass
                                    }
                                >
                                    {round.target.name}
                                </span>
                            </div>
                        </div>

                        {/* Opciones: botones de colores + emojis */}
                        <div className="grid w-full gap-4 sm:grid-cols-2">
                            {COLORS.map((color) => (
                                <button
                                    key={color.id}
                                    type="button"
                                    onClick={() => handleAnswer(color)}
                                    disabled={status !== "idle"}
                                    className={getOptionClasses(color)}
                                >
                                    <span className="text-2xl">{color.emoji}</span>
                                    <span>{color.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* Mensaje inferior */}
                        <div className="flex w-full flex-col items-center gap-3 pt-2 text-center min-h-[3rem]">
                            {status === "correct" && (
                                <p className="text-emerald-400 font-medium">
                                    ✅ ¡Bien! Has elegido el color correcto según la palabra.
                                    Nueva ronda cuando termine el confeti...
                                </p>
                            )}
                            {status === "wrong" && (
                                <p className="text-red-400 font-medium">
                                    ❌ Aquí manda la palabra, no el color del texto. Nueva ronda
                                    en un momento...
                                </p>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Estilos globales para efecto de fallo (igual que en otros juegos) */}
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
