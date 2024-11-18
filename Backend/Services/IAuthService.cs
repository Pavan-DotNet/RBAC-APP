
using System;
using System.Threading.Tasks;
using RBAC_APP.Backend.Models;

namespace RBAC_APP.Backend.Services
{
    public interface IAuthService
    {
        Task<(int, string)> Registration(RegistrationModel model, string role);
        Task<(int, string)> Login(LoginModel model);
    }
}
