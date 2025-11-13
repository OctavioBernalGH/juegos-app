import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-zinc-900 text-zinc-50 flex items-center justify-center px-4">
      <main className="w-full max-w-4xl flex flex-col items-center gap-10 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight drop-shadow">
          Juegos
        </h1>

        <p className="text-zinc-400 max-w-xl">
          Elige un juego para empezar a jugar. Este es el menú principal de selección de juegos, se está trabajando para añadir más y más, gracias.
        </p>

        <div className="grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
          <Link
            href="/games/flag"
            className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 px-6 py-6 text-left shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:border-zinc-500 hover:bg-zinc-900/90"
          >
            <h2 className="mb-2 text-xl font-semibold group-hover:text-white">
              Juego de banderas
            </h2>
            <p className="text-sm text-zinc-400">
              Una bandera, cuatro opciones y solo una es correcta.
            </p>
          </Link>

          <Link
            href="/juegos/reflejos"
            className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 px-6 py-6 text-left shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:border-zinc-500 hover:bg-zinc-900/90"
          >
            <h2 className="mb-2 text-xl font-semibold group-hover:text-white">
              Reflejos
            </h2>
            <p className="text-sm text-zinc-400">
              Pulsa a tiempo, mejora tu velocidad de reacción y compite contigo
              mismo.
            </p>
          </Link>

          <Link
            href="/juegos/puzzle"
            className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 px-6 py-6 text-left shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:border-zinc-500 hover:bg-zinc-900/90"
          >
            <h2 className="mb-2 text-xl font-semibold group-hover:text-white">
              Puzzle
            </h2>
            <p className="text-sm text-zinc-400">
              Ordena piezas, resuelve patrones y reta tu pensamiento lógico.
            </p>
          </Link>

          <Link
            href="/juegos/trivia"
            className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 px-6 py-6 text-left shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:border-zinc-500 hover:bg-zinc-900/90"
          >
            <h2 className="mb-2 text-xl font-semibold group-hover:text-white">
              Trivia
            </h2>
            <p className="text-sm text-zinc-400">
              Preguntas rápidas, respuestas aún más rápidas. Demuestra lo que
              sabes.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
