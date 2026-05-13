using AgendaDoVale.Aplication.AplicationInterfaces.Eventos;
using AgendaDoVale.Aplication.AplicationInterfaces.Repositorios.EventoRepositorios;
using AgendaDoVale.Aplication.Dtos_s.EventosDtos;
using AgendaDoVale.Aplication.Dtos_s.PaginacaoDtos;
using AgendaDoVale.Domain.Entidades.Eventos;
using AgendaDoVale.Domain.Utilidades;

namespace AgendaDoVale.Aplication.Servicos.EventosService
{
    public class EventoServico : IEventosService
    {
        private readonly IEventoRepositorio _eventosRepositorio;

        public EventoServico(IEventoRepositorio eventosRepositorio)
        {
            _eventosRepositorio = eventosRepositorio;
        }

        public async Task CriarEventoAsync(CadastroEventoDto cadastroEventoDto, int usuarioId)
        {
            var eventos = new Evento()
            {
                UsuarioId = usuarioId,
                Titulo = cadastroEventoDto.Titulo,
                Descricao = cadastroEventoDto.Descricao,
                Cidade = cadastroEventoDto.Cidade,
                Categoria = cadastroEventoDto.Categoria,
                Local = cadastroEventoDto.Local,
                Data = cadastroEventoDto.Data,
                Horario = cadastroEventoDto.Horario,
                UrlDaImagem = cadastroEventoDto.UrlDaImagem
            };

            await _eventosRepositorio.CriarEventoAsync(eventos);
        }

        public async Task<PaginacaoDto<EventoResponseDto>> ListarEventosPaginadosAsync(int pagina, int tamanhoPagina)
        {
            var (eventos, total) = await _eventosRepositorio.ListarEventosPaginadosAsync(pagina, tamanhoPagina);
            return MapearEventosParaDto(eventos, total, pagina, tamanhoPagina);
        }

        public async Task<PaginacaoDto<EventoResponseDto>> ListarEventosPaginadosComFiltrosAsync(int pagina, int tamanhoPagina, EventoFiltrosDto filtros)
        {
            var (eventos, total) = await _eventosRepositorio.ListarEventosPaginadosComFiltrosAsync(pagina, tamanhoPagina, filtros);
            return MapearEventosParaDto(eventos, total, pagina, tamanhoPagina);
        }

        public async Task<EventoResponseDto?> ObterEventoPorIdAsync(int id)
        {
            var evento = await _eventosRepositorio.ObterEventoPorIdAsync(id);
            if (evento == null)
                return null;

            return MapearEventoParaDto(evento);
        }

        public async Task<bool> AtualizarEventoAsync(int id, int usuarioId, AtualizarEventoDto atualizarEventoDto)
        {
            var evento = await _eventosRepositorio.ObterEventoPorIdAsync(id);

            if (evento == null)
                return false;

            if (evento.UsuarioId != usuarioId)
                throw new UnauthorizedAccessException("Você não tem permissão para atualizar este evento");

            evento.Titulo = atualizarEventoDto.Titulo;
            evento.Descricao = atualizarEventoDto.Descricao;
            evento.Cidade = atualizarEventoDto.Cidade;
            evento.Categoria = atualizarEventoDto.Categoria;
            evento.Local = atualizarEventoDto.Local;
            evento.Data = atualizarEventoDto.Data;
            evento.Horario = atualizarEventoDto.Horario;
            evento.UrlDaImagem = atualizarEventoDto.UrlDaImagem;

            return await _eventosRepositorio.AtualizarEventoAsync(evento);
        }

        public async Task<bool> DeletarEventoAsync(int id, int usuarioId)
        {
            var evento = await _eventosRepositorio.ObterEventoPorIdAsync(id);

            if (evento == null)
                return false;

            if (evento.UsuarioId != usuarioId)
                throw new UnauthorizedAccessException("Você não tem permissão para deletar este evento");

            return await _eventosRepositorio.DeletarEventoAsync(id);
        }

        private static PaginacaoDto<EventoResponseDto> MapearEventosParaDto(List<Evento> eventos, int total, int pagina, int tamanhoPagina)
        {
            var eventosDto = eventos.Select(e => MapearEventoParaDto(e)).ToList();

            var totalPaginas = (int)Math.Ceiling(total / (double)tamanhoPagina);

            return new PaginacaoDto<EventoResponseDto>
            {
                Dados = eventosDto,
                Total = total,
                Pagina = pagina,
                TamanhoPagina = tamanhoPagina,
                TotalPaginas = totalPaginas,
                TemProxima = pagina < totalPaginas,
                TemAnterior = pagina > 1
            };
        }

        private static EventoResponseDto MapearEventoParaDto(Evento evento)
        {
            return new EventoResponseDto
            {
                Id = evento.Id,
                UsuarioId = evento.UsuarioId,
                Titulo = evento.Titulo,
                Descricao = evento.Descricao,
                Cidade = evento.Cidade,
                CidadeNome = EnumHelper.GetDisplayName(evento.Cidade),
                Categoria = evento.Categoria,
                CategoriaNome = EnumHelper.GetDisplayName(evento.Categoria),
                Local = evento.Local,
                Data = evento.Data,
                Horario = evento.Horario,
                UrlDaImagem = evento.UrlDaImagem
            };
        }
    }
}



