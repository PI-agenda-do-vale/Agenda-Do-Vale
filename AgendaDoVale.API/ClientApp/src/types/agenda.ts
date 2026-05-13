export enum CidadeEventos {
  SaoJoseDosCampos = 1,
  Taubate = 2,
  Jacarei = 3,
  Pindamonhangaba = 4,
  Guaratingueta = 5,
  Aparecida = 6,
  Lorena = 7,
  Cruzeiro = 8,
  CachoeiraPaulista = 9,
  Roseira = 10,
  CamposDoJordao = 11,
  Cacapava = 12,
}

export const CIDADE_OPTIONS: { value: CidadeEventos; label: string }[] = [
  { value: CidadeEventos.SaoJoseDosCampos, label: "São José dos Campos" },
  { value: CidadeEventos.Taubate, label: "Taubaté" },
  { value: CidadeEventos.Jacarei, label: "Jacareí" },
  { value: CidadeEventos.Pindamonhangaba, label: "Pindamonhangaba" },
  { value: CidadeEventos.Guaratingueta, label: "Guaratinguetá" },
  { value: CidadeEventos.Aparecida, label: "Aparecida" },
  { value: CidadeEventos.Lorena, label: "Lorena" },
  { value: CidadeEventos.Cruzeiro, label: "Cruzeiro" },
  { value: CidadeEventos.CachoeiraPaulista, label: "Cachoeira Paulista" },
  { value: CidadeEventos.Roseira, label: "Roseira" },
  { value: CidadeEventos.CamposDoJordao, label: "Campos do Jordão" },
  { value: CidadeEventos.Cacapava, label: "Caçapava" },
];

export enum CategoriaEventos {
  EventoSocial = 1,
  EventoCultural = 2,
  EventoEsportivo = 3,
  EventoTecnico = 4,
}

export const CATEGORIA_OPTIONS: { value: CategoriaEventos; label: string }[] = [
  { value: CategoriaEventos.EventoSocial, label: "Evento Social" },
  { value: CategoriaEventos.EventoCultural, label: "Evento Cultural" },
  { value: CategoriaEventos.EventoEsportivo, label: "Evento Esportivo" },
  { value: CategoriaEventos.EventoTecnico, label: "Evento Técnico" },
];

export interface EventoResponse {
  id: number;
  usuarioId: number;
  titulo: string;
  descricao: string;
  cidade: CidadeEventos;
  cidadeNome: string;
  categoria: CategoriaEventos;
  categoriaNome: string;
  local: string;
  data: string;
  horario: string;
  urlDaImagem: string;
}

export interface PaginacaoResponse<T> {
  dados: T[];
  total: number;
  pagina: number;
  tamanhoPagina: number;
  totalPaginas: number;
  temProxima: boolean;
  temAnterior: boolean;
}

export interface EventoFiltros {
  titulo?: string;
  descricao?: string;
  cidade?: CidadeEventos;
  categoria?: CategoriaEventos;
  local?: string;
  data?: string;
  horario?: string;
}

export interface CadastroEventoInput {
  titulo: string;
  descricao: string;
  cidade: CidadeEventos;
  categoria: CategoriaEventos;
  local: string;
  data: string;
  horario: string;
  urlDaImagem: string;
}

export type AtualizarEventoInput = CadastroEventoInput;
