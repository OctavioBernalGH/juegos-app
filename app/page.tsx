import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-zinc-900 text-zinc-50 flex items-center justify-center px-4">
      <main className="w-full max-w-4xl flex flex-col items-center gap-10 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight drop-shadow">
          Gaming Zone
        </h1>

        <div className="grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
          <Link
            href="/games/flag"
            className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 px-6 py-6 text-left shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:border-zinc-500 hover:bg-zinc-900/90"
          >
            <h2 className="mb-2 text-xl font-semibold group-hover:text-white">
              Juego de banderas
            </h2>
            <p className="text-sm text-zinc-400">
              Una bandera, cuatro opciones y solo una es correcta
            </p>
          </Link>

          <Link
            href="/games/memory"
            className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 px-6 py-6 text-left shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:border-zinc-500 hover:bg-zinc-900/90"
          >
            <h2 className="mb-2 text-xl font-semibold group-hover:text-white">
              Juego de memoria
            </h2>
            <p className="text-sm text-zinc-400">
              Gira las cartas para emparejarlas
            </p>
          </Link>

          <Link
            href="/games/animals"
            className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 px-6 py-6 text-left shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:border-zinc-500 hover:bg-zinc-900/90"
          >
            <h2 className="mb-2 text-xl font-semibold group-hover:text-white">
              Acierta el animal
            </h2>
            <p className="text-sm text-zinc-400">
              Un animal, cuatro opciones y solo una es correcta
            </p>
          </Link>

          <Link
            href="/games/colors"
            className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 px-6 py-6 text-left shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:border-zinc-500 hover:bg-zinc-900/90"
          >
            <h2 className="mb-2 text-xl font-semibold group-hover:text-white">
              Juego de Colores
            </h2>
            <p className="text-sm text-zinc-400">
              Elige el color correcto según la palabra, no según el color del texto.
            </p>
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-6 flex flex-col items-center gap-2 text-xs sm:text-sm text-zinc-500">
          <span className="font-medium text-zinc-300">
            Octavio Bernal
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href="https://github.com/OctavioBernalGH"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-200 transition-colors underline underline-offset-4 decoration-zinc-600"
            >
              GitHub
            </a>
            <span className="text-zinc-600">•</span>
            <a
              href="https://www.linkedin.com/in/octavio-bernal-vilana-lk/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-200 transition-colors underline underline-offset-4 decoration-zinc-600"
            >
              LinkedIn
            </a>
            <span className="text-zinc-600">•</span>
            <a
              href="https://www.octavio-bernal.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-200 transition-colors underline underline-offset-4 decoration-zinc-600"
            >
              Web personal
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
