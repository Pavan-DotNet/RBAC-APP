
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace RBAC_APP.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        [HttpGet("public")]
        public IActionResult PublicEndpoint()
        {
            return Ok("This is a public endpoint. Anyone can access it.");
        }

        [HttpGet("authenticated")]
        [Authorize]
        public IActionResult AuthenticatedEndpoint()
        {
            return Ok("This endpoint requires authentication. You are authenticated.");
        }

        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public IActionResult AdminEndpoint()
        {
            return Ok("This endpoint requires Admin role. You have access.");
        }

        [HttpGet("user")]
        [Authorize(Roles = "User")]
        public IActionResult UserEndpoint()
        {
            return Ok("This endpoint requires User role. You have access.");
        }
    }
}
