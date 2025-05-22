// C:\Users\tupen\Desktop\UAM\backend\tests\test-auth-dtos.js (example new file)

// ONLY require your DTOs here
const { RegisterUserDto, LoginUserDto } = require('../src/dtos/auth.dto');

async function runAuthDtoTests() {
  console.log('\n--- Testing RegisterUserDto (Manual Validation) ---');
  const validRegister = new RegisterUserDto('validuser', 'strongpassword');
  let errors = validRegister.validate();
  if (errors.length === 0) {
    console.log('Valid registration DTO is valid!');
  } else {
    console.error('Valid registration DTO failed validation:', errors);
  }

  const invalidRegister = new RegisterUserDto('sh', 'p');
  errors = invalidRegister.validate();
  if (errors.length === 0) {
    console.log('Invalid registration DTO is valid (should not happen)!');
  } else {
    console.error('Invalid registration DTO failed validation as expected:', errors);
  }

  console.log('\n--- Testing LoginUserDto (Manual Validation) ---');
  const validLogin = new LoginUserDto('existinguser', 'correctpassword');
  errors = validLogin.validate();
  if (errors.length === 0) {
    console.log('Valid login DTO is valid!');
  } else {
    console.error('Valid login DTO failed validation:', errors);
  }

  const invalidLogin = new LoginUserDto(123, 'abc');
  errors = invalidLogin.validate();
  if (errors.length === 0) {
    console.log('Invalid login DTO is valid (should not happen)!');
  } else {
    console.error('Invalid login DTO failed validation as expected:', errors);
  }
}

runAuthDtoTests();