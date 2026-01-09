// Test API endpoints
// Run with: node scripts/test-api.js

require('dotenv').config({ path: '.env.local' });

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing API Endpoints...\n');
  console.log(`📍 Base URL: ${BASE_URL}\n`);

  // Test 1: Get Menu Items
  console.log('1️⃣  Testing GET /api/menu...');
  try {
    const response = await fetch(`${BASE_URL}/api/menu`);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`   ✅ Success! Found ${data.length} menu items`);
      if (data.length > 0) {
        console.log(`   📋 Sample item: ${data[0].name} - $${data[0].price}`);
      } else {
        console.log('   💡 No items found. Add items via admin portal or run: node scripts/add-sample-menu.js');
      }
    } else {
      console.log(`   ❌ Error: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
    console.log('   💡 Make sure your dev server is running: npm run dev');
  }

  console.log('\n2️⃣  Testing POST /api/menu (Create Item)...');
  try {
    const testItem = {
      name: 'Test Item',
      description: 'This is a test item',
      price: 9.99,
      category: 'meal',
      available: true,
    };

    const response = await fetch(`${BASE_URL}/api/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testItem),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`   ✅ Success! Created item: ${data.name}`);
      console.log(`   🆔 Item ID: ${data._id}`);
      console.log('   💡 You can delete this test item from admin portal');
    } else {
      console.log(`   ❌ Error: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
  }

  console.log('\n✨ Testing complete!');
  console.log('\n💡 Next steps:');
  console.log('   1. Visit http://localhost:3000 to see your menu');
  console.log('   2. Visit http://localhost:3000/admin/login to manage items');
  console.log('   3. Run: node scripts/add-sample-menu.js to add sample data');
}

// Check if fetch is available (Node 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ or install node-fetch');
  console.log('💡 Alternative: Test API using browser or Postman');
  process.exit(1);
}

testAPI();
