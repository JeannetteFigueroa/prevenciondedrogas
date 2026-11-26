import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toEmbedUrl, type Capsule } from "@/lib/capsules";

export function CapsuleDialog({ capsule, onClose }: { capsule: Capsule | null; onClose: () => void }) {
  const embed = toEmbedUrl(capsule?.video_url);
  return (
    <Dialog open={!!capsule} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        {capsule && (
          <>
            <DialogHeader>
              <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">{capsule.category}</span>
              <DialogTitle className="font-display text-2xl text-primary">{capsule.title}</DialogTitle>
            </DialogHeader>
            {embed ? (
              <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                <iframe src={embed} title={capsule.title} className="size-full" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
            ) : capsule.video_url ? (
              <a href={capsule.video_url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary underline">Abrir video</a>
            ) : null}
            <p className="whitespace-pre-line leading-relaxed text-foreground/90">{capsule.description}</p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
