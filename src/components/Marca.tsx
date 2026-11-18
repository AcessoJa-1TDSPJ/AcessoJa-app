import { Link } from "react-router";

export function PinoMarca({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 60" className={className} aria-hidden="true">
      <path d="M24 2C11.8 2 3 11 3 22.5 3 36 24 58 24 58s21-22 21-35.5C45 11 36.2 2 24 2z" fill="#E96B3C" />
      <rect x="21.3" y="11" width="5.4" height="18" rx="2.7" fill="#fff" />
      <circle cx="24" cy="37" r="3.2" fill="#fff" />
    </svg>
  );
}

export function Marca() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2.5 text-[25px] font-bold tracking-[-0.03em]" aria-label="Acesso Já, página inicial">
      <PinoMarca />
      <span className="whitespace-nowrap">
        acesso j<b className="marca-ja">a</b>
      </span>
    </Link>
  );
}
