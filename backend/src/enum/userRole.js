class UserRole {
  static ADMIN = { id: 1, roleName: "Server Admin" };
  static MANAGER = { id: 2, roleName: "Server Manager" };

  static getRoleById(id) {
    switch (id) {
      case UserRole.ADMIN.id:
        return UserRole.ADMIN;
      case UserRole.MANAGER.id:
        return UserRole.MANAGER;
      default:
        return null;
    }
  }
}

export default UserRole;
