

class RegisterUserDto {
  constructor(data) {
    console.log(data)
    this.username = data.user.username;
    this.password = data.password;
  }

  validate() {
    const errors = [];

    if (typeof this.username !== 'string' || this.username.length < 3 || this.username.length > 20) {
      errors.push('Username must be a string between 3 and 20 characters long.');
    }
    if (typeof this.password !== 'string' || this.password.length < 6) {
      errors.push('Password must be a string at least 6 characters long.');
    }

    return errors;
  }
}

class LoginUserDto {
  constructor(data) {
    this.username = data.username;
    this.password = data.password;
  }

  validate() {
    const errors = [];

    if (typeof this.username !== 'string') {
      errors.push('Username must be a string.');
    }
    if (typeof this.password !== 'string') {
      errors.push('Password must be a string.');
    }

    return errors;
  }
}

module.exports = { RegisterUserDto, LoginUserDto };