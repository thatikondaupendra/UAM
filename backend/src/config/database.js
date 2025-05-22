const { DataSource } = require('typeorm');
const { User } = require('../entities/User');
const { Software } = require('../entities/Software');
const { Request } = require('../entities/Request');
const dotenv = require('dotenv');

dotenv.config({path: '.env.txt'}); // Load environment variables

const AppDataSource = new DataSource({
    type: 'mysql', // Changed to mysql
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10), // Default MySQL port is 3306
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true, // WARNING: Set to false in production and use migrations
    logging: false, // Set to true to see SQL queries
    entities: [User, Software, Request], // Use the EntitySchema objects here
    migrations: [], // Add your migration files here
    subscribers: [],
});

module.exports = { AppDataSource };