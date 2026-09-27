import type { ReactNode } from "react";
import Link from "next/link";
import { IconArrow, IconChevron } from "@/components/icons";

export function PageShell({
  eyebrow,
  title,
  lead,
  children,
  aside,
  related,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  children: ReactNode;
  aside?: ReactNode;
  related?: { href: string; label: string; note: string }[];
}) {
  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 pb-8 pt-4 sm:px-6 lg:px-10 lg:pt-6">
      <header className="max-w-[62ch]">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="mt-3 text-[24px] font-extrabold leading-tight tracking-tight sm:text-[30px]">
          {title}
        </h1>
        <p className="mt-3 text-[14px] leading-[1.95] text-muted">{lead}</p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">{children}</div>
        {aside ? <aside className="space-y-3">{aside}</aside> : null}
      </div>

      {related?.length ? (
        <nav
          className="mt-10 border-t border-line pt-6"
          aria-label="بخش‌های مرتبط"
        >
          <h2 className="mb-3 text-[12.5px] font-bold text-faint">
            ادامه‌ی مسیر
          </h2>
          <ul className="grid gap-2.5 sm:grid-cols-3">
            {related.map((r) => (
              <li key={r.href + r.label}>
                <Link
                  href={r.href}
                  className="group flex h-full flex-col justify-between rounded-lg border border-line bg-surface p-3.5 transition-colors hover:border-accent/40"
                >
                  <span className="block text-[13.5px] font-bold">
                    {r.label}
                  </span>
                  <span className="mt-1.5 block text-[11.5px] leading-relaxed text-muted">
                    {r.note}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-bold text-accent">
                    رفتن
                    <IconArrow
                      size={12}
                      className="transition-transform group-hover:-translate-x-0.5"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}

export function Accordion({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <ul className="divide-y divide-[color:var(--color-line-soft)] overflow-hidden rounded-lg border border-line bg-surface">
      {items.map((it, i) => (
        <li key={i} className="group">
          <details open={i === 0} className="px-4">
            <summary className="flex cursor-pointer list-none items-center gap-3 py-3.5 text-[14px] font-bold marker:hidden">
              <span className="min-w-0 flex-1">{it.q}</span>
              <IconChevron
                dir="down"
                size={15}
                className="shrink-0 text-faint transition-transform duration-200 group-open:rotate-180"
              />
            </summary>
            <div className="pb-4 text-[13px] leading-[1.95] text-muted">
              {it.a}
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}

export function FactCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <section className="rounded-lg border border-line bg-surface p-4">
      <h2 className="text-[13.5px] font-bold">{title}</h2>
      <ul className="mt-2.5 space-y-2 text-[12.5px] leading-relaxed text-muted">
        {lines.map((l) => (
          <li key={l} className="flex items-start gap-2">
            <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent" />
            {l}
          </li>
        ))}
      </ul>
    </section>
  );
}
