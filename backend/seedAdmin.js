const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdminUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME
        });

        console.log('✅ Connected to MongoDB\n');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@campuseats.com' });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log('📧 Email: admin@campuseats.com');
            process.exit(0);
        }

        // Create admin user
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

        console.log('✅ Admin user created successfully!\n');
        console.log('📧 Email: admin@campuseats.com');
        console.log('🔑 Password: Admin@123');
        console.log('\n⚠️  Please change the password after first login!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
};

createAdminUser();
