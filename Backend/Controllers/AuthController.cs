
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RBAC_APP.Backend.Models;
using RBAC_APP.Backend.Services;

namespace RBAC_APP.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationModel model)
        {
            var (status, message) = await _authService.Registration(model, "User");
            if (status == 0)
            {
                return BadRequest(message);
            }
            return Ok(message);
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var (status, message) = await _authService.Login(model);
            if (status == 0)
            {
                return BadRequest(message);
            }
            return Ok(message);
        }
    }
}
