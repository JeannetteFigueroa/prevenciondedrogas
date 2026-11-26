import { supabase } from "@/integrations/supabase/client";

export const EDITOR_EMAIL = "alumnas.uah@educadoras.cl";
export const CATEGORIES = [
  "Prevención de Drogas",
  "Educación Emocional",
  "Espacios Seguros",
  "Redes de Apoyo",
] as const;

export type Capsule = {
  id: string;
  title: string;
  category: string;
  video_url: string | null;
  summary: string;
  description: string;
  created_at: string;
};

export const capsulesQuery = {
  queryKey: ["capsules"],
  queryFn: async (): Promise<Capsule[]> => {
    const { data, error } = await supabase
      .from("capsules")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
};

export const settingsQuery = {
  queryKey: ["site_settings"],
  queryFn: async () => {
    const { data } = await supabase.from("site_settings").select("team_names").eq("id", 1).maybeSingle();
    return data?.team_names ?? "";
  },
};

/** Converts a YouTube, Vimeo or TikTok link into an embeddable URL. */
export function toEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (host.endsWith("youtube.com")) {
      const id = u.searchParams.get("v") ?? u.pathname.match(/\/(shorts|embed)\/([^/]+)/)?.[2];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host.endsWith("vimeo.com")) {
      const id = u.pathname.match(/(\d+)/)?.[1];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    if (host.endsWith("tiktok.com")) {
      const id = u.pathname.match(/video\/(\d+)/)?.[1];
      return id ? `https://www.tiktok.com/embed/v2/${id}` : null;
    }
    if (host.endsWith("instagram.com")) {
      const m = u.pathname.match(/\/(reel|p)\/([^/]+)/);
      return m ? `https://www.instagram.com/${m[1]}/${m[2]}/embed` : null;
    }
    return null;
  } catch {
    return null;
  }
}
