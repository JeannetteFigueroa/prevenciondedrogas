import { useQuery } from "@tanstack/react-query";
import { Phone, MapPin, BookOpen, Code2 } from "lucide-react";
import { settingsQuery } from "@/lib/capsules";

export function SiteFooter() {
  const { data: team } = useQuery(settingsQuery);
  return (
    <footer className="mt-20 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-display text-lg"><Phone className="size-5 text-sun" /> Orientación y Ayuda</h3>
          <p className="text-sm opacity-90">Líneas gratuitas y confidenciales en Chile:</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li><strong>SENDA Previene:</strong> 1412</li>
            <li><strong>Fono Infancia:</strong> 800 200 818</li>
          </ul>
          <p className="mt-3 flex items-center gap-1.5 text-sm opacity-90"><MapPin className="size-4" /> Comuna de Maipú, Región Metropolitana</p>
        </div>
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-display text-lg"><BookOpen className="size-5 text-sun" /> Contenido e Investigación Preventiva</h3>
          <p className="text-sm opacity-90">Equipo de Estudiantes Educadoras de UAH:</p>
          <p className="mt-1 text-sm font-semibold">{team || "…"}</p>
        </div>
        <div className="rounded-xl bg-primary-foreground/10 p-5">
          <h3 className="mb-2 flex items-center gap-2 font-display text-lg"><Code2 className="size-5 text-sun" /> Desarrollo Web</h3>
          <p className="text-sm">Desarrollo y Diseño Web por <strong>Jeannette Figueroa</strong> — Estudiante de Ingeniería en Informática, Duoc UC</p>
        </div>
      </div>
      <p className="border-t border-primary-foreground/15 py-4 text-center text-xs opacity-75">© {new Date().getFullYear()} Jardín Infantil Los Girasoles · Prevención y Apoyo Familiar</p>
    </footer>
  );
}
