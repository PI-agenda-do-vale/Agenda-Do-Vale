namespace AgendaDoVale.Aplication.Dtos_s.PaginacaoDtos
{
    public class PaginacaoDto<T>
    {
        public List<T> Dados { get; set; } = new();
        public int Total { get; set; }
        public int Pagina { get; set; }
        public int TamanhoPagina { get; set; }
        public int TotalPaginas { get; set; }
        public bool TemProxima { get; set; }
        public bool TemAnterior { get; set; }
    }
}
