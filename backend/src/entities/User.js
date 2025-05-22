const { EntitySchema } = require('typeorm');

// Define the User entity using EntitySchema for plain JavaScript
const User = new EntitySchema({
    name: 'User',
    tableName: 'user', // Optional: specify table name if different from entity name
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        username: {
            type: 'varchar',
            unique: true,
        },
        password: {
            type: 'varchar',
        },
        role: {
            type: 'enum',
            enum: ['Employee', 'Manager', 'Admin'],
            default: 'Employee',
        },
    },
    relations: {
        requests: {
            target: 'Request', // Reference the Request entity by its name
            type: 'one-to-many',
            inverseSide: 'user', // Property on the Request entity that refers back to User
            cascade: true, // Cascade operations (e.g., deleting a user deletes their requests)
        },
    },
});

module.exports = { User };
