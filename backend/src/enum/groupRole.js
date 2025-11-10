class GroupRole {
  static GROUP_ADMIN = { id: 1, roleName: "Group Admin" };
  static GROUP_MEMBER = { id: 2, roleName: "Group Member" };

  static getRoleById(id) {
    switch (id) {
      case GroupRole.GROUP_ADMIN.id:
        return GroupRole.GROUP_ADMIN;
      case GroupRole.GROUP_MEMBER.id:
        return GroupRole.GROUP_MEMBER;
      default:
        return null;
    }
  }
}

export default GroupRole;
