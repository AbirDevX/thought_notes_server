class UserDto {
  constructor(user) {
    this.name = user.name;
    this.email = user.email;
    this.mobile = user.mobile;
    this.role = user.role;
    this.avatar = user.avatar;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

module.exports = { UserDto };
