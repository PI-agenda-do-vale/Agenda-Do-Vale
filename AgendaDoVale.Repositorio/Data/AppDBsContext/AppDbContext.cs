using AgendaDoVale.Domain.Entidades.Eventos;
using AgendaDoVale.Domain.Entidades.Usuarios;
using Microsoft.EntityFrameworkCore;

namespace AgendaDoVale.Infraestructure.Data.AppDBsContext
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }

        public DbSet<Evento> Eventos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }
    }
}
