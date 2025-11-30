const axios = require('axios');

const testRateLimit = async () => {
    const url = 'http://localhost:5001/api/auth/login';
    const payload = { email: 'test@test.com', password: 'password' };

    console.log('🚀 Starting Rate Limit Test...');

    let successCount = 0;
    let blockedCount = 0;

    for (let i = 1; i <= 25; i++) {
        try {
            await axios.post(url, payload);
            console.log(`✅ Request ${i}: Allowed`);
            successCount++;
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.log(`⛔ Request ${i}: BLOCKED (429 Too Many Requests)`);
                blockedCount++;
            } else {
                // Ignore other errors (like 401 invalid credentials)
                console.log(`✅ Request ${i}: Allowed (Status ${error.response?.status})`);
                successCount++;
            }
        }
    }

    console.log('\n📊 Test Results:');
    console.log(`Allowed: ${successCount}`);
    console.log(`Blocked: ${blockedCount}`);

    if (blockedCount > 0) {
        console.log('✅ Rate limiting is WORKING!');
    } else {
        console.log('❌ Rate limiting failed (or limit not reached).');
    }
};

testRateLimit();
