using AgendaDoVale.Aplication.Dtos_s.EventosDtos;
using AgendaDoVale.Aplication.Dtos_s.PaginacaoDtos;

namespace AgendaDoVale.Aplication.AplicationInterfaces.Eventos
{
    public interface IEventosService
    {
        Task CriarEventoAsync(CadastroEventoDto cadastroEventoDto, int usuarioId);
        Task<PaginacaoDto<EventoResponseDto>> ListarEventosPaginadosAsync(int pagina, int tamanhoPagina);
        Task<PaginacaoDto<EventoResponseDto>> ListarEventosPaginadosComFiltrosAsync(int pagina, int tamanhoPagina, EventoFiltrosDto filtros);
        Task<EventoResponseDto?> ObterEventoPorIdAsync(int id);
        Task<bool> AtualizarEventoAsync(int id, int usuarioId, AtualizarEventoDto atualizarEventoDto);
        Task<bool> DeletarEventoAsync(int id, int usuarioId);
    }
}
