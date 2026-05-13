using AgendaDoVale.Aplication.Dtos_s.UsuariosDtos;

namespace AgendaDoVale.Aplication.AplicationInterfaces.Autenticacao
{
    public interface IAuthService
    {
        Task<LoginResponse?> LoginAsync(LoginRequest request);
        Task<LoginResponse?> CadastroAsync(CadastroUsuario request);
    }
}
