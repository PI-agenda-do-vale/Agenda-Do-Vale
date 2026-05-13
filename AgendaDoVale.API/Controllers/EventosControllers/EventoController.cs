using AgendaDoVale.Aplication.AplicationInterfaces.Eventos;
using AgendaDoVale.Aplication.Dtos_s.EventosDtos;
using AgendaDoVale.Aplication.Dtos_s.PaginacaoDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static AgendaDoVale.Domain.Entidades.Enums.EventoEnums;

namespace AgendaDoVale.API.Controllers.EventosControllers
{
    [ApiController]
    [Route("api/v1")]
    [Tags("Eventos")]

    public class EventoController : ControllerBase
    {
        private readonly IEventosService _eventosService;

        public EventoController(IEventosService eventosService)
        {
            _eventosService = eventosService;
        }

        [HttpGet("eventos/paginados")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObterEventosPaginados(
            [FromQuery] int pagina = 1, 
            [FromQuery] int tamanhoPagina = 10,
            [FromQuery] string? titulo = null,
            [FromQuery] string? descricao = null,
            [FromQuery] int? cidade = null,
            [FromQuery] int? categoria = null,
            [FromQuery] string? local = null,
            [FromQuery] DateOnly? data = null,
            [FromQuery] TimeOnly? horario = null)
        {
            if (pagina < 1 || tamanhoPagina < 1)
            {
                return BadRequest(new
                {
                    message = "Página e tamanho da página devem ser maiores que 0"
                });
            }

            if (tamanhoPagina > 100)
            {
                return BadRequest(new
                {
                    message = "Tamanho máximo da página é 100"
                });
            }

            var temFiltros = !string.IsNullOrWhiteSpace(titulo) || !string.IsNullOrWhiteSpace(descricao) 
                || cidade.HasValue || categoria.HasValue || !string.IsNullOrWhiteSpace(local) 
                || data.HasValue || horario.HasValue;

            if (!temFiltros)
            {
                var resultado = await _eventosService.ListarEventosPaginadosAsync(pagina, tamanhoPagina);
                return Ok(resultado);
            }

            var filtros = new EventoFiltrosDto
            {
                Titulo = titulo,
                Descricao = descricao,
                Cidade = cidade.HasValue ? (CidadeEventos)cidade.Value : null,
                Categoria = categoria.HasValue ? (CategoriaEventos)categoria.Value : null,
                Local = local,
                Data = data,
                Horario = horario
            };

            var resultadoComFiltros = await _eventosService.ListarEventosPaginadosComFiltrosAsync(pagina, tamanhoPagina, filtros);
            return Ok(resultadoComFiltros);
        }

        [Authorize]
        [HttpPost("eventos/registrar")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CriarEvento(CadastroEventoDto cadastroEventoDto)
        {
            var usuarioId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

            if (usuarioId == null)
            {
                return Unauthorized();
            }

            await _eventosService.CriarEventoAsync(cadastroEventoDto, int.Parse(usuarioId));

            return Ok(new
            {
                message = "Evento criado com sucesso"
            });
        }

        [HttpGet("eventos/{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObterEventoPorId(int id)
        {
            var evento = await _eventosService.ObterEventoPorIdAsync(id);

            if (evento == null)
            {
                return NotFound(new
                {
                    message = "Evento não encontrado"
                });
            }

            return Ok(evento);
        }

        [Authorize]
        [HttpPut("eventos/{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AtualizarEvento([FromRoute] int id, [FromBody] AtualizarEventoDto atualizarEventoDto)
        {
            var usuarioId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

            if (usuarioId == null)
            {
                return Unauthorized();
            }

            try
            {
                var resultado = await _eventosService.AtualizarEventoAsync(id, int.Parse(usuarioId), atualizarEventoDto);

                if (!resultado)
                {
                    return NotFound(new
                    {
                        message = "Evento não encontrado"
                    });
                }

                return Ok(new
                {
                    message = "Evento atualizado com sucesso"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, ex.Message);
            }
        }

        [Authorize]
        [HttpDelete("eventos/{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeletarEvento(int id)
        {
            var usuarioId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

            if (usuarioId == null)
            {
                return Unauthorized();
            }

            try
            {
                var resultado = await _eventosService.DeletarEventoAsync(id, int.Parse(usuarioId));

                if (!resultado)
                {
                    return NotFound(new
                    {
                        message = "Evento não encontrado"
                    });
                }

                return Ok(new
                {
                    message = "Evento deletado com sucesso"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, ex.Message);
            }
        }
    }
}
