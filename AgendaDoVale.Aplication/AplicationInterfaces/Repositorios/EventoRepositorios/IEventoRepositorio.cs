using AgendaDoVale.Aplication.Dtos_s.EventosDtos;
using AgendaDoVale.Domain.Entidades.Eventos;

namespace AgendaDoVale.Aplication.AplicationInterfaces.Repositorios.EventoRepositorios
{
    public interface IEventoRepositorio
    {
        Task<Evento> CriarEventoAsync(Evento evento);
        Task<(List<Evento> eventos, int total)> ListarEventosPaginadosAsync(int pagina, int tamanhoPagina);
        Task<(List<Evento> eventos, int total)> ListarEventosPaginadosComFiltrosAsync(int pagina, int tamanhoPagina, EventoFiltrosDto filtros);
        Task<Evento?> ObterEventoPorIdAsync(int id);
        Task<bool> AtualizarEventoAsync(Evento evento);
        Task<bool> DeletarEventoAsync(int id);
    }
}
