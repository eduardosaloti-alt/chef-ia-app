import Link from "next/link";

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-cream dark:bg-cacau">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/">
          <p className="font-display text-2xl italic text-framboesa">Chef IA</p>
        </Link>
        <Link href="/login" className="text-sm text-cacau/70 dark:text-cream/70">
          Entrar
        </Link>
      </header>
      <div className="mx-auto max-w-2xl px-6 py-12 text-center">
        <p className="text-cacau/70 dark:text-cream/70">
          Em breve: teste rapido para descobrir se a Chef IA e para voce.
        </p>
      </div>
    </div>
  );
}
