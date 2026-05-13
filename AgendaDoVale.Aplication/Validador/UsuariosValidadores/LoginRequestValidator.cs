using AgendaDoVale.Aplication.Dtos_s.UsuariosDtos;
using FluentValidation;

namespace AgendaDoVale.Aplication.Validador.UsuariosValidadores
{
    public class LoginRequestValidator : AbstractValidator<LoginRequest>
    {
        public LoginRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email é obrigatório")
                .EmailAddress().WithMessage("Email inválido");

            RuleFor(x => x.Senha)
                .NotEmpty().WithMessage("Senha é obrigatória")
                .MinimumLength(8).WithMessage("Senha deve ter no mínimo 8 caracteres");
        }
    }
}
