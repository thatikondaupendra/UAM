"use strict";

var _require = require('typeorm'),
  EntitySchema = _require.EntitySchema;

// Define the Request entity using EntitySchema for plain JavaScript
var Request = new EntitySchema({
  name: 'Request',
  tableName: 'request',
  // Optional: specify table name
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    accessType: {
      type: 'enum',
      "enum": ['Read', 'Write', 'Admin']
    },
    reason: {
      type: 'text'
    },
    status: {
      type: 'enum',
      "enum": ['Pending', 'Approved', 'Rejected'],
      "default": 'Pending'
    },
    createdAt: {
      type: 'timestamp',
      createDate: true // Automatically set creation timestamp
    }
  },
  relations: {
    user: {
      target: 'User',
      // Reference the User entity by its name
      type: 'many-to-one',
      joinColumn: true,
      // Creates a foreign key column in the 'request' table
      inverseSide: 'requests',
      // Property on the User entity that refers back to Request
      onDelete: 'CASCADE' // If a user is deleted, their requests are also deleted
    },
    software: {
      target: 'Software',
      // Reference the Software entity by its name
      type: 'many-to-one',
      joinColumn: true,
      // Creates a foreign key column in the 'request' table
      inverseSide: 'requests',
      // Property on the Software entity that refers back to Request
      onDelete: 'CASCADE' // If software is deleted, related requests are also deleted
    }
  }
});
module.exports = {
  Request: Request
};