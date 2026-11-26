import { Link } from "@tanstack/react-router";
import { Flower2, Lock } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sun text-primary">
            <Flower2 className="size-6" />
          </span>
          <span className="truncate font-display text-lg font-bold text-primary">Jardín Infantil Los Girasoles</span>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden gap-5 text-sm font-semibold text-foreground/80 md:flex">
            <a href="/#inicio" className="hover:text-primary">Inicio</a>
            <a href="/#capsulas" className="hover:text-primary">Cápsulas Educativas</a>
            <a href="/#redes" className="hover:text-primary">Redes de Apoyo</a>
            <a href="/#ods11" className="hover:text-primary">ODS 11</a>
          </nav>
          <Link to="/acceso" className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground">
            <Lock className="size-3.5" /> Acceso Educadoras
          </Link>
        </div>
      </div>
    </header>
  );
}
