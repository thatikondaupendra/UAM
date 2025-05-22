async function testRequestDtos() {
  const { CreateRequestDto, UpdateRequestStatusDto } = require('./dtos/request.dto'); // Adjust path as needed

  console.log('\n--- Testing CreateRequestDto (Manual Validation) ---');

  // Valid CreateRequestDto
  const validCreate = new CreateRequestDto({
    softwareId: 123,
    accessType: 'Read',
    reason: 'I need to view the software for reporting purposes.'
  });
  let errors = validCreate.validate();
  if (errors.length === 0) {
    console.log('Valid CreateRequestDto is valid!');
  } else {
    console.error('Valid CreateRequestDto failed validation (should not happen):', errors);
  }

  // Invalid CreateRequestDto - wrong types, short reason, invalid access type
  const invalidCreate1 = new CreateRequestDto({
    softwareId: 'abc', // Not an integer
    accessType: 'Execute', // Invalid
    reason: 'Short.' // Too short
  });
  errors = invalidCreate1.validate();
  if (errors.length === 0) {
    console.log('Invalid CreateRequestDto 1 is valid (should not happen)!');
  } else {
    console.error('Invalid CreateRequestDto 1 failed validation as expected:', errors);
  }

  // Invalid CreateRequestDto - missing fields (will result in undefined values)
  const invalidCreate2 = new CreateRequestDto({});
  errors = invalidCreate2.validate();
  if (errors.length === 0) {
    console.log('Invalid CreateRequestDto 2 is valid (should not happen)!');
  } else {
    console.error('Invalid CreateRequestDto 2 failed validation as expected:', errors);
  }

  console.log('\n--- Testing UpdateRequestStatusDto (Manual Validation) ---');

  // Valid UpdateRequestStatusDto
  const validUpdate = new UpdateRequestStatusDto({
    status: 'Approved'
  });
  errors = validUpdate.validate();
  if (errors.length === 0) {
    console.log('Valid UpdateRequestStatusDto is valid!');
  } else {
    console.error('Valid UpdateRequestStatusDto failed validation (should not happen):', errors);
  }

  // Invalid UpdateRequestStatusDto - invalid status
  const invalidUpdate1 = new UpdateRequestStatusDto({
    status: 'Pending'
  });
  errors = invalidUpdate1.validate();
  if (errors.length === 0) {
    console.log('Invalid UpdateRequestStatusDto 1 is valid (should not happen)!');
  } else {
    console.error('Invalid UpdateRequestStatusDto 1 failed validation as expected:', errors);
  }

  // Invalid UpdateRequestStatusDto - wrong type
  const invalidUpdate2 = new UpdateRequestStatusDto({
    status: 123
  });
  errors = invalidUpdate2.validate();
  if (errors.length === 0) {
    console.log('Invalid UpdateRequestStatusDto 2 is valid (should not happen)!');
  } else {
    console.error('Invalid UpdateRequestStatusDto 2 failed validation as expected:', errors);
  }
}

testRequestDtos();