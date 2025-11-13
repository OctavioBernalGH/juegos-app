"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { LucideIcon } from "lucide-react";
import {
  // navegación / UI
  ChevronLeft,
  // emociones
  Brain,
  Heart,
  Smile,
  Frown,
  Laugh,
  Meh,
  // tecnología
  Cpu,
  Smartphone,
  Gamepad2,
  Gamepad,
  Headphones,
  Monitor,
  Keyboard,
  MousePointer,
  Laptop,
  // animales
  Cat,
  Dog,
  Bird,
  Bug,
  Fish,
  Rat,
  // objetos / naturaleza
  Cloud,
  Sun,
  Moon,
  Star,
  Music,
  Zap,
  Rocket,
  Car,
  Pizza,
  IceCream,
  IceCream2,
  Coffee,
  Beer,
  Cake,
  Carrot,
  Plane,
  Train,
  Truck,
  TreeDeciduous,
  TreePine,
  Umbrella,
  Tv,
} from "lucide-react";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

type Theme = "animales" | "tecnologia" | "emociones" | "objetos";

type IconDef = {
  id: string;
  icon: LucideIcon;
  label: string;
  theme: Theme;
  color: string;
};

type Card = {
  id: string;
  pairId: string;
  icon: LucideIcon;
  label: string;
  theme: Theme;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const TOTAL_PAIRS = 8;

// Base de iconos, ahora con mucha más variedad
const ICON_DEFS: IconDef[] = [
  // Animales
  { id: "cat", icon: Cat, label: "Gato", theme: "animales", color: "text-orange-300" },
  { id: "dog", icon: Dog, label: "Perro", theme: "animales", color: "text-yellow-300" },
  { id: "bird", icon: Bird, label: "Pájaro", theme: "animales", color: "text-sky-300" },
  { id: "bug", icon: Bug, label: "Bicho", theme: "animales", color: "text-lime-300" },
  { id: "fish", icon: Fish, label: "Pez", theme: "animales", color: "text-teal-300" },
  { id: "rat", icon: Rat, label: "Rata", theme: "animales", color: "text-stone-300" },

  // Tecnología
  { id: "cpu", icon: Cpu, label: "CPU", theme: "tecnologia", color: "text-cyan-300" },
  { id: "phone", icon: Smartphone, label: "Móvil", theme: "tecnologia", color: "text-blue-300" },
  { id: "gamepad2", icon: Gamepad2, label: "Mando pro", theme: "tecnologia", color: "text-purple-300" },
  { id: "gamepad", icon: Gamepad, label: "Mando", theme: "tecnologia", color: "text-indigo-300" },
  { id: "headphones", icon: Headphones, label: "Auriculares", theme: "tecnologia", color: "text-indigo-200" },
  { id: "monitor", icon: Monitor, label: "Monitor", theme: "tecnologia", color: "text-sky-200" },
  { id: "keyboard", icon: Keyboard, label: "Teclado", theme: "tecnologia", color: "text-emerald-200" },
  { id: "mousepointer", icon: MousePointer, label: "Puntero", theme: "tecnologia", color: "text-slate-200" },
  { id: "laptop", icon: Laptop, label: "Portátil", theme: "tecnologia", color: "text-fuchsia-200" },
  { id: "tv", icon: Tv, label: "Televisor", theme: "tecnologia", color: "text-amber-200" },

  // Emociones
  { id: "heart", icon: Heart, label: "Amor", theme: "emociones", color: "text-rose-300" },
  { id: "smile", icon: Smile, label: "Alegría", theme: "emociones", color: "text-emerald-300" },
  { id: "frown", icon: Frown, label: "Tristeza", theme: "emociones", color: "text-slate-300" },
  { id: "brain", icon: Brain, label: "Concentración", theme: "emociones", color: "text-fuchsia-300" },
  { id: "laugh", icon: Laugh, label: "Risa", theme: "emociones", color: "text-yellow-300" },
  { id: "meh", icon: Meh, label: "Indiferente", theme: "emociones", color: "text-zinc-300" },

  // Objetos / naturaleza / comida / transporte
  { id: "cloud", icon: Cloud, label: "Nube", theme: "objetos", color: "text-sky-300" },
  { id: "sun", icon: Sun, label: "Sol", theme: "objetos", color: "text-amber-300" },
  { id: "moon", icon: Moon, label: "Luna", theme: "objetos", color: "text-indigo-200" },
  { id: "star", icon: Star, label: "Estrella", theme: "objetos", color: "text-yellow-300" },
  { id: "music", icon: Music, label: "Música", theme: "objetos", color: "text-pink-300" },
  { id: "zap", icon: Zap, label: "Rayo", theme: "objetos", color: "text-yellow-400" },
  { id: "rocket", icon: Rocket, label: "Cohete", theme: "objetos", color: "text-red-300" },
  { id: "car", icon: Car, label: "Coche", theme: "objetos", color: "text-orange-400" },
  { id: "pizza", icon: Pizza, label: "Pizza", theme: "objetos", color: "text-orange-300" },
  { id: "icecream", icon: IceCream, label: "Helado", theme: "objetos", color: "text-rose-300" },
  { id: "icecream2", icon: IceCream2, label: "Helado doble", theme: "objetos", color: "text-fuchsia-300" },
  { id: "coffee", icon: Coffee, label: "Café", theme: "objetos", color: "text-stone-300" },
  { id: "beer", icon: Beer, label: "Cerveza", theme: "objetos", color: "text-yellow-200" },
  { id: "cake", icon: Cake, label: "Tarta", theme: "objetos", color: "text-purple-200" },
  { id: "carrot", icon: Carrot, label: "Zanahoria", theme: "objetos", color: "text-orange-200" },
  { id: "plane", icon: Plane, label: "Avión", theme: "objetos", color: "text-sky-200" },
  { id: "train", icon: Train, label: "Tren", theme: "objetos", color: "text-emerald-200" },
  { id: "truck", icon: Truck, label: "Camión", theme: "objetos", color: "text-slate-200" },
  { id: "tree1", icon: TreeDeciduous, label: "Árbol", theme: "objetos", color: "text-green-300" },
  { id: "tree2", icon: TreePine, label: "Pino", theme: "objetos", color: "text-emerald-300" },
  { id: "umbrella", icon: Umbrella, label: "Paraguas", theme: "objetos", color: "text-blue-200" },
];

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createBoard(): Card[] {
  // Elegimos 8 iconos distintos de la lista base
  const shuffledIcons = shuffleArray(ICON_DEFS);
  const selected = shuffledIcons.slice(0, TOTAL_PAIRS);

  const cards: Card[] = [];

  selected.forEach((def) => {
    const base: Omit<Card, "id" | "isFlipped" | "isMatched"> = {
      pairId: def.id,
      icon: def.icon,
      label: def.label,
      theme: def.theme,
      color: def.color,
    };

    cards.push({
      id: `${def.id}-1`,
      ...base,
      isFlipped: false,
      isMatched: false,
    });

    cards.push({
      id: `${def.id}-2`,
      ...base,
      isFlipped: false,
      isMatched: false,
    });
  });

  return shuffleArray(cards);
}

export default function MemoryGamePage() {
  const [cards, setCards] = useState<Card[] | null>(null);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [status, setStatus] = useState<"idle" | "match" | "mismatch" | "finished">("idle");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showErrorEffect, setShowErrorEffect] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Inicializamos tablero sólo en cliente (evitar hidratado random)
  useEffect(() => {
    setCards(createBoard());
  }, []);

  useEffect(() => {
    return () => {
      if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    };
  }, []);

  const resetGame = () => {
    if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    setCards(createBoard());
    setFlippedIndices([]);
    setMoves(0);
    setMatchCount(0);
    setWrongCount(0);
    setStatus("idle");
    setShowConfetti(false);
    setShowErrorEffect(false);
    setIsChecking(false);
  };

  const handleCardClick = (index: number) => {
    if (!cards || isChecking || status === "finished") return;

    const card = cards[index];
    if (card.isFlipped || card.isMatched) return;
    if (flippedIndices.length === 2) return;

    const newCards = cards.map((c, i) => (i === index ? { ...c, isFlipped: true } : c));
    const newFlipped = [...flippedIndices, index];

    setCards(newCards);
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      setMoves((m) => m + 1);

      const [firstIndex, secondIndex] = newFlipped;
      const first = newCards[firstIndex];
      const second = newCards[secondIndex];

      if (first.pairId === second.pairId) {
        // Pareja correcta
        const updated = newCards.map((c, i) =>
          newFlipped.includes(i) ? { ...c, isMatched: true } : c
        );

        const newMatchCount = matchCount + 1;

        setCards(updated);
        setFlippedIndices([]);
        setIsChecking(false);
        setMatchCount(newMatchCount);
        setShowConfetti(true);

        if (newMatchCount >= TOTAL_PAIRS) {
          setStatus("finished");
        } else {
          setStatus("match");
        }
      } else {
        // No coinciden
        setWrongCount((w) => w + 1);
        setStatus("mismatch");
        setShowErrorEffect(true);

        if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
        checkTimeoutRef.current = setTimeout(() => {
          setCards((current) => {
            if (!current) return current;
            return current.map((c, i) =>
              newFlipped.includes(i) && !c.isMatched ? { ...c, isFlipped: false } : c
            );
          });
          setFlippedIndices([]);
          setShowErrorEffect(false);
          setIsChecking(false);
          setStatus("idle");
        }, 900);
      }
    }
  };

  const getCardInnerClass = (card: Card) => {
    const flipped = card.isFlipped || card.isMatched;
    return (
      "relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]" +
      (flipped ? " [transform:rotateY(180deg)]" : "")
    );
  };

  const getCardFrontClass = (card: Card) => {
    const base =
      "absolute inset-0 rounded-2xl border bg-zinc-900/80 flex items-center justify-center text-zinc-400 shadow-md [backface-visibility:hidden]";
    if (card.isMatched) {
      return (
        base +
        " border-emerald-500/70 bg-emerald-900/60 text-emerald-200 shadow-emerald-700/40"
      );
    }
    if (card.isFlipped) {
      return base + " border-zinc-700";
    }
    return base + " border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900 cursor-pointer";
  };

  const getCardBackClass = () => {
    return "absolute inset-0 rounded-2xl border border-zinc-700 bg-zinc-950/90 flex flex-col items-center justify-center gap-2 shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]";
  };

  if (!cards) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-zinc-900 text-zinc-50 flex items-center justify-center px-4">
        <main className="w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 shadow-2xl sm:p-10 text-center">
          <p className="text-zinc-400">Preparando cartas de memoria...</p>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-zinc-900 text-zinc-50 flex items-center justify-center px-4 overflow-hidden">
        {/* Confeti al acertar / completar */}
        {showConfetti && (
          <Confetti
            numberOfPieces={status === "finished" ? 700 : 350}
            recycle={false}
            tweenDuration={2200}
            onConfettiComplete={(confettiInstance) => {
              confettiInstance?.reset();
              setShowConfetti(false);
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
            {/* Cabecera + botón volver + marcadores */}
            <div className="flex w-full items-start justify-between gap-4">
              <div className="flex flex-col gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-[11px] font-medium text-zinc-200 hover:bg-zinc-800 hover:border-zinc-400 transition-colors"
                >
                  <ChevronLeft className="h-3 w-3" />
                  Volver
                </Link>
                <div className="text-left">
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-400">
                    Juego de memoria
                  </p>
                  <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">
                    Encuentra todas las parejas de iconos
                  </h1>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1 flex items-center gap-1">
                    <span>✅</span>
                    <span className="font-semibold">
                      {matchCount}/{TOTAL_PAIRS}
                    </span>
                  </div>
                  <div className="rounded-full border border-red-500/60 bg-red-500/10 px-3 py-1 flex items-center gap-1">
                    <span>❌</span>
                    <span className="font-semibold">{wrongCount}</span>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Movimientos: <span className="font-semibold">{moves}</span>
                </p>
                <button
                  type="button"
                  onClick={resetGame}
                  className="mt-1 inline-flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-[11px] font-medium text-zinc-200 hover:bg-zinc-800 hover:border-zinc-400 transition-colors"
                >
                  Reiniciar juego
                </button>
              </div>
            </div>

            {/* Grid de cartas */}
            <div className="grid w-full max-w-xl grid-cols-4 gap-3 sm:gap-4">
              {cards.map((card, index) => {
                const Icon = card.icon;
                const flipped = card.isFlipped || card.isMatched;

                return (
                  <button
                    key={card.id}
                    type="button"
                    disabled={isChecking || card.isMatched || flipped}
                    onClick={() => handleCardClick(index)}
                    className="relative h-20 sm:h-24 [perspective:1000px]"
                  >
                    <div className={getCardInnerClass(card)}>
                      {/* Dorso (carta boca abajo / matched) */}
                      <div className={getCardFrontClass(card)}>
                        {!card.isFlipped && !card.isMatched && (
                          <span className="text-sm font-semibold text-zinc-400">?</span>
                        )}
                        {card.isMatched && (
                          <Icon className={"h-8 w-8 sm:h-9 sm:w-9 " + card.color} />
                        )}
                      </div>

                      {/* Cara con icono (boca arriba) */}
                      <div className={getCardBackClass()}>
                        <Icon className={"h-8 w-8 sm:h-9 sm:w-9 " + card.color} />
                        <span className="text-[11px] sm:text-xs text-zinc-300">
                          {card.label}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Mensaje inferior */}
            <div className="flex w-full flex-col items-center gap-3 pt-2 text-center min-h-[3rem]">
              {status === "match" && (
                <p className="text-emerald-400 font-medium">
                  ✅ ¡Pareja encontrada! Sigue así.
                </p>
              )}
              {status === "mismatch" && (
                <p className="text-red-400 font-medium">
                  ❌ No coinciden. Prueba con otra combinación.
                </p>
              )}
              {status === "finished" && (
                <p className="text-emerald-300 font-semibold">
                  🎉 Has encontrado las {TOTAL_PAIRS} parejas en {moves} movimientos.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Estilos globales para el efecto de fallo (igual que en banderas) */}
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
