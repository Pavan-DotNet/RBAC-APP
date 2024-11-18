

using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using RBAC_APP.Backend.Models;
using RBAC_APP.Backend.Services;

namespace RBAC_APP.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationModel model)
        {
            _logger.LogInformation($"Registration attempt for user: {model.Username}");
            var (status, message) = await _authService.Registration(model, "User");
            if (status == 0)
            {
                _logger.LogWarning($"Registration failed for user: {model.Username}. Reason: {message}");
                return BadRequest(message);
            }
            _logger.LogInformation($"Registration successful for user: {model.Username}");
            return Ok(message);
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            _logger.LogInformation($"Login attempt for user: {model.Username}");
            var (status, message) = await _authService.Login(model);
            if (status == 0)
            {
                _logger.LogWarning($"Login failed for user: {model.Username}. Reason: {message}");
                return BadRequest(message);
            }
            _logger.LogInformation($"Login successful for user: {model.Username}");
            return Ok(message);
        }
    }
}

