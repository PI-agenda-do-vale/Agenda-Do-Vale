using AgendaDoVale.Aplication.Dtos_s.EventosDtos;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgendaDoVale.Aplication.Validador.EventosValidadores
{
    public class EventoCadastroValidador : AbstractValidator<CadastroEventoDto>
    {
        public EventoCadastroValidador()
        {
            RuleFor(x => x.Titulo)
                .NotEmpty().WithMessage("Título é obrigatório")
                .MinimumLength(3).WithMessage("Título deve ter no mínimo 3 caracteres");

            RuleFor(x => x.Descricao)
                .NotEmpty().WithMessage("Descrição é obrigatória")
                .MinimumLength(5).WithMessage("Descrição deve ter no mínimo 5 caracteres");

            RuleFor(x => x.Cidade)
               .IsInEnum().WithMessage("Cidade inválida")
               .NotNull().WithMessage("Cidade é obrigatória");

            RuleFor(x => x.Categoria)
                .IsInEnum().WithMessage("Categoria inválida")
                .NotNull().WithMessage("Categoria é obrigatória");

            RuleFor(x => x.Local)
                .NotEmpty().WithMessage("Local é obrigatório")
                .MinimumLength(3).WithMessage("Local deve ter no mínimo 3 caracteres");

            RuleFor(x => x.Data)
                .NotEmpty().WithMessage("Data é obrigatória")
                .GreaterThanOrEqualTo(DateOnly.FromDateTime(DateTime.Now)).WithMessage("Data deve ser igual ou posterior a hoje");

            RuleFor(x => x.Horario)
                .NotEmpty().WithMessage("Horário é obrigatório")
                .Must((dto, horario) => dto.Data > DateOnly.FromDateTime(DateTime.Today) ||
                                        horario >= TimeOnly.FromDateTime(DateTime.Now))
                .WithMessage("Para eventos hoje, o horário deve ser igual ou posterior ao horário atual");

            RuleFor(x => x.UrlDaImagem)
                .MaximumLength(1000).WithMessage("URL da imagem deve ter no máximo 1000 caracteres");
        }
    }
}
