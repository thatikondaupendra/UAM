"use strict";

var _require = require('typeorm'),
  DataSource = _require.DataSource;
var _require2 = require('../entities/User'),
  User = _require2.User;
var _require3 = require('../entities/Software'),
  Software = _require3.Software;
var _require4 = require('../entities/Request'),
  Request = _require4.Request;
var dotenv = require('dotenv');
dotenv.config({
  path: '.env.txt'
}); // Load environment variables

var AppDataSource = new DataSource({
  type: 'mysql',
  // Changed to mysql
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  // Default MySQL port is 3306
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  // WARNING: Set to false in production and use migrations
  logging: false,
  // Set to true to see SQL queries
  entities: [User, Software, Request],
  // Use the EntitySchema objects here
  migrations: [],
  // Add your migration files here
  subscribers: []
});
module.exports = {
  AppDataSource: AppDataSource
};