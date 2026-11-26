import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { Lock, LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEditor } from "@/hooks/use-editor";
import { CATEGORIES, capsulesQuery, settingsQuery, toEmbedUrl, type Capsule } from "@/lib/capsules";

export const Route = createFileRoute("/acceso")({
  head: () => ({ meta: [{ title: "Acceso Educadoras — Los Girasoles" }, { name: "robots", content: "noindex" }] }),
  component: AccessPage,
});

function AccessPage() {
  const { ready, user, isEditor } = useEditor();
  return (
    <div className="min-h-screen bg-background font-sans">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-12">
        {!ready ? <p className="text-muted-foreground">Cargando…</p> : user && isEditor ? <Panel /> : <LoginForm unauthorized={!!user && !isEditor} />}
      </main>
      <SiteFooter />
    </div>
  );
}

function LoginForm({ unauthorized }: { unauthorized: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (unauthorized) {
      supabase.auth.signOut();
      setError("Esta cuenta no tiene permiso para entrar al panel.");
    }
  }, [unauthorized]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setError("Correo o contraseña incorrectos.");
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
      <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-sun text-primary"><Lock className="size-6" /></span>
      <h1 className="mt-4 text-center font-display text-2xl font-bold text-primary">Acceso Educadoras</h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">Ingreso exclusivo para el equipo del jardín.</p>
      <div className="mt-6 space-y-4">
        <div className="space-y-1.5"><Label htmlFor="email">Correo</Label><Input id="email" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-1.5"><Label htmlFor="pw">Contraseña</Label><Input id="pw" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        {error && <p className="text-sm font-semibold text-destructive">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full">{busy ? "Ingresando…" : "Ingresar"}</Button>
      </div>
    </form>
  );
}

type Draft = { id?: string; title: string; category: string; video_url: string; summary: string; description: string };
const empty: Draft = { title: "", category: CATEGORIES[0], video_url: "", summary: "", description: "" };

function Panel() {
  const qc = useQueryClient();
  const { data: capsules = [] } = useQuery(capsulesQuery);
  const [draft, setDraft] = useState<Draft | null>(null);

  const save = useMutation({
    mutationFn: async (d: Draft) => {
      const row = { title: d.title, category: d.category, video_url: d.video_url || null, summary: d.summary, description: d.description };
      const { error } = d.id ? await supabase.from("capsules").update(row).eq("id", d.id) : await supabase.from("capsules").insert(row);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["capsules"] }); setDraft(null); },
  });
  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("capsules").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["capsules"] }),
  });

  const edit = (c: Capsule) => setDraft({ id: c.id, title: c.title, category: c.category, video_url: c.video_url ?? "", summary: c.summary, description: c.description });

  return (
    <div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <h1 className="font-display text-3xl font-bold text-primary">Panel de Educadoras</h1>
        <Button variant="outline" onClick={() => supabase.auth.signOut()}><LogOut className="size-4" /> Salir</Button>
      </div>
      <Button size="lg" className="mt-6 h-14 w-full text-lg sm:w-auto" onClick={() => setDraft(empty)}><Plus className="size-5" /> Nueva Cápsula Educativa</Button>

      <ul className="mt-8 space-y-3">
        {capsules.map((c) => (
          <li key={c.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-card p-4">
            <div className="min-w-0"><p className="truncate font-bold text-primary">{c.title}</p><p className="text-xs text-muted-foreground">{c.category}</p></div>
            <div className="flex shrink-0 gap-2">
              <Button size="sm" variant="secondary" onClick={() => edit(c)}><Pencil className="size-4" /> Editar</Button>
              <Button size="sm" variant="destructive" onClick={() => confirm(`¿Eliminar "${c.title}"?`) && remove.mutate(c.id)}><Trash2 className="size-4" /> Eliminar</Button>
            </div>
          </li>
        ))}
      </ul>

      <TeamEditor />

      <Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display text-2xl text-primary">{draft?.id ? "Editar cápsula" : "Nueva cápsula"}</DialogTitle></DialogHeader>
          {draft && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); save.mutate(draft); }}>
              <div className="space-y-1.5"><Label>Título de la cápsula</Label><Input required value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Categoría</Label>
                <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5"><Label>Enlace del video (YouTube, Vimeo, TikTok)</Label><Input placeholder="https://www.youtube.com/watch?v=..." value={draft.video_url} onChange={(e) => setDraft({ ...draft, video_url: e.target.value })} /></div>
              {toEmbedUrl(draft.video_url) && <div className="aspect-video overflow-hidden rounded-lg"><iframe src={toEmbedUrl(draft.video_url)!} title="Vista previa" className="size-full" /></div>}
              <div className="space-y-1.5"><Label>Resumen breve (se ve en la tarjeta)</Label><Input value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Descripción / Consejos para la familia</Label><Textarea rows={8} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></div>
              {save.isError && <p className="text-sm text-destructive">No se pudo guardar. Intenta de nuevo.</p>}
              <Button type="submit" size="lg" disabled={save.isPending} className="w-full">{save.isPending ? "Guardando…" : "Publicar / Guardar"}</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TeamEditor() {
  const qc = useQueryClient();
  const { data } = useQuery(settingsQuery);
  const [value, setValue] = useState("");
  useEffect(() => { if (data !== undefined) setValue(data); }, [data]);
  const save = useMutation({
    mutationFn: async () => { const { error } = await supabase.from("site_settings").update({ team_names: value, updated_at: new Date().toISOString() }).eq("id", 1); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_settings"] }),
  });
  return (
    <section className="mt-12 rounded-2xl border border-border bg-secondary/40 p-6">
      <h2 className="font-display text-xl font-bold text-primary">Editar nombres del equipo de investigación</h2>
      <p className="text-sm text-muted-foreground">Se muestran en el pie de página. Sepáralos con comas.</p>
      <Textarea className="mt-3 bg-card" rows={2} value={value} onChange={(e) => setValue(e.target.value)} />
      <Button className="mt-3" onClick={() => save.mutate()} disabled={save.isPending}>{save.isSuccess ? "¡Guardado!" : "Guardar nombres"}</Button>
    </section>
  );
}
