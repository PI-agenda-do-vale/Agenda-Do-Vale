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
using Microsoft.Extensions.Hosting;
using Npgsql;

namespace AgendaDoVale.Infraestructure.Data.DependencyInjections
{
    public static class InfrastructureExtension
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration,
            IHostEnvironment environment)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection") ?? string.Empty;
            var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

            if (!string.IsNullOrWhiteSpace(databaseUrl))
            {
                connectionString = ConvertDatabaseUrl(databaseUrl);
            }
            else
            {
                var pgHost = Environment.GetEnvironmentVariable("PGHOST");
                if (!string.IsNullOrWhiteSpace(pgHost))
                {
                    connectionString = BuildPostgresConnectionFromEnv();
                }
            }

            if (!environment.IsDevelopment() && IsLocalHostConnection(connectionString))
            {
                throw new InvalidOperationException(
                    "Database connection is configured to localhost in a non-development environment. " +
                    "Set DATABASE_URL or a remote PostgreSQL connection string in Railway.");
            }

            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(connectionString));

            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IAuthService, UsuarioAuthService>();
            services.AddScoped<IEventosService, EventoServico>();

            services.AddScoped<IUsuarioRepository, UsuarioRepository>();
            services.AddScoped<IEventoRepositorio, EventoRepositorio>();

            return services;
        }

        private static string ConvertDatabaseUrl(string databaseUrl)
        {
            var uri = new Uri(databaseUrl);
            var userInfo = uri.UserInfo.Split(':');
            var builder = new NpgsqlConnectionStringBuilder
            {
                Host = uri.Host,
                Port = uri.Port,
                Username = userInfo.Length > 0 ? userInfo[0] : string.Empty,
                Password = userInfo.Length > 1 ? userInfo[1] : string.Empty,
                Database = uri.AbsolutePath.TrimStart('/'),
                SslMode = SslMode.Prefer
            };

            if (!string.IsNullOrWhiteSpace(uri.Query))
            {
                var queryString = uri.Query.TrimStart('?');
                var parameters = queryString.Split('&', StringSplitOptions.RemoveEmptyEntries);
                foreach (var parameter in parameters)
                {
                    var parts = parameter.Split('=', 2);
                    if (parts.Length != 2)
                        continue;

                    var key = Uri.UnescapeDataString(parts[0]);
                    var value = Uri.UnescapeDataString(parts[1]);
                    builder[key] = value;
                }
            }

            return builder.ToString();
        }

        private static string BuildPostgresConnectionFromEnv()
        {
            var host = Environment.GetEnvironmentVariable("PGHOST") ?? Environment.GetEnvironmentVariable("POSTGRES_HOST");
            var port = Environment.GetEnvironmentVariable("PGPORT") ?? "5432";
            var database = Environment.GetEnvironmentVariable("PGDATABASE") ?? Environment.GetEnvironmentVariable("POSTGRES_DB");
            var username = Environment.GetEnvironmentVariable("PGUSER") ?? Environment.GetEnvironmentVariable("POSTGRES_USER");
            var password = Environment.GetEnvironmentVariable("PGPASSWORD") ?? Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");

            var builder = new NpgsqlConnectionStringBuilder
            {
                Host = host,
                Port = int.TryParse(port, out var parsedPort) ? parsedPort : 5432,
                Database = database,
                Username = username,
                Password = password,
                SslMode = SslMode.Prefer
            };

            return builder.ToString();
        }

        private static bool IsLocalHostConnection(string connectionString)
        {
            if (string.IsNullOrWhiteSpace(connectionString))
                return false;

            var builder = new NpgsqlConnectionStringBuilder(connectionString);
            var host = builder.Host?.ToLowerInvariant();
            return host == "localhost" || host == "127.0.0.1" || host == "tcp://localhost";
        }
    }
}


