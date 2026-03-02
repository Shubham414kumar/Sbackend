const http = require('http');

const BASE = 'http://localhost:5000';
const TEST_EMAIL = `dryrun_${Date.now()}@test.com`;
const TEST_PASSWORD = 'Test@1234';
let savedToken = null;

function request(method, path, body) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE);
        const data = body ? JSON.stringify(body) : null;
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(savedToken ? { 'Authorization': `Bearer ${savedToken}` } : {}),
            },
        };
        const req = http.request(options, (res) => {
            let chunks = '';
            res.on('data', (d) => chunks += d);
            res.on('end', () => {
                let parsed;
                try { parsed = JSON.parse(chunks); } catch { parsed = chunks; }
                resolve({ status: res.statusCode, data: parsed });
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function run() {
    console.log('=== AUTH DRY RUN TEST ===\n');
    console.log(`Test email: ${TEST_EMAIL}`);
    console.log(`Test password: ${TEST_PASSWORD}\n`);

    // 1. Test registration
    console.log('--- 1. POST /api/auth/register ---');
    try {
        const reg = await request('POST', '/api/auth/register', {
            name: 'Dry Run User',
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
            class: '10',
            examCategory: 'SSC',
        });
        console.log(`Status: ${reg.status}`);
        if (reg.status === 200) {
            console.log(`Token received: ${reg.data.token ? 'YES (' + reg.data.token.substring(0, 20) + '...)' : 'NO'}`);
            console.log(`User ID: ${reg.data.user?.id}`);
            console.log(`User name: ${reg.data.user?.name}`);
            console.log(`User email: ${reg.data.user?.email}`);
            console.log(`User class: ${reg.data.user?.class}`);
            console.log('RESULT: ✅ REGISTRATION PASSED\n');
        } else {
            console.log(`Response: ${JSON.stringify(reg.data)}`);
            console.log('RESULT: ❌ REGISTRATION FAILED\n');
        }
    } catch (err) {
        console.log(`ERROR: ${err.message}`);
        console.log('RESULT: ❌ REGISTRATION FAILED (network error)\n');
    }

    // 2. Test duplicate registration
    console.log('--- 2. POST /api/auth/register (duplicate) ---');
    try {
        const dup = await request('POST', '/api/auth/register', {
            name: 'Dry Run User',
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
            class: '10',
            examCategory: 'SSC',
        });
        console.log(`Status: ${dup.status}`);
        console.log(`Response: ${JSON.stringify(dup.data)}`);
        if (dup.status === 400) {
            console.log('RESULT: ✅ DUPLICATE CHECK PASSED\n');
        } else {
            console.log('RESULT: ❌ DUPLICATE CHECK FAILED\n');
        }
    } catch (err) {
        console.log(`ERROR: ${err.message}\n`);
    }

    // 3. Test login
    console.log('--- 3. POST /api/auth/login ---');
    try {
        const login = await request('POST', '/api/auth/login', {
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
        });
        console.log(`Status: ${login.status}`);
        if (login.status === 200 && login.data.token) {
            savedToken = login.data.token;
            console.log(`Token received: YES (${savedToken.substring(0, 20)}...)`);
            console.log(`User: ${login.data.user?.name} (${login.data.user?.email})`);
            console.log(`Streak: ${login.data.user?.streakCount}, XP: ${login.data.user?.xp}`);
            console.log('RESULT: ✅ LOGIN PASSED\n');
        } else {
            console.log(`Response: ${JSON.stringify(login.data)}`);
            console.log('RESULT: ❌ LOGIN FAILED\n');
        }
    } catch (err) {
        console.log(`ERROR: ${err.message}`);
        console.log('RESULT: ❌ LOGIN FAILED (network error)\n');
    }

    // 4. Test wrong password login
    console.log('--- 4. POST /api/auth/login (wrong password) ---');
    try {
        const wrong = await request('POST', '/api/auth/login', {
            email: TEST_EMAIL,
            password: 'WrongPassword123',
        });
        console.log(`Status: ${wrong.status}`);
        console.log(`Response: ${JSON.stringify(wrong.data)}`);
        if (wrong.status === 400) {
            console.log('RESULT: ✅ WRONG PASSWORD CHECK PASSED\n');
        } else {
            console.log('RESULT: ❌ WRONG PASSWORD CHECK FAILED\n');
        }
    } catch (err) {
        console.log(`ERROR: ${err.message}\n`);
    }

    // 5. Test get profile with token
    console.log('--- 5. GET /api/auth/me (with token) ---');
    try {
        const profile = await request('GET', '/api/auth/me');
        console.log(`Status: ${profile.status}`);
        if (profile.status === 200) {
            console.log(`Name: ${profile.data.name}`);
            console.log(`Email: ${profile.data.email}`);
            console.log(`Class: ${profile.data.class}`);
            console.log('RESULT: ✅ GET PROFILE PASSED\n');
        } else {
            console.log(`Response: ${JSON.stringify(profile.data)}`);
            console.log('RESULT: ❌ GET PROFILE FAILED\n');
        }
    } catch (err) {
        console.log(`ERROR: ${err.message}`);
        console.log('RESULT: ❌ GET PROFILE FAILED (network error)\n');
    }

    // 6. Test profile update
    console.log('--- 6. PUT /api/auth/profile ---');
    try {
        const update = await request('PUT', '/api/auth/profile', {
            name: 'Updated Dry Run User',
            examGoal: 'JEE',
        });
        console.log(`Status: ${update.status}`);
        if (update.status === 200) {
            console.log(`Updated name: ${update.data.name}`);
            console.log(`Updated examGoal: ${update.data.examGoal}`);
            console.log('RESULT: ✅ UPDATE PROFILE PASSED\n');
        } else {
            console.log(`Response: ${JSON.stringify(update.data)}`);
            console.log('RESULT: ❌ UPDATE PROFILE FAILED\n');
        }
    } catch (err) {
        console.log(`ERROR: ${err.message}`);
        console.log('RESULT: ❌ UPDATE PROFILE FAILED (network error)\n');
    }

    // 7. Test no-token access
    console.log('--- 7. GET /api/auth/me (no token) ---');
    const oldToken = savedToken;
    savedToken = null;
    try {
        const noauth = await request('GET', '/api/auth/me');
        console.log(`Status: ${noauth.status}`);
        console.log(`Response: ${JSON.stringify(noauth.data)}`);
        if (noauth.status === 401) {
            console.log('RESULT: ✅ NO-TOKEN CHECK PASSED\n');
        } else {
            console.log('RESULT: ❌ NO-TOKEN CHECK FAILED\n');
        }
    } catch (err) {
        console.log(`ERROR: ${err.message}\n`);
    }
    savedToken = oldToken;

    console.log('=== DRY RUN COMPLETE ===');
}

run().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
