import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  CATEGORIA_OPTIONS,
  CIDADE_OPTIONS,
  type CadastroEventoInput,
  CategoriaEventos,
  CidadeEventos,
  type EventoResponse,
} from "@/types/agenda";
import { atualizarEvento, criarEvento } from "@/services/agendaService";

interface CreatePostDialogProps {
  onCreated: () => void;
  postToEdit?: EventoResponse | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface FormState {
  titulo: string;
  descricao: string;
  cidade: string;
  categoria: string;
  local: string;
  data: string;
  horario: string;
  urlDaImagem: string;
}

const emptyForm: FormState = {
  titulo: "",
  descricao: "",
  cidade: "",
  categoria: "",
  local: "",
  data: "",
  horario: "",
  urlDaImagem: "",
};

export const CreatePostDialog = ({
  onCreated,
  postToEdit,
  open,
  onOpenChange,
}: CreatePostDialogProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (postToEdit) {
      setForm({
        titulo: postToEdit.titulo,
        descricao: postToEdit.descricao,
        cidade: String(postToEdit.cidade),
        categoria: String(postToEdit.categoria),
        local: postToEdit.local || "",
        data: postToEdit.data || "",
        horario: postToEdit.horario ? postToEdit.horario.slice(0, 5) : "",
        urlDaImagem: postToEdit.urlDaImagem || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [postToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cidade || !form.categoria || !form.titulo || !form.descricao || !form.data) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    setSubmitting(true);

    try {
      const payload: CadastroEventoInput = {
        titulo: form.titulo,
        descricao: form.descricao,
        cidade: Number(form.cidade) as CidadeEventos,
        categoria: Number(form.categoria) as CategoriaEventos,
        local: form.local,
        data: form.data,
        horario: form.horario ? `${form.horario}:00` : "00:00:00",
        urlDaImagem: form.urlDaImagem,
      };

      if (postToEdit) {
        await atualizarEvento(postToEdit.id, payload);
        toast.success("Evento atualizado!");
      } else {
        await criarEvento(payload);
        toast.success("Evento publicado!");
      }

      onOpenChange?.(false);
      onCreated();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao salvar";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const update =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!postToEdit && open === undefined && (
        <DialogTrigger asChild>
          <Button size="lg" variant="hero" className="gap-2">
            <Plus className="h-4 w-4" />
            Publicar
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>
            {postToEdit ? "Editar evento" : "Publicar evento"}
          </DialogTitle>
          <DialogDescription>
            {postToEdit
              ? "Altere as informações do evento."
              : "Divulgue um evento para a comunidade do Vale."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Título *</Label>
            <Input
              placeholder="Ex: Festival de Inverno"
              value={form.titulo}
              onChange={update("titulo")}
            />
          </div>

          <div className="space-y-2">
            <Label>Descrição *</Label>
            <Textarea
              placeholder="Conte os detalhes para a comunidade..."
              value={form.descricao}
              onChange={update("descricao")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cidade *</Label>
              <Select
                value={form.cidade}
                onValueChange={(v) => setForm((f) => ({ ...f, cidade: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {CIDADE_OPTIONS.map((c) => (
                    <SelectItem key={c.value} value={String(c.value)}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Local</Label>
              <Input
                placeholder="Ex: Praça central"
                value={form.local}
                onChange={update("local")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Select
                value={form.categoria}
                onValueChange={(v) => setForm((f) => ({ ...f, categoria: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIA_OPTIONS.map((c) => (
                    <SelectItem key={c.value} value={String(c.value)}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>URL da imagem</Label>
              <Input
                placeholder="https://..."
                value={form.urlDaImagem}
                onChange={update("urlDaImagem")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data *</Label>
              <Input
                type="date"
                value={form.data}
                onChange={update("data")}
              />
            </div>
            <div className="space-y-2">
              <Label>Horário</Label>
              <Input
                type="time"
                value={form.horario}
                onChange={update("horario")}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange?.(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>

            <Button type="submit" variant="default" disabled={submitting}>
              {submitting ? "Salvando..." : postToEdit ? "Salvar" : "Publicar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
