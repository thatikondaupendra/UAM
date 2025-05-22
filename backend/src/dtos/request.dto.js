
class CreateRequestDto {
  constructor(data) {
    // Assign properties from the input data
    this.softwareId = data.softwareId;
    this.accessType = data.accessType;
    this.reason = data.reason;
  }

  /**
   * Validates the properties of the DTO manually.
   * @returns {string[]} An array of error messages, or an empty array if valid.
   */
  validate() {
    const errors = [];

    // --- Validate 'softwareId' ---
    // Check if it's a number and an integer
    if (typeof this.softwareId !== 'number' || !Number.isInteger(this.softwareId)) {
      errors.push('Software ID must be an integer.');
    }

    // --- Validate 'accessType' ---
    const allowedAccessTypes = ['Read', 'Write', 'Admin'];
    if (typeof this.accessType !== 'string') {
      errors.push('Access type must be a string.');
    } else if (!allowedAccessTypes.includes(this.accessType)) {
      errors.push(`Invalid access type. Must be one of: ${allowedAccessTypes.join(', ')}.`);
    }

    // --- Validate 'reason' ---
    if (typeof this.reason !== 'string') {
      errors.push('Reason must be a string.');
    } else if (this.reason.length < 10) {
      errors.push('Reason must be at least 10 characters long.');
    }

    return errors;
  }
}

class UpdateRequestStatusDto {
  constructor(data) {
    // Assign properties from the input data
    this.status = data.status;
  }

  /**
   * Validates the properties of the DTO manually.
   * @returns {string[]} An array of error messages, or an empty array if valid.
   */
  validate() {
    const errors = [];

    // --- Validate 'status' ---
    const allowedStatuses = ['Approved', 'Rejected'];
    if (typeof this.status !== 'string') {
      errors.push('Status must be a string.');
    } else if (!allowedStatuses.includes(this.status)) {
      errors.push(`Invalid status. Must be one of: ${allowedStatuses.join(', ')}.`);
    }

    return errors;
  }
}

module.exports = { CreateRequestDto, UpdateRequestStatusDto };

