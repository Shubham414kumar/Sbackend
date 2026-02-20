const axios = require('axios');

async function testSecurity() {
    const API_URL = 'http://localhost:5000';

    console.log('🛡️  Starting Security Scan on ' + API_URL);

    // 1. Check if Server is Running (Health Check)
    try {
        const res = await axios.get(API_URL);
        console.log('✅ Server is UP. Response:', res.data);

        // 2. Check Security Headers (Helmet)
        if (res.headers['x-dns-prefetch-control'] && res.headers['x-frame-options']) {
            console.log('✅ Security Headers Found (Helmet Active)');
        } else {
            console.log('❌ Security Headers MISSING');
        }

    } catch (e) {
        if (e.code === 'ECONNREFUSED') {
            console.error('❌ Server is DOWN. Please start the backend.');
            return;
        }
    }

    // 3. Check Admin Route Protection (Should fail without token)
    try {
        await axios.post(`${API_URL}/api/courses`, { title: 'Hacked Course' });
        console.log('❌ Auth Bypass! Protected Route is OPEN.');
    } catch (e) {
        if (e.response && e.response.status === 401) {
            console.log('✅ Protected Route Locked (401 Unauthorized received).');
        } else {
            console.log('❓ Unexpected Response on Protected Route:', e.message);
        }
    }

    console.log('\n🏁 Security Scan Complete.');
}

testSecurity();
