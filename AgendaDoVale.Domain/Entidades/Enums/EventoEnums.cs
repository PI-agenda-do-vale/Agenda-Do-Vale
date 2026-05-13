using System.ComponentModel.DataAnnotations;

namespace AgendaDoVale.Domain.Entidades.Enums
{
    public static class EventoEnums
    {
        public enum CategoriaEventos
        {
            [Display(Name = "Evento Social")]
            EventoSocial = 1,
            [Display(Name = "Evento Cultural")]
            EventoCultural = 2,
            [Display(Name = "Evento Esportivo")]
            EventoEsportivo = 3,
            [Display(Name = "Evento Tecnico")]
            EventoTecnico = 4,
        }

        public enum CidadeEventos
        {
            [Display(Name = "São José dos Campos")]
            SaoJoseDosCampos = 1,
            [Display(Name = "Taubaté")]
            Taubate = 2,
            [Display(Name = "Jacaraí")]
            Jacarei = 3,
            [Display(Name = "Pindamonhangaba")]
            Pindamonhangaba = 4,
            [Display(Name = "Guaratinguetá")]
            Guaratingueta = 5,
            [Display(Name = "Aparecida")]
            Aparecida = 6,
            [Display(Name = "Lorena")]
            Lorena = 7,
            [Display(Name = "Cruzeiro")]
            Cruzeiro = 8,
            [Display(Name = "Cachoeira Paulista")]
            CachoeiraPaulista = 9,
            [Display(Name = "Roseira")]
            Roseira = 10,
            [Display(Name = "Campos do Jordão")]
            CamposDoJordao = 11,
            [Display(Name = "Caçapava")]
            Cacapava = 12,
        }
    }
}
