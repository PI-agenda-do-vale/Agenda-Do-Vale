import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { deletarEvento, listEventos } from "@/services/agendaService";
import type { EventoResponse } from "@/types/agenda";
import { PostCard } from "@/components/agenda/PostCard";
import { CreatePostDialog } from "@/components/agenda/CreatePostDialog";
import { EventCarouselDialog } from "@/components/agenda/EventCarouselDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 50;

export default function MinhasPublicacoes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<EventoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<EventoResponse | null>(null);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselStart, setCarouselStart] = useState(0);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await listEventos({ pagina: 1, tamanhoPagina: PAGE_SIZE });
      setPosts(result.dados.filter((p) => p.usuarioId === user.usuarioId));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao carregar";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(post: EventoResponse) {
    if (!confirm(`Excluir "${post.titulo}"?`)) return;
    try {
      await deletarEvento(post.id);
      toast.success("Evento excluído");
      load();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao excluir";
      toast.error(message);
    }
  }

  if (!user) {
    return (
      <div className="container py-16">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <p>Você precisa estar logado para ver suas publicações.</p>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      <h1 className="text-2xl font-semibold mb-6">Minhas Publicações</h1>

      {loading ? (
        <Skeleton className="h-[300px]" />
      ) : posts.length === 0 ? (
        <p>Você ainda não publicou nada.</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={setEditingPost}
                onDelete={handleDelete}
                onView={() => {
                  setCarouselStart(index);
                  setCarouselOpen(true);
                }}
              />
            ))}
          </div>

          <EventCarouselDialog
            posts={posts}
            startIndex={carouselStart}
            open={carouselOpen}
            onOpenChange={setCarouselOpen}
          />

          <CreatePostDialog
            postToEdit={editingPost}
            open={!!editingPost}
            onOpenChange={(open) => {
              if (!open) setEditingPost(null);
            }}
            onCreated={() => {
              setEditingPost(null);
              load();
            }}
          />
        </>
      )}
    </div>
  );
}
