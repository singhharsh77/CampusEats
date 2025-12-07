const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Vendor = require('./models/Vendor');
const MenuItem = require('./models/MenuItem');

async function debugVendorData() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME,
        });
        console.log('✅ Connected to MongoDB');

        // 1. Check User
        const user = await User.findOne({ email: 'vendor@college.edu' });
        if (!user) {
            console.log('❌ User vendor@college.edu NOT FOUND');
            process.exit(1);
        }
        console.log(`✅ Found User: ${user.email} (ID: ${user._id})`);

        // 2. Check Vendor linked to this user
        const vendor = await Vendor.findOne({ userId: user._id });
        if (!vendor) {
            console.log('❌ No Vendor linked to this user ID!');
            // Check if ANY vendor exists
            const anyVendor = await Vendor.findOne();
            if (anyVendor) {
                console.log(`⚠️  Found orphan vendor: ${anyVendor.name} (linked to UserID: ${anyVendor.userId})`);
            }
        } else {
            console.log(`✅ Found Vendor: ${vendor.name} (ID: ${vendor._id})`);

            // 3. Check Menu Items for this vendor
            const menuItems = await MenuItem.find({ vendorId: vendor._id });
            console.log(`📊 Menu Items count: ${menuItems.length}`);
            menuItems.forEach(item => {
                console.log(`   - ${item.name} (${item.isAvailable ? 'Available' : 'Unavailable'})`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

debugVendorData();
