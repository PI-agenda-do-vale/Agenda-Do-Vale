using AgendaDoVale.Domain.Entidades.Eventos;
using AgendaDoVale.Domain.Entidades.Usuarios;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AgendaDoVale.Infraestructure.Data.Configurations
{
    internal class EventoConfiguration : IEntityTypeConfiguration<Evento>
    {
        public void Configure(EntityTypeBuilder<Evento> builder)
        {
            
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Titulo)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(x => x.Descricao)
                .IsRequired()
                .HasMaxLength (1000);

            builder.Property(x => x.UsuarioId)
                .IsRequired();
                
            builder.HasOne<Usuario>()
                .WithMany()
                .HasForeignKey(x => x.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.Cidade)
                .IsRequired()
                .HasConversion<int>();

            builder.Property(x => x.Categoria)
                .IsRequired()
                .HasConversion<int>();

            builder.Property(x => x.Local)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(x => x.Data)
                .IsRequired();

            builder.Property(x => x.Horario)
                .IsRequired();

            builder.Property(x => x.UrlDaImagem)
                .IsRequired()
                .HasMaxLength(1000);
        }
    }
}
