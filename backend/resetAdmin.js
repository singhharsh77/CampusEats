const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME
        });

        console.log('✅ Connected to MongoDB');

        // Delete existing admin
        const deleted = await User.findOneAndDelete({ email: 'admin@campuseats.com' });
        if (deleted) {
            console.log('🗑️  Deleted existing admin user');
        }

        // Create new admin
        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        const admin = new User({
            name: 'Admin',
            email: 'admin@campuseats.com',
            collegeId: 'ADMIN001',
            password: hashedPassword,
            phone: '9999999999',
            role: 'admin',
            isActive: true
        });

        await admin.save();

        console.log('✅ Admin user reset successfully!');
        console.log('📧 Email: admin@campuseats.com');
        console.log('🔑 Password: Admin@123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error resetting admin:', error.message);
        process.exit(1);
    }
};

resetAdmin();
