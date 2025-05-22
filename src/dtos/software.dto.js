
class CreateSoftwareDto {
  constructor(data) {
    // Assign properties from the input data
    this.name = data.name;
    this.description = data.description;
    this.accessLevels = data.accessLevels;
  }

  /**
   * Validates the properties of the DTO manually.
   * @returns {string[]} An array of error messages, or an empty array if valid.
   */
  validate() {
    const errors = [];

    // --- Validate 'name' ---
    if (typeof this.name !== 'string') {
      errors.push('Software name must be a string.');
    } else if (this.name.length < 3) {
      errors.push('Software name must be at least 3 characters long.');
    }

    // --- Validate 'description' ---
    if (typeof this.description !== 'string') {
      errors.push('Description must be a string.');
    } else if (this.description.length < 10) {
      errors.push('Description must be at least 10 characters long.');
    }

    // --- Validate 'accessLevels' ---
    if (!Array.isArray(this.accessLevels)) {
      errors.push('Access levels must be an array.');
    } else if (this.accessLevels.length === 0) {
      errors.push('At least one access level must be selected.');
    } else {
      const allowedAccessLevels = ['Read', 'Write', 'Admin'];
      this.accessLevels.forEach((level, index) => {
        if (typeof level !== 'string' || !allowedAccessLevels.includes(level)) {
          errors.push(`Invalid access level provided at index ${index}: "${level}". Must be one of: ${allowedAccessLevels.join(', ')}.`);
        }
      });
    }

    return errors;
  }
}

module.exports = { CreateSoftwareDto };
