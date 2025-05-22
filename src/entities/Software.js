const { EntitySchema } = require('typeorm');

// Define the Software entity using EntitySchema for plain JavaScript
const Software = new EntitySchema({
    name: 'Software',
    tableName: 'software', // Optional: specify table name
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        name: {
            type: 'varchar',
            unique: true,
        },
        description: {
            type: 'text',
        },
        // Store access levels as an array of strings
        accessLevels: {
            type: 'simple-array', // TypeORM's simple-array maps to text[] in Postgres
        },
    },
    relations: {
        requests: {
            target: 'Request', // Reference the Request entity by its name
            type: 'one-to-many',
            inverseSide: 'software', // Property on the Request entity that refers back to Software
            cascade: true, // Cascade operations
        },
    },
});

module.exports = { Software };