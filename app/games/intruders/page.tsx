"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

type Category =
  | "animales"
  | "comida"
  | "vehiculos"
  | "objetos"
  | "caritas"
  | "naturaleza"
  | "deportes";

type IconItem = {
  id: string;
  emoji: string;
  label: string;
  category: Category;
};

type Round = {
  items: IconItem[];
  intruder: IconItem;
  baseCategory: Category;
};

const CATEGORY_LABELS: Record<Category, string> = {
  animales: "animales",
  comida: "comida",
  vehiculos: "vehículos",
  objetos: "objetos",
  caritas: "caritas / emociones",
  naturaleza: "naturaleza",
  deportes: "deportes",
};

// Pool de iconos agrupados por categoría
const ICONS: IconItem[] = [
  // Animales
  { id: "perro", emoji: "🐶", label: "Perro", category: "animales" },
  { id: "gato", emoji: "🐱", label: "Gato", category: "animales" },
  { id: "raton", emoji: "🐭", label: "Ratón", category: "animales" },
  { id: "panda", emoji: "🐼", label: "Panda", category: "animales" },
  { id: "tigre", emoji: "🐯", label: "Tigre", category: "animales" },
  { id: "leon", emoji: "🦁", label: "León", category: "animales" },
  { id: "mono", emoji: "🐵", label: "Mono", category: "animales" },
  { id: "cerdo", emoji: "🐷", label: "Cerdo", category: "animales" },

  // Comida
  { id: "manzana", emoji: "🍎", label: "Manzana", category: "comida" },
  { id: "platano", emoji: "🍌", label: "Plátano", category: "comida" },
  { id: "fresa", emoji: "🍓", label: "Fresa", category: "comida" },
  { id: "sandia", emoji: "🍉", label: "Sandía", category: "comida" },
  { id: "pizza", emoji: "🍕", label: "Pizza", category: "comida" },
  { id: "hamburguesa", emoji: "🍔", label: "Hamburguesa", category: "comida" },
  { id: "helado", emoji: "🍦", label: "Helado", category: "comida" },
  { id: "pastel", emoji: "🍰", label: "Pastel", category: "comida" },

  // Vehículos
  { id: "coche", emoji: "🚗", label: "Coche", category: "vehiculos" },
  { id: "bus", emoji: "🚌", label: "Autobús", category: "vehiculos" },
  { id: "tren", emoji: "🚆", label: "Tren", category: "vehiculos" },
  { id: "avion", emoji: "✈️", label: "Avión", category: "vehiculos" },
  { id: "bici", emoji: "🚲", label: "Bicicleta", category: "vehiculos" },
  { id: "moto", emoji: "🏍️", label: "Moto", category: "vehiculos" },
  { id: "barco", emoji: "⛵", label: "Barco", category: "vehiculos" },
  { id: "cohete", emoji: "🚀", label: "Cohete", category: "vehiculos" },

  // Objetos
  { id: "libro", emoji: "📘", label: "Libro", category: "objetos" },
  { id: "lampara", emoji: "💡", label: "Lámpara", category: "objetos" },
  { id: "reloj", emoji: "⌚", label: "Reloj", category: "objetos" },
  { id: "llave", emoji: "🔑", label: "Llave", category: "objetos" },
  { id: "gafas", emoji: "👓", label: "Gafas", category: "objetos" },
  { id: "bolso", emoji: "👜", label: "Bolso", category: "objetos" },
  { id: "campana", emoji: "🔔", label: "Campana", category: "objetos" },
  { id: "lapiz", emoji: "✏️", label: "Lápiz", category: "objetos" },

  // Caritas / emociones
  { id: "sonrisa", emoji: "😊", label: "Sonrisa", category: "caritas" },
  { id: "risa", emoji: "😄", label: "Risa", category: "caritas" },
  { id: "triste", emoji: "😢", label: "Tristeza", category: "caritas" },
  { id: "enfado", emoji: "😠", label: "Enfado", category: "caritas" },
  { id: "miedito", emoji: "😱", label: "Susto", category: "caritas" },
  { id: "enamorado", emoji: "😍", label: "Enamorado", category: "caritas" },
  { id: "pensativo", emoji: "🤔", label: "Pensativo", category: "caritas" },
  { id: "dormido", emoji: "😴", label: "Dormido", category: "caritas" },

  // Naturaleza
  { id: "arbol", emoji: "🌳", label: "Árbol", category: "naturaleza" },
  { id: "flor", emoji: "🌸", label: "Flor", category: "naturaleza" },
  { id: "hoja", emoji: "🍃", label: "Hoja", category: "naturaleza" },
  { id: "fuego", emoji: "🔥", label: "Fuego", category: "naturaleza" },
  { id: "montana", emoji: "⛰️", label: "Montaña", category: "naturaleza" },
  { id: "arcoiris", emoji: "🌈", label: "Arcoíris", category: "naturaleza" },
  { id: "nube", emoji: "☁️", label: "Nube", category: "naturaleza" },
  { id: "gota", emoji: "💧", label: "Gota de agua", category: "naturaleza" },

  // Deportes
  { id: "futbol", emoji: "⚽", label: "Fútbol", category: "deportes" },
  { id: "baloncesto", emoji: "🏀", label: "Baloncesto", category: "deportes" },
  { id: "balonvolea", emoji: "🏐", label: "Voleibol", category: "deportes" },
  { id: "tenis", emoji: "🎾", label: "Tenis", category: "deportes" },
  { id: "beisbol", emoji: "⚾", label: "Béisbol", category: "deportes" },
  { id: "rugby", emoji: "🏉", label: "Rugby", category: "deportes" },
  { id: "trofeo", emoji: "🏆", label: "Trofeo", category: "deportes" },
  { id: "medalla", emoji: "🥇", label: "Medalla", category: "deportes" },
];

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const CATEGORIES: Category[] = [
  "animales",
  "comida",
  "vehiculos",
  "objetos",
  "caritas",
  "naturaleza",
  "deportes",
];

