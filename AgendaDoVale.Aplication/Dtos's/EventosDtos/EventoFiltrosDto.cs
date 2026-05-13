using static AgendaDoVale.Domain.Entidades.Enums.EventoEnums;

namespace AgendaDoVale.Aplication.Dtos_s.EventosDtos
{
    public class EventoFiltrosDto
    {
        public string? Titulo { get; set; }
        public string? Descricao { get; set; }
        public CidadeEventos? Cidade { get; set; }
        public CategoriaEventos? Categoria { get; set; }
        public string? Local { get; set; }
        public DateOnly? Data { get; set; }
        public TimeOnly? Horario { get; set; }
    }
}
