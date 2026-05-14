import { CalendarDays, MapPin, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { EventoResponse } from "@/types/agenda";

interface EventCarouselDialogProps {
  posts: EventoResponse[];
  startIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDate(iso: string) {
  if (!iso) return "";
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  if (!iso) return "";
  return iso.slice(0, 5);
}

export function EventCarouselDialog({
  posts,
  startIndex,
  open,
  onOpenChange,
}: EventCarouselDialogProps) {
  if (!posts.length) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        <DialogTitle className="sr-only">Detalhes do evento</DialogTitle>
        <Carousel
          opts={{ startIndex, loop: posts.length > 1 }}
          className="w-full"
        >
          <CarouselContent>
            {posts.map((post) => (
              <CarouselItem key={post.id}>
                <div className="flex flex-col">
                  {post.urlDaImagem && (
                    <div className="h-64 w-full overflow-hidden bg-muted">
                      <img
                        src={post.urlDaImagem}
                        alt={post.titulo}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-3 p-6">
                    <h2 className="font-display text-2xl font-semibold leading-tight">
                      {post.titulo}
                    </h2>

                    <p className="whitespace-pre-line text-sm text-muted-foreground">
                      {post.descricao}
                    </p>

                    <div className="space-y-2 border-t border-border/60 pt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0 text-primary" />
                        <span>
                          <span className="font-medium text-foreground">
                            {post.cidadeNome}
                          </span>
                          {post.local ? ` · ${post.local}` : null}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
                        <span>{formatDate(post.data)}</span>
                        {post.horario && (
                          <>
                            <Clock className="ml-2 h-4 w-4 shrink-0 text-primary" />
                            <span>{formatTime(post.horario)}</span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                        <Badge variant="secondary">{post.categoriaNome}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {posts.length > 1 && (
            <>
              <CarouselPrevious className="left-3" />
              <CarouselNext className="right-3" />
            </>
          )}
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
