using AgendaDoVale.Domain.Entidades.Usuarios;

namespace AgendaDoVale.Aplication.AplicationInterfaces.Autenticacao
{
    public interface ITokenService
    {
        string GerarToken(Usuario usuario);
    }
}
