import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center">
      <div className="card-dark w-full p-8 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-latao)]">404</p>
        <h1 className="mt-3 font-serif text-4xl text-[var(--color-paper)]">Este trecho nao existe no mapa da EFMM</h1>
        <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
          A rota procurada nao faz parte desta experiencia. Volte ao hub para continuar a jornada principal.
        </p>
        <div className="mt-6 flex justify-center">
          <Link href="/" className="btn-primary">
            Ir para o hub
          </Link>
        </div>
      </div>
    </section>
  );
}
