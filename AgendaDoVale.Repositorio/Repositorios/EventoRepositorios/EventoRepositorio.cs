using AgendaDoVale.Aplication.AplicationInterfaces.Repositorios.EventoRepositorios;
using AgendaDoVale.Aplication.Dtos_s.EventosDtos;
using AgendaDoVale.Domain.Entidades.Eventos;
using AgendaDoVale.Infraestructure.Data.AppDBsContext;
using Microsoft.EntityFrameworkCore;

namespace AgendaDoVale.Infraestructure.Repositorios.EventoRepositorios
{
    public class EventoRepositorio : IEventoRepositorio
    {
        private readonly AppDbContext _context;

        public EventoRepositorio(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Evento> CriarEventoAsync (Evento evento)
        {
            _context.Eventos.Add(evento);
            await _context.SaveChangesAsync();
            return evento;
        }

        public async Task<(List<Evento> eventos, int total)> ListarEventosPaginadosAsync(int pagina, int tamanhoPagina)
        {
            var total = await _context.Eventos.CountAsync();

            var eventos = await _context.Eventos
                .OrderByDescending(x => x.Id)
                .Skip((pagina - 1) * tamanhoPagina)
                .Take(tamanhoPagina)
                .ToListAsync();

            return (eventos, total);
        }

        public async Task<(List<Evento> eventos, int total)> ListarEventosPaginadosComFiltrosAsync(int pagina, int tamanhoPagina, EventoFiltrosDto filtros)
        {
            var query = _context.Eventos.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filtros.Titulo))
            {
                query = query.Where(x => x.Titulo.Contains(filtros.Titulo));
            }

            if (!string.IsNullOrWhiteSpace(filtros.Descricao))
            {
                query = query.Where(x => x.Descricao.Contains(filtros.Descricao));
            }

            if (filtros.Cidade.HasValue)
            {
                query = query.Where(x => x.Cidade == filtros.Cidade.Value);
            }

            if (filtros.Categoria.HasValue)
            {
                query = query.Where(x => x.Categoria == filtros.Categoria.Value);
            }

            if (!string.IsNullOrWhiteSpace(filtros.Local))
            {
                query = query.Where(x => x.Local.Contains(filtros.Local));
            }

            if (filtros.Data.HasValue)
            {
                query = query.Where(x => x.Data == filtros.Data.Value);
            }

            if (filtros.Horario.HasValue)
            {
                query = query.Where(x => x.Horario == filtros.Horario.Value);
            }

            var total = await query.CountAsync();

            var eventos = await query
                .OrderByDescending(x => x.Id)
                .Skip((pagina - 1) * tamanhoPagina)
                .Take(tamanhoPagina)
                .ToListAsync();

            return (eventos, total);
        }

        public async Task<Evento?> ObterEventoPorIdAsync(int id)
        {
            return await _context.Eventos.FindAsync(id);
        }

        public async Task<bool> AtualizarEventoAsync(Evento evento)
        {
            _context.Eventos.Update(evento);
            var resultado = await _context.SaveChangesAsync();
            return resultado > 0;
        }

        public async Task<bool> DeletarEventoAsync(int id)
        {
            var evento = await _context.Eventos.FindAsync(id);
            if (evento == null)
                return false;

            _context.Eventos.Remove(evento);
            var resultado = await _context.SaveChangesAsync();
            return resultado > 0;
        }
    }
}
