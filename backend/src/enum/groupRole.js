class GroupRole {
  static ADMIN = { id: 1, roleName: "Admin" };
  static MEMBER = { id: 2, roleName: "Member" };

  static getRoleById(id) {
    switch (id) {
      case GroupRole.ADMIN.id:
        return GroupRole.ADMIN;
      case GroupRole.MEMBER.id:
        return GroupRole.MEMBER;
      default:
        return null;
    }
  }
}

export default GroupRole;
