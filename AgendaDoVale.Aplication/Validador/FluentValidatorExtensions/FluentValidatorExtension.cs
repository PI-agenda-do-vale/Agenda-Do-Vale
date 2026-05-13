using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.Extensions.DependencyInjection;
using AgendaDoVale.Aplication.Validador.UsuariosValidadores;

namespace AgendaDoVale.Aplication.Validador.FluentValidatorExtensions
{
    public static class FluentValidatorExtension
    {
        public static IServiceCollection AddFluentValidationConfig(this IServiceCollection services)
        {
            // Registrar validadores automaticamente do assembly
            services.AddValidatorsFromAssemblyContaining<LoginRequestValidator>();

            // Adicionar validação automática do FluentValidation para ApiController
            services.AddFluentValidationAutoValidation();
            services.AddFluentValidationClientsideAdapters();

            return services;
        }
    }
}


