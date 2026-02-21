const axios = require('axios');

async function testSignup() {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            name: 'Test User',
            email: 'testuser_' + Date.now() + '@example.com',
            password: 'password123',
            class: '12',
            examCategory: 'SSC'
        });
        console.log('Success:', response.data);
    } catch (e) {
        if (e.response) {
            console.error('Error from server:', e.response.status, e.response.data);
        } else {
            console.error('Network Error:', e.message);
        }
    }
}

testSignup();
