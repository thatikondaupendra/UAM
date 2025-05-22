
async function testCreateSoftwareDto() {
  const { CreateSoftwareDto } = require('./dtos/software.dto'); // Adjust path as needed

  console.log('\n--- Testing CreateSoftwareDto (Manual Validation) ---');

  // Valid DTO
  const validDto = new CreateSoftwareDto({
    name: 'My Awesome App',
    description: 'This is a detailed description of my awesome application.',
    accessLevels: ['Read', 'Write']
  });
  let errors = validDto.validate();
  if (errors.length === 0) {
    console.log('Valid DTO is valid!');
  } else {
    console.error('Valid DTO failed validation (should not happen):', errors);
  }

  // Invalid DTO - short name, short description, empty array, invalid level
  const invalidDto1 = new CreateSoftwareDto({
    name: 'App',
    description: 'Short.',
    accessLevels: []
  });
  errors = invalidDto1.validate();
  if (errors.length === 0) {
    console.log('Invalid DTO 1 is valid (should not happen)!');
  } else {
    console.error('Invalid DTO 1 failed validation as expected:', errors);
  }

  // Invalid DTO - missing fields, invalid level
  const invalidDto2 = new CreateSoftwareDto({
    name: 'Another App',
    description: 'A longer description for another application.',
    accessLevels: ['Read', 'Execute', 'Admin'] // 'Execute' is invalid
  });
  errors = invalidDto2.validate();
  if (errors.length === 0) {
    console.log('Invalid DTO 2 is valid (should not happen)!');
  } else {
    console.error('Invalid DTO 2 failed validation as expected:', errors);
  }

  // Invalid DTO - incorrect types
  const invalidDto3 = new CreateSoftwareDto({
    name: 123,
    description: true,
    accessLevels: 'not an array'
  });
  errors = invalidDto3.validate();
  if (errors.length === 0) {
    console.log('Invalid DTO 3 is valid (should not happen)!');
  } else {
    console.error('Invalid DTO 3 failed validation as expected:', errors);
  }
}

testCreateSoftwareDto();