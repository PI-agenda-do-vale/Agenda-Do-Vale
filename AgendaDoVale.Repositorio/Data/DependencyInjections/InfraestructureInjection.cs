using AgendaDoVale.Aplication.AplicationInterfaces.Autenticacao;
using AgendaDoVale.Aplication.AplicationInterfaces.Eventos;
using AgendaDoVale.Aplication.AplicationInterfaces.Repositorios.EventoRepositorios;
using AgendaDoVale.Aplication.AplicationInterfaces.Repositorios.UsuarioRepositorios;
using AgendaDoVale.Aplication.Servicos.AutenticacaoServico;
using AgendaDoVale.Aplication.Servicos.EventosService;
using AgendaDoVale.Infraestructure.AuthService;
using AgendaDoVale.Infraestructure.Data.AppDBsContext;
using AgendaDoVale.Infraestructure.Repositorios.EventoRepositorios;
using AgendaDoVale.Infraestructure.Repositorios.UsuarioRepositorio;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AgendaDoVale.Infraestructure.Data.DependencyInjections
{
    public static class InfrastructureExtension
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            // DbContext
            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            // Services
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IAuthService, UsuarioAuthService>();
            services.AddScoped<IEventosService, EventoServico>();

            // Repositories
            services.AddScoped<IUsuarioRepository, UsuarioRepository>();
            services.AddScoped<IEventoRepositorio, EventoRepositorio>();

            return services;
        }
    }
}