// Crea una ronda: muchos de una categoría + 1 intruso de otra
function createRound(): Round {
  const baseCategory =
    CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

  const baseItems = ICONS.filter((i) => i.category === baseCategory);
  const intruderCandidates = ICONS.filter((i) => i.category !== baseCategory);

  const baseCount = Math.min(7, baseItems.length); // 7 de la misma categoría
  const selectedBase = shuffleArray(baseItems).slice(0, baseCount);
  const intruder = shuffleArray(intruderCandidates)[0];

  const items = shuffleArray([...selectedBase, intruder]);

  return {
    items,
    intruder,
    baseCategory,
  };
}

export default function IntruderGamePage() {
  const [round, setRound] = useState<Round | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showErrorEffect, setShowErrorEffect] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const autoNextTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorEffectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // Primera ronda solo en cliente
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

  const handleAnswer = (item: IconItem) => {
    if (!round || status !== "idle") return;

    setSelectedId(item.id);
    const isCorrect = item.id === round.intruder.id;

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

  const getItemClasses = (item: IconItem) => {
    const base =
      "flex flex-col items-center justify-center gap-1 rounded-2xl border px-3 py-3 text-sm font-semibold transition-all duration-150 shadow-md sm:text-base";

    if (!round) return base + " border-zinc-800 bg-zinc-900/60";

    const isSelected = selectedId === item.id;
    const isIntruder = round.intruder.id === item.id;

    if (status === "idle") {
      return (
        base +
        " border-zinc-700 bg-zinc-900/70 hover:-translate-y-1 hover:border-zinc-400 hover:bg-zinc-900"
      );
    }

    if (status === "correct") {
      if (isIntruder) {
        return (
          base +
          " border-emerald-500 bg-emerald-600 text-white shadow-lg shadow-emerald-700/40"
        );
      }
      return base + " border-zinc-800 bg-zinc-900/60 opacity-60";
    }

    // status === "wrong"
    if (isIntruder) {
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
          <p className="text-zinc-400">Preparando intrusos...</p>
        </main>
      </div>
    );
  }

  const baseCategoryLabel = CATEGORY_LABELS[round.baseCategory];

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
                    Encuentra el intruso
                  </p>
                  <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">
                    Casi todos son {baseCategoryLabel}. ¿Cuál no encaja?
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

            {/* Grid de iconos */}
            <div className="grid w-full max-w-xl grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
              {round.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={status !== "idle"}
                  onClick={() => handleAnswer(item)}
                  className={getItemClasses(item)}
                >
                  <span className="text-3xl sm:text-4xl drop-shadow">
                    {item.emoji}
                  </span>
                  <span className="text-[11px] sm:text-xs text-zinc-300">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Mensaje inferior */}
            <div className="flex w-full flex-col items-center gap-3 pt-2 text-center min-h-[3rem]">
              {status === "idle" && (
                <p className="text-zinc-400 text-sm">
                  Todos son{" "}
                  <span className="font-semibold text-zinc-200">
                    {baseCategoryLabel}
                  </span>{" "}
                  excepto uno. Pulsa sobre el intruso.
                </p>
              )}
              {status === "correct" && (
                <p className="text-emerald-400 font-medium">
                  ✅ ¡Bien visto!{" "}
                  <span className="font-semibold">
                    {round.intruder.label}
                  </span>{" "}
                  era el intruso. Nueva ronda cuando termine el confeti...
                </p>
              )}
              {status === "wrong" && selectedId && (
                <p className="text-red-400 font-medium">
                  ❌ Esa opción no era el intruso. El intruso era{" "}
                  <span className="text-emerald-300 font-semibold">
                    {round.intruder.label}
                  </span>
                  . Nueva ronda en unos segundos...
                </p>
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
