"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

type Animal = {
    id: string;
    name: string;
    emoji: string;
};

type Round = {
    animal: Animal;
    options: Animal[];
};

// Pool grande de animales (puedes seguir añadiendo más aquí)
const ANIMALS: Animal[] = [
    { id: "perro", name: "Perro", emoji: "🐶" },
    { id: "gato", name: "Gato", emoji: "🐱" },
    { id: "raton", name: "Ratón", emoji: "🐭" },
    { id: "hamster", name: "Hámster", emoji: "🐹" },
    { id: "conejo", name: "Conejo", emoji: "🐰" },
    { id: "zorro", name: "Zorro", emoji: "🦊" },
    { id: "oso", name: "Oso", emoji: "🐻" },
    { id: "panda", name: "Oso panda", emoji: "🐼" },
    { id: "koala", name: "Koala", emoji: "🐨" },
    { id: "tigre", name: "Tigre", emoji: "🐯" },
    { id: "leon", name: "León", emoji: "🦁" },
    { id: "vaca", name: "Vaca", emoji: "🐮" },
    { id: "cerdo", name: "Cerdo", emoji: "🐷" },
    { id: "cerdito", name: "Hocico de cerdo", emoji: "🐽" },
    { id: "rana", name: "Rana", emoji: "🐸" },
    { id: "mono", name: "Mono", emoji: "🐵" },
    { id: "mono_ojos", name: "Mono tapándose los ojos", emoji: "🙈" },
    { id: "mono_oidos", name: "Mono tapándose los oídos", emoji: "🙉" },
    { id: "mono_boca", name: "Mono tapándose la boca", emoji: "🙊" },
    { id: "pinguino", name: "Pingüino", emoji: "🐧" },
    { id: "pajaro", name: "Pájaro", emoji: "🐦" },
    { id: "pollito", name: "Pollito", emoji: "🐤" },
    { id: "pollito_huevo", name: "Pollito saliendo del huevo", emoji: "🐣" },
    { id: "pollo", name: "Pollo", emoji: "🐔" },
    { id: "aguila", name: "Águila", emoji: "🦅" },
    { id: "buho", name: "Búho", emoji: "🦉" },
    { id: "pavo_real", name: "Pavo real", emoji: "🦚" },
    { id: "pavo", name: "Pavo", emoji: "🦃" },
    { id: "pato", name: "Pato", emoji: "🦆" },
    { id: "cisne", name: "Cisne", emoji: "🦢" },
    { id: "murcielago", name: "Murciélago", emoji: "🦇" },
    { id: "lobo", name: "Lobo", emoji: "🐺" },
    { id: "caballo", name: "Caballo", emoji: "🐴" },
    { id: "cebra", name: "Cebra", emoji: "🦓" },
    { id: "jirafa", name: "Jirafa", emoji: "🦒" },
    { id: "camello", name: "Camello", emoji: "🐫" },
    { id: "dromedario", name: "Dromedario", emoji: "🐪" },
    { id: "elefante", name: "Elefante", emoji: "🐘" },
    { id: "rinoceronte", name: "Rinoceronte", emoji: "🦏" },
    { id: "hipopotamo", name: "Hipopótamo", emoji: "🦛" },
    { id: "oso_polar", name: "Oso polar", emoji: "🐻‍❄️" },
    { id: "ardilla", name: "Ardilla", emoji: "🐿️" },
    { id: "erizo", name: "Erizo", emoji: "🦔" },
    { id: "canguro", name: "Canguro", emoji: "🦘" },
    { id: "tortuga", name: "Tortuga", emoji: "🐢" },
    { id: "serpiente", name: "Serpiente", emoji: "🐍" },
    { id: "lagarto", name: "Lagarto", emoji: "🦎" },
    { id: "cocodrilo", name: "Cocodrilo", emoji: "🐊" },
    { id: "delfin", name: "Delfín", emoji: "🐬" },
    { id: "tiburon", name: "Tiburón", emoji: "🦈" },
    { id: "ballena", name: "Ballena", emoji: "🐋" },
    { id: "ballena_chorro", name: "Ballena expulsando agua", emoji: "🐳" },
    { id: "pez", name: "Pez", emoji: "🐟" },
    { id: "pez_tropical", name: "Pez tropical", emoji: "🐠" },
    { id: "pez_globo", name: "Pez globo", emoji: "🐡" },
    { id: "pulpo", name: "Pulpo", emoji: "🐙" },
    { id: "cangrejo", name: "Cangrejo", emoji: "🦀" },
    { id: "langosta", name: "Langosta", emoji: "🦞" },
    { id: "gamba", name: "Gamba", emoji: "🦐" },
    { id: "caracol", name: "Caracol", emoji: "🐌" },
    { id: "mariposa", name: "Mariposa", emoji: "🦋" },
    { id: "abeja", name: "Abeja", emoji: "🐝" },
    { id: "escarabajo", name: "Escarabajo", emoji: "🪲" },
    { id: "hormiga", name: "Hormiga", emoji: "🐜" },
    { id: "araña", name: "Araña", emoji: "🕷️" },
    { id: "escorpion", name: "Escorpión", emoji: "🦂" },
    { id: "mosquito", name: "Mosquito", emoji: "🦟" },
    { id: "mosca", name: "Mosca", emoji: "🪰" },
    { id: "lombriz", name: "Lombriz", emoji: "🪱" },
    { id: "sardina", name: "Sardina", emoji: "🐟" },
    { id: "oso_perezoso", name: "Perezoso", emoji: "🦥" },
    { id: "nutria", name: "Nutria", emoji: "🦦" },
    { id: "castor", name: "Castor", emoji: "🦫" },
];

