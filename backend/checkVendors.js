const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vendor = require('./models/Vendor');

dotenv.config();

const checkVendors = async () => {
    try {
        console.log('🔌 Connecting to:', process.env.MONGO_URI.split('@')[1]);
        console.log('📂 Database Name:', process.env.DB_NAME);

        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME
        });

        console.log('✅ Connected to MongoDB\n');

        const allVendors = await Vendor.find({});
        console.log(`📊 Total Vendors in DB: ${allVendors.length}`);

        if (allVendors.length > 0) {
            console.log('\n📝 All Vendors:');
            allVendors.forEach(v => {
                console.log(`- ${v.name} (isActive: ${v.isActive}, ID: ${v._id})`);
            });
        }

        const activeVendors = await Vendor.find({ isActive: true });
        console.log(`\n✅ Active Vendors: ${activeVendors.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkVendors();
