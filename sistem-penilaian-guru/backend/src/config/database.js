const mongoose = require('mongoose');

const dbURI = process.env.DATABASE_URL || process.env.DB_URI || 'mongodb://localhost:27017/sistem-penilaian-guru';

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;