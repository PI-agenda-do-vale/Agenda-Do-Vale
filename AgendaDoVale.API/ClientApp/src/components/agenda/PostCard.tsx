import { CalendarDays, MapPin, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { EventoResponse } from "@/types/agenda";
import { useAuth } from "@/context/AuthContext";

interface PostCardProps {
  post: EventoResponse;
  onEdit?: (post: EventoResponse) => void;
  onDelete?: (post: EventoResponse) => void;
}

function formatDate(iso: string) {
  if (!iso) return "";
  // Backend envia DateOnly como "yyyy-MM-dd"
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
  // Backend envia TimeOnly como "HH:mm:ss"
  return iso.slice(0, 5);
}

export const PostCard = ({ post, onEdit, onDelete }: PostCardProps) => {
  const { user } = useAuth();
  const isOwner = user?.usuarioId === post.usuarioId;

  return (
    <Card className="group overflow-hidden border-border/60 bg-card transition-smooth hover:-translate-y-1 hover:shadow-elegant animate-fade-up">
      {post.urlDaImagem && (
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          {isOwner && (
            <div className="absolute top-2 right-2 z-10 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(post);
                }}
                className="text-xs bg-black/50 text-white px-2 py-1 rounded hover:bg-black/70"
              >
                Editar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(post);
                }}
                className="text-xs bg-red-600/80 text-white px-2 py-1 rounded hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          )}

          <img
            src={post.urlDaImagem}
            alt={post.titulo}
            loading="lazy"
            className="h-full w-full object-cover transition-smooth group-hover:scale-105"
          />

          <div className="absolute left-3 top-3">
            <Badge
              variant="secondary"
              className="bg-accent text-accent-foreground shadow-soft"
            >
              <CalendarDays className="mr-1 h-3 w-3" /> {post.categoriaNome}
            </Badge>
          </div>
        </div>
      )}

      <div className="space-y-3 p-5">
        <div>
          <h3 className="font-display text-xl font-semibold leading-tight text-foreground">
            {post.titulo}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
            {post.descricao}
          </p>
        </div>

        <div className="space-y-1.5 border-t border-border/60 pt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">
              <span className="font-medium text-foreground">{post.cidadeNome}</span>
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
            <span className="truncate">{post.categoriaNome}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
