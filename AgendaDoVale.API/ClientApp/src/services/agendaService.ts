import { apiRequest } from "@/lib/api";
import type {
  AtualizarEventoInput,
  CadastroEventoInput,
  EventoFiltros,
  EventoResponse,
  PaginacaoResponse,
} from "@/types/agenda";

interface ListParams extends EventoFiltros {
  pagina: number;
  tamanhoPagina: number;
}

export function listEventos(params: ListParams) {
  return apiRequest<PaginacaoResponse<EventoResponse>>("/eventos/paginados", {
    query: {
      pagina: params.pagina,
      tamanhoPagina: params.tamanhoPagina,
      titulo: params.titulo,
      descricao: params.descricao,
      cidade: params.cidade,
      categoria: params.categoria,
      local: params.local,
      data: params.data,
      horario: params.horario,
    },
  });
}

export function getEvento(id: number) {
  return apiRequest<EventoResponse>(`/eventos/${id}`);
}

export function criarEvento(input: CadastroEventoInput) {
  return apiRequest<{ message: string }>("/eventos/registrar", {
    method: "POST",
    body: input,
  });
}

export function atualizarEvento(id: number, input: AtualizarEventoInput) {
  return apiRequest<{ message: string }>(`/eventos/${id}`, {
    method: "PUT",
    body: input,
  });
}

export function deletarEvento(id: number) {
  return apiRequest<{ message: string }>(`/eventos/${id}`, {
    method: "DELETE",
  });
}
