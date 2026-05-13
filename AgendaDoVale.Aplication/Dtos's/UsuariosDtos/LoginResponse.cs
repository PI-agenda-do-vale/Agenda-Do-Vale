namespace AgendaDoVale.Aplication.Dtos_s.UsuariosDtos
{
    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int UsuarioId { get; set; }
    }
}
