import { useCallback, useEffect, useState } from "react";
import { CalendarDays, Mountain } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

import heroImage from "@/assets/vale-hero.jpg";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Skeleton } from "@/components/ui/skeleton";

import { PostCard } from "@/components/agenda/PostCard";
import { CreatePostDialog } from "@/components/agenda/CreatePostDialog";

import { deletarEvento, listEventos } from "@/services/agendaService";
import {
  CATEGORIA_OPTIONS,
  CIDADE_OPTIONS,
  type CategoriaEventos,
  type CidadeEventos,
  type EventoResponse,
  type PaginacaoResponse,
} from "@/types/agenda";

const PAGE_SIZE = 9;
const ALL = "todas";

function buildPageList(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "ellipsis")[] = [1];
  if (current > 3) pages.push("ellipsis");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let p = start; p <= end; p++) pages.push(p);
  if (current < total - 2) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

const Index = () => {
  const { user, login, cadastro, logout } = useAuth();

  const [authMode, setAuthMode] = useState<"login" | "cadastro">("login");
  const [loginNome, setLoginNome] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState<EventoResponse | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const [paginacao, setPaginacao] = useState<PaginacaoResponse<EventoResponse>>({
    dados: [],
    total: 0,
    pagina: 1,
    tamanhoPagina: PAGE_SIZE,
    totalPaginas: 0,
    temProxima: false,
    temAnterior: false,
  });
  const [loading, setLoading] = useState(true);

  const [pagina, setPagina] = useState(1);
  const [filterCity, setFilterCity] = useState<string>(ALL);
  const [filterCategory, setFilterCategory] = useState<string>(ALL);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listEventos({
        pagina,
        tamanhoPagina: PAGE_SIZE,
        titulo: search || undefined,
        cidade:
          filterCity !== ALL ? (Number(filterCity) as CidadeEventos) : undefined,
        categoria:
          filterCategory !== ALL
            ? (Number(filterCategory) as CategoriaEventos)
            : undefined,
      });
      setPaginacao(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao carregar";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [pagina, search, filterCity, filterCategory]);

  useEffect(() => {
    load();
  }, [load]);

  // Reset para página 1 quando filtros mudarem
  useEffect(() => {
    setPagina(1);
  }, [search, filterCity, filterCategory]);

  const handleAuth = async () => {
    if (!loginEmail || !loginPassword || (authMode === "cadastro" && !loginNome)) {
      toast.error("Preencha todos os campos");
      return;
    }
    setLoginSubmitting(true);
    try {
      const result =
        authMode === "login"
          ? await login(loginEmail, loginPassword)
          : await cadastro({
              nome: loginNome,
              email: loginEmail,
              senha: loginPassword,
            });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      setLoginNome("");
      setLoginEmail("");
      setLoginPassword("");
      setLoginOpen(false);
      toast.success(
        authMode === "login" ? "Bem-vindo!" : "Conta criada com sucesso!",
      );
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleDelete = async (post: EventoResponse) => {
    if (!confirm(`Excluir "${post.titulo}"?`)) return;
    try {
      await deletarEvento(post.id);
      toast.success("Evento excluído");
      load();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao excluir";
      toast.error(message);
    }
  };

  const pages = buildPageList(paginacao.pagina, paginacao.totalPaginas);

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <header className="relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="Vale do Paraíba"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />

        <div className="container flex min-h-[78vh] flex-col justify-end pb-16 pt-24 text-white">
          <div className="absolute top-6 right-6 flex gap-3">
            {user ? (
              <>
                <Link
                  to="/minhas"
                  className="text-white border border-white/40 px-4 py-2 rounded-md backdrop-blur-sm bg-white/10 hover:bg-white/20 transition"
                >
                  Minhas publicações
                </Link>
                <button
                  onClick={logout}
                  className="text-white border border-white/40 px-4 py-2 rounded-md backdrop-blur-sm bg-white/10 hover:bg-white/20 transition"
                >
                  Sair ({user.nome})
                </button>
              </>
            ) : (
              <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setLoginOpen(true);
                  }}
                  className="text-white border border-white/40 px-4 py-2 rounded-md backdrop-blur-sm bg-white/10 hover:bg-white/20 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setAuthMode("cadastro");
                    setLoginOpen(true);
                  }}
                  className="text-white border border-yellow-300 bg-yellow-300/20 px-4 py-2 rounded-md backdrop-blur-sm hover:bg-yellow-300/30 transition font-medium"
                >
                  Cadastrar
                </button>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {authMode === "login" ? "Login" : "Criar conta"}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="flex flex-col gap-3">
                    {authMode === "cadastro" && (
                      <Input
                        placeholder="Nome"
                        value={loginNome}
                        onChange={(e) => setLoginNome(e.target.value)}
                      />
                    )}

                    <Input
                      type="email"
                      placeholder="Email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />

                    <Input
                      type="password"
                      placeholder="Senha"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAuth();
                      }}
                    />

                    {authMode === "cadastro" && (
                      <p className="text-xs text-muted-foreground -mt-1">
                        Mínimo 8 caracteres, com maiúscula, minúscula, número e
                        caractere especial (!@#$%^&*).
                      </p>
                    )}

                    <Button onClick={handleAuth} disabled={loginSubmitting}>
                      {loginSubmitting
                        ? "Aguarde..."
                        : authMode === "login"
                          ? "Entrar"
                          : "Cadastrar"}
                    </Button>

                    <button
                      type="button"
                      className="text-sm text-muted-foreground underline self-center"
                      onClick={() =>
                        setAuthMode(authMode === "login" ? "cadastro" : "login")
                      }
                    >
                      {authMode === "login"
                        ? "Não tem conta? Cadastre-se"
                        : "Já tem conta? Entrar"}
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs uppercase">
              <Mountain className="h-4 w-4" />
              Vale do Paraíba
            </div>

            <h1 className="text-5xl font-bold">
              Agenda do <span className="italic text-yellow-300">Vale</span>
            </h1>

            <p className="mt-4 text-white/80">
              Eventos e lugares incríveis da região.
            </p>

            <div className="mt-6 flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CalendarDays />
                {paginacao.total} eventos cadastrados
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-16">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">A vida acontecendo no Vale</h2>

          {user && (
            <>
              <Button size="lg" variant="default" onClick={() => setCreateOpen(true)}>
                Publicar
              </Button>
              <CreatePostDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onCreated={load}
              />
            </>
          )}
        </div>

        {/* FILTROS */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            placeholder="Buscar por título..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setSearch(searchInput);
            }}
          />

          <Select value={filterCity} onValueChange={setFilterCity}>
            <SelectTrigger>
              <SelectValue placeholder="Cidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todas as cidades</SelectItem>
              {CIDADE_OPTIONS.map((c) => (
                <SelectItem key={c.value} value={String(c.value)}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todas as categorias</SelectItem>
              {CATEGORIA_OPTIONS.map((c) => (
                <SelectItem key={c.value} value={String(c.value)}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSearch(searchInput)}
              className="flex-1"
            >
              Buscar
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setSearchInput("");
                setSearch("");
                setFilterCity(ALL);
                setFilterCategory(ALL);
              }}
            >
              Limpar
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[300px]" />
            ))}
          </div>
        ) : paginacao.dados.length === 0 ? (
          <p>Nenhum evento encontrado.</p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginacao.dados.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={setEditingPost}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* PAGINAÇÃO */}
            {paginacao.totalPaginas > 1 && (
              <div className="mt-10">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (paginacao.temAnterior) setPagina(pagina - 1);
                        }}
                        aria-disabled={!paginacao.temAnterior}
                        className={
                          !paginacao.temAnterior
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {pages.map((p, idx) =>
                      p === "ellipsis" ? (
                        <PaginationItem key={`e-${idx}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={p}>
                          <PaginationLink
                            href="#"
                            isActive={p === paginacao.pagina}
                            onClick={(e) => {
                              e.preventDefault();
                              setPagina(p);
                            }}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (paginacao.temProxima) setPagina(pagina + 1);
                        }}
                        aria-disabled={!paginacao.temProxima}
                        className={
                          !paginacao.temProxima
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <p className="mt-3 text-center text-sm text-muted-foreground">
                  Página {paginacao.pagina} de {paginacao.totalPaginas} ·{" "}
                  {paginacao.total} eventos
                </p>
              </div>
            )}

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
      </main>
    </div>
  );
};

export default Index;
