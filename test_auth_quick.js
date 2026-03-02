const http = require('http');

const BASE = 'http://localhost:5000';
const EMAIL = `dryrun2_${Date.now()}@test.com`;
const PWD = 'Test@1234';

function req(method, path, body, token) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE);
        const data = body ? JSON.stringify(body) : null;
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const opts = { hostname: url.hostname, port: url.port, path: url.pathname, method, headers };
        const r = http.request(opts, (res) => {
            let c = '';
            res.on('data', (d) => c += d);
            res.on('end', () => {
                try { resolve({ s: res.statusCode, d: JSON.parse(c) }); }
                catch { resolve({ s: res.statusCode, d: c }); }
            });
        });
        r.on('error', reject);
        if (data) r.write(data);
        r.end();
    });
}

async function run() {
    // 1. Register
    const r1 = await req('POST', '/api/auth/register', { name: 'Test', email: EMAIL, password: PWD, class: '10', examCategory: 'SSC' });
    console.log(`1.REGISTER status=${r1.s} hasToken=${!!r1.d?.token} userId=${r1.d?.user?.id || 'none'} msg=${r1.d?.message || 'ok'}`);

    // 2. Login
    const r2 = await req('POST', '/api/auth/login', { email: EMAIL, password: PWD });
    console.log(`2.LOGIN status=${r2.s} hasToken=${!!r2.d?.token} streak=${r2.d?.user?.streakCount} msg=${r2.d?.message || 'ok'}`);
    const token = r2.d?.token;

    // 3. Profile
    const r3 = await req('GET', '/api/auth/me', null, token);
    console.log(`3.PROFILE status=${r3.s} name=${r3.d?.name || 'none'} msg=${r3.d?.message || r3.d?.msg || 'ok'}`);

    // 4. Wrong pwd
    const r4 = await req('POST', '/api/auth/login', { email: EMAIL, password: 'wrong' });
    console.log(`4.WRONG_PWD status=${r4.s} msg=${r4.d?.message || 'ok'}`);

    // 5. No token
    const r5 = await req('GET', '/api/auth/me', null, null);
    console.log(`5.NO_TOKEN status=${r5.s} msg=${r5.d?.message || r5.d?.msg || 'ok'}`);

    // 6. Duplicate register
    const r6 = await req('POST', '/api/auth/register', { name: 'Test', email: EMAIL, password: PWD, class: '10', examCategory: 'SSC' });
    console.log(`6.DUPLICATE status=${r6.s} msg=${r6.d?.message || 'ok'}`);

    // Summary
    const pass = r1.s === 200 && r2.s === 200 && r3.s === 200 && r4.s === 400 && r5.s === 401 && r6.s === 400;
    console.log(`\nALL_TESTS_PASSED=${pass}`);
}

run().catch(e => console.error('FATAL:', e.message));
