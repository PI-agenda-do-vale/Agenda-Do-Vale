using static AgendaDoVale.Domain.Entidades.Enums.EventoEnums;

namespace AgendaDoVale.Aplication.Dtos_s.EventosDtos
{
    public class EventoResponseDto
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public CidadeEventos Cidade { get; set; }
        public string CidadeNome { get; set; } = string.Empty;
        public CategoriaEventos Categoria { get; set; }
        public string CategoriaNome { get; set; } = string.Empty;
        public string Local { get; set; } = string.Empty;
        public DateOnly Data { get; set; }
        public TimeOnly Horario { get; set; }
        public string UrlDaImagem { get; set; } = string.Empty;
    }
}
