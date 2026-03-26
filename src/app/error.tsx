"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center">
      <div className="card-dark w-full p-8 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-latao)]">Falha de rota</p>
        <h1 className="mt-3 font-serif text-4xl text-[var(--color-paper)]">A campanha perdeu o trilho por um instante</h1>
        <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
          O conteudo desta etapa nao conseguiu abrir corretamente. Voce pode tentar novamente ou voltar para o hub principal.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => unstable_retry()} className="btn-primary">
            Tentar de novo
          </button>
          <Link href="/" className="btn-secondary">
            Voltar ao hub
          </Link>
        </div>
      </div>
    </section>
  );
}
