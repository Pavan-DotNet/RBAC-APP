

using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using RBAC_APP.Backend.Models;

namespace RBAC_APP.Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;

        public AuthService(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, ILogger<AuthService> logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<(int, string)> Registration(RegistrationModel model, string role)
        {
            _logger.LogInformation($"Attempting to register user: {model.Username}");
            var userExists = await _userManager.FindByNameAsync(model.Username);
            if (userExists != null)
            {
                _logger.LogWarning($"Registration failed. User {model.Username} already exists.");
                return (0, "User already exists");
            }

            IdentityUser user = new()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                _logger.LogError($"User creation failed for {model.Username}. Errors: {string.Join(", ", result.Errors)}");
                return (0, "User creation failed! Please check user details and try again.");
            }

            if (!await _roleManager.RoleExistsAsync(role))
            {
                _logger.LogInformation($"Creating new role: {role}");
                await _roleManager.CreateAsync(new IdentityRole(role));
            }

            await _userManager.AddToRoleAsync(user, role);
            _logger.LogInformation($"User {model.Username} registered successfully with role {role}");
            return (1, "User created successfully!");
        }

        public async Task<(int, string)> Login(LoginModel model)
        {
            _logger.LogInformation($"Login attempt for user: {model.Username}");
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null)
            {
                _logger.LogWarning($"Login failed. Invalid username: {model.Username}");
                return (0, "Invalid username");
            }
            if (!await _userManager.CheckPasswordAsync(user, model.Password))
            {
                _logger.LogWarning($"Login failed. Invalid password for user: {model.Username}");
                return (0, "Invalid password");
            }

            var userRoles = await _userManager.GetRolesAsync(user);
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            string token = GenerateToken(authClaims);
            _logger.LogInformation($"Login successful for user: {model.Username}");
            return (1, token);
        }

        private string GenerateToken(IEnumerable<Claim> claims)
        {
            _logger.LogInformation("Generating JWT token");
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = _configuration["JWT:ValidIssuer"],
                Audience = _configuration["JWT:ValidAudience"],
                Expires = DateTime.UtcNow.AddHours(3),
                SigningCredentials = new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256),
                Subject = new ClaimsIdentity(claims)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}