function shuffleArray<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

// Ahora createRound evita repetir el mismo animal que en la ronda anterior
function createRound(excludeId?: string | null): Round {
    let animal: Animal;

    // Elegimos un animal distinto al de la ronda anterior (si hay más de 1)
    do {
        animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    } while (excludeId && ANIMALS.length > 1 && animal.id === excludeId);

    const otherAnimals = ANIMALS.filter((a) => a.id !== animal.id);
    const randomOthers = shuffleArray(otherAnimals).slice(0, 3);
    const options = shuffleArray([animal, ...randomOthers]);

    return {
        animal,
        options,
    };
}

export default function AnimalsGamePage() {
    const [round, setRound] = useState<Round | null>(null);
    const [selected, setSelected] = useState<Animal | null>(null);
    const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
    const [showConfetti, setShowConfetti] = useState(false);
    const [showErrorEffect, setShowErrorEffect] = useState(false);

    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [lastAnimalId, setLastAnimalId] = useState<string | null>(null);

    const autoNextTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const errorEffectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null
    );

    // Primera ronda sólo en cliente
    useEffect(() => {
        const firstRound = createRound(null);
        setRound(firstRound);
        setLastAnimalId(firstRound.animal.id);
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

        const newRound = createRound(lastAnimalId);
        setRound(newRound);
        setLastAnimalId(newRound.animal.id);
        setSelected(null);
        setStatus("idle");
        setShowConfetti(false);
        setShowErrorEffect(false);
    };

    const handleAnswer = (option: Animal) => {
        if (!round || status !== "idle") return;

        setSelected(option);
        const isCorrect = option.id === round.animal.id;

        if (isCorrect) {
            setStatus("correct");
            setCorrectCount((c) => c + 1);
            setShowConfetti(true);
            // Confeti decide cuándo pasar de ronda
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

    const getOptionClasses = (option: Animal) => {
        const base =
            "flex items-center justify-center rounded-2xl border px-4 py-3 text-base font-semibold transition-all duration-150 shadow-md sm:text-lg";

        if (!round) return base + " border-zinc-800 bg-zinc-900/60";

        const isSelected = selected?.id === option.id;
        const isCorrectOption = option.id === round.animal.id;

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
                    <p className="text-zinc-400">Cargando animal...</p>
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
                        numberOfPieces={600}
                        recycle={false}
                        tweenDuration={2600}
                        onConfettiComplete={(instance) => {
                            instance?.reset();
                            handleNext();
                        }}
                    />
                )}

                {/* Efecto de fallo */}
                {showErrorEffect && <div className="red-flash-overlay" />}

                <main
                    className={
                        "w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 shadow-2xl sm:p-10 transition-transform" +
                        (showErrorEffect ? " shake" : "")
                    }
                >
                    <div className="flex flex-col items-center gap-8">
                        {/* Cabecera + volver + marcadores */}
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
                                        Juego de animales
                                    </p>
                                    <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">
                                        ¿Qué animal es este?
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

                        {/* Animal arriba centrado */}
                        <div className="flex items-center justify-center">
                            <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-zinc-900/80 border border-zinc-700 shadow-xl">
                                <span className="text-7xl sm:text-8xl drop-shadow">
                                    {round.animal.emoji}
                                </span>
                            </div>
                        </div>

                        {/* Opciones abajo */}
                        <div className="grid w-full gap-4 sm:grid-cols-2">
                            {round.options.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => handleAnswer(option)}
                                    disabled={status !== "idle"}
                                    className={getOptionClasses(option)}
                                >
                                    {option.name}
                                </button>
                            ))}
                        </div>

                        {/* Mensaje inferior */}
                        <div className="flex w-full flex-col items-center gap-3 pt-2 text-center min-h-[3rem]">
                            {status === "correct" && (
                                <p className="text-emerald-400 font-medium">
                                    ✅ ¡Correcto! Era {round.animal.name}. Nuevo animal cuando
                                    termine el confeti...
                                </p>
                            )}
                            {status === "wrong" && selected && (
                                <p className="text-red-400 font-medium">
                                    ❌ {selected.name} no es correcto. Era{" "}
                                    <span className="text-emerald-300 font-semibold">
                                        {round.animal.name}
                                    </span>
                                    . Nuevo animal en 3 segundos...
                                </p>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Estilos globales para efecto de fallo */}
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
