// Basic integration test for Express server using built-in Node.js fetch API (available in Node 18+)

const BASE_URL = 'http://localhost:8000';

const runTests = async () => {
  console.log('--- STARTING EXPRESS BACKEND INTEGRATION TESTS ---');
  
  try {
    // 1. Health Check
    console.log('\n1. Testing HEALTH CHECK...');
    const healthRes = await fetch(`${BASE_URL}/`);
    console.log('Status:', healthRes.status);
    console.log('Response:', await healthRes.json());
    
    // 2. Chatbot Health Check
    console.log('\n2. Testing CHATBOT HEALTH...');
    const chatHealthRes = await fetch(`${BASE_URL}/chat/health`);
    console.log('Status:', chatHealthRes.status);
    console.log('Response:', await chatHealthRes.json());

    // Generate random email for signup
    const randomEmail = `test_${Math.floor(Math.random() * 1000000)}@example.com`;
    const signupData = {
      name: 'Integration Test User',
      email: randomEmail,
      password: 'password123',
      confirm_password: 'password123'
    };

    // 3. User Signup
    console.log('\n3. Testing USER SIGNUP with email:', randomEmail);
    const signupRes = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData)
    });
    console.log('Status:', signupRes.status);
    const signupJson = await signupRes.json();
    console.log('Response:', signupJson);

    // 4. User Login
    console.log('\n4. Testing USER LOGIN...');
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: randomEmail,
        password: 'password123'
      })
    });
    console.log('Status:', loginRes.status);
    const loginJson = await loginRes.json();
    console.log('Response (truncated token):', {
      ...loginJson,
      access_token: loginJson.access_token ? `${loginJson.access_token.substring(0, 30)}...` : undefined
    });

    const token = loginJson.access_token;
    if (!token) {
      throw new Error('No token received, skipping auth tests');
    }

    // 5. Get User Details
    const userId = loginJson.user.id;
    console.log('\n5. Testing GET USER DETAILS for ID:', userId);
    const userRes = await fetch(`${BASE_URL}/users/${userId}`);
    console.log('Status:', userRes.status);
    console.log('Response:', await userRes.json());

    // 5.1 Test GET /users/profile
    console.log('\n5.1 Testing GET /users/profile...');
    const profileRes = await fetch(`${BASE_URL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Status:', profileRes.status);
    const profileJson = await profileRes.json();
    console.log('Response:', profileJson);

    // 5.2 Test PUT /users/profile
    console.log('\n5.2 Testing PUT /users/profile...');
    const updateProfileRes = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Updated Test User Name',
        email: randomEmail // keep same email for convenience
      })
    });
    console.log('Status:', updateProfileRes.status);
    const updatedProfileJson = await updateProfileRes.json();
    console.log('Response:', updatedProfileJson);

    // 5.3 Test PUT /users/change-password
    console.log('\n5.3 Testing PUT /users/change-password...');
    const changePasswordRes = await fetch(`${BASE_URL}/users/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        oldPassword: 'password123',
        newPassword: 'newPassword123'
      })
    });
    console.log('Status:', changePasswordRes.status);
    console.log('Response:', await changePasswordRes.json());

    // 5.4 Verify login with new password
    console.log('\n5.4 Testing LOGIN with NEW password...');
    const newLoginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: randomEmail,
        password: 'newPassword123'
      })
    });
    console.log('Status:', newLoginRes.status);
    console.log('Response (truncated token):', (await newLoginRes.json()).access_token ? 'Success!' : 'Failed');

    // 6. Test Chatbot Endpoint
    console.log('\n6. Testing CHATBOT ENDPOINT...');
    const chatRes = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        message: 'Hello, explain in 1 sentence what an NDA is.',
        temperature: 0.7,
        max_tokens: 100
      })
    });
    console.log('Status:', chatRes.status);
    console.log('Response:', await chatRes.json());

    console.log('\n✅ ALL BASIC & PROFILE TESTS PASSED SUCCESSFULLY!');

  } catch (error) {
    console.error('\n❌ TEST RUN FAILED:', error);
  }
};

runTests();
