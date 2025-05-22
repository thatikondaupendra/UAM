require('reflect-metadata'); // Required for TypeORM decorators (used by class-validator/transformer)
const { AppDataSource } = require('./config/database');
const { app } = require('./app');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.txt'  }); // Load environment variables from .env file

const PORT = process.env.PORT || 3000;

async function bootstrap() {
    try {
        // Initialize database connection
        await AppDataSource.initialize();
        console.log('Database connected successfully!');

        // Start the Express server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        // Important: Log the specific error details for debugging
        if (error.code === 'ECONNREFUSED') {
            console.error('Database connection refused. Please ensure your MySQL server is running and accessible on the configured host and port.');
            console.error(`Attempted to connect to: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '3306'}`);
        }
        process.exit(1); // Exit with failure code
    }
}

// 6. Call the bootstrap function to start the application
bootstrap();