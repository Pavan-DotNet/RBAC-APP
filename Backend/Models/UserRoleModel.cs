
using System.ComponentModel.DataAnnotations;

namespace RBAC_APP.Backend.Models
{
    public class UserRoleModel
    {
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Role name is required")]
        public string RoleName { get; set; }
    }
}
