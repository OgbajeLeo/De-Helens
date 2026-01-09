// Test MongoDB Connection
// Run with: node scripts/test-connection.js

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not found in .env.local');
  console.log('\nPlease add MONGODB_URI to your .env.local file');
  process.exit(1);
}

async function testConnection() {
  let client;
  
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log('📍 Connection string:', MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Hide password
    
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test database operations
    const db = client.db();
    const collections = await db.listCollections().toArray();
    
    console.log('\n📊 Database Info:');
    console.log('   Database name:', db.databaseName);
    console.log('   Collections:', collections.length > 0 ? collections.map(c => c.name).join(', ') : 'None (will be created automatically)');
    
    // Test write operation
    const testCollection = db.collection('connection_test');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date() 
    });
    await testCollection.deleteOne({ test: true });
    
    console.log('✅ Write/Read test passed!');
    console.log('\n🎉 Your MongoDB connection is working perfectly!');
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('authentication')) {
      console.log('\n💡 Tip: Check your username and password in the connection string');
    } else if (error.message.includes('IP')) {
      console.log('\n💡 Tip: Make sure your IP is whitelisted in Network Access');
    } else if (error.message.includes('timeout')) {
      console.log('\n💡 Tip: Check your internet connection and cluster status');
    }
    
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Connection closed');
    }
  }
}

testConnection();
