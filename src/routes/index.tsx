import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Calendar, PlayCircle, Users, Trees, HeartHandshake, Flower2 } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CapsuleDialog } from "@/components/site/CapsuleDialog";
import { CATEGORIES, capsulesQuery, type Capsule } from "@/lib/capsules";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jardín Infantil Los Girasoles — Prevención y Apoyo Familiar" },
      { name: "description", content: "Cápsulas educativas sobre prevención, educación emocional y redes de apoyo para familias de Maipú." },
    ],
  }),
  component: Index,
});

const fmt = (d: string) => new Date(d).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });

function Index() {
  const { data: capsules = [], isLoading } = useQuery(capsulesQuery);
  const [filter, setFilter] = useState<string>("Todas");
  const [open, setOpen] = useState<Capsule | null>(null);
  const shown = filter === "Todas" ? capsules : capsules.filter((c) => c.category === filter);

  return (
    <div className="min-h-screen bg-background font-sans">
      <SiteHeader />
      <section id="inicio" className="relative overflow-hidden bg-linear-to-br from-secondary via-background to-accent/20">
        <Flower2 aria-hidden className="absolute -right-16 -top-16 size-96 text-sun/40" />
        <Flower2 aria-hidden className="absolute -bottom-20 left-1/3 size-60 text-accent/15" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <p className="mb-4 inline-block rounded-full bg-card px-4 py-1 text-xs font-bold uppercase tracking-wider text-accent">Comunidad · Maipú</p>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight text-primary md:text-6xl">
            Cuidando la Primera Infancia: Prevención, Educación Emocional y Comunidad
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-foreground/80">
            Un espacio para concientizar sobre la prevención del consumo de drogas desde los primeros años y acompañar a las familias y cuidadores principales de nuestro sector.
          </p>
          <a href="#capsulas" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-lg hover:bg-primary/90">
            <PlayCircle className="size-5" /> Ver cápsulas educativas
          </a>
        </div>
      </section>

      <section id="capsulas" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-3xl font-bold text-primary">Cápsulas para Familias y Cuidadores</h2>
        <p className="mt-2 text-muted-foreground">Videos y consejos breves preparados por nuestras educadoras.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {["Todas", ...CATEGORIES].map((c) => (
            <button key={c} onClick={() => setFilter(c)} className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${filter === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading && <p className="text-muted-foreground">Cargando cápsulas…</p>}
          {!isLoading && shown.length === 0 && <p className="text-muted-foreground">Aún no hay cápsulas en esta categoría.</p>}
          {shown.map((c) => (
            <article key={c.id} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">{c.category}</span>
              <h3 className="mt-4 font-display text-xl font-bold text-primary">{c.title}</h3>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="size-3.5" /> {fmt(c.created_at)}</p>
              <p className="mt-3 flex-1 text-sm text-foreground/80">{c.summary}</p>
              <button onClick={() => setOpen(c)} className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-foreground hover:bg-accent/90">
                <PlayCircle className="size-4" /> Ver Cápsula / Video
              </button>
            </article>
          ))}
        </div>
      </section>

      <section id="redes" className="bg-muted py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl font-bold text-primary">Pilares de Acción y Redes de Apoyo</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Pillar icon={Users} title="Charlas y Reuniones" text="Talleres periódicos para familias y niños/as sobre crianza respetuosa, prevención y bienestar emocional. Consulta fechas con tu educadora." />
            <div id="ods11"><Pillar icon={Trees} title="Recreación y Espacios Seguros" text="El juego es un derecho. Promovemos el uso de plazas y la recuperación de áreas verdes, alineados al ODS 11: Ciudades y comunidades sostenibles." /></div>
            <Pillar icon={HeartHandshake} title="Trabajo Colaborativo" text="Red de derivación con CESFAM, psicólogos, educadoras y vecinos, incluyendo iniciativas solidarias como bingos de apoyo a familias." />
          </div>
        </div>
      </section>

      <SiteFooter />
      <CapsuleDialog capsule={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function Pillar({ icon: Icon, title, text }: { icon: typeof Users; title: string; text: string }) {
  return (
    <div className="h-full rounded-2xl bg-card p-6 shadow-sm">
      <span className="flex size-12 items-center justify-center rounded-xl bg-sun text-primary"><Icon className="size-6" /></span>
      <h3 className="mt-4 font-display text-xl font-bold text-primary">{title}</h3>
      <p className="mt-2 text-sm text-foreground/80">{text}</p>
    </div>
  );
}
