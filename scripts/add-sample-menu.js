// Add sample menu items to MongoDB
// Run with: node scripts/add-sample-menu.js

require('dotenv').config({ path: '.env.local' });
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not found in .env.local');
  process.exit(1);
}

const sampleMenuItems = [
  // Meals
  {
    name: 'Jollof Rice',
    description: 'Traditional Nigerian jollof rice with tender chicken, perfectly spiced and served with plantain',
    price: 15.99,
    category: 'meal',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Fried Rice',
    description: 'Delicious fried rice with mixed vegetables, eggs, and your choice of protein',
    price: 12.99,
    category: 'meal',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Grilled Chicken',
    description: 'Tender grilled chicken marinated in special spices, served with sides',
    price: 18.99,
    category: 'meal',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop',
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Beef Stew',
    description: 'Rich and flavorful beef stew with vegetables, perfect with rice or bread',
    price: 16.99,
    category: 'meal',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Drinks
  {
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice, served cold and refreshing',
    price: 4.99,
    category: 'drink',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop',
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Mango Smoothie',
    description: 'Creamy and sweet mango smoothie, blended to perfection',
    price: 5.99,
    category: 'drink',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop',
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Lemonade',
    description: 'Refreshing homemade lemonade, sweet and tangy',
    price: 3.99,
    category: 'drink',
    image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?w=400&h=300&fit=crop',
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Strawberry Milkshake',
    description: 'Creamy strawberry milkshake topped with whipped cream',
    price: 6.99,
    category: 'drink',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop',
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function addSampleMenu() {
  let client;
  
  try {
    console.log('🔄 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const menuCollection = db.collection('menu');
    
    // Check if items already exist
    const existingCount = await menuCollection.countDocuments();
    if (existingCount > 0) {
      console.log(`\n⚠️  Found ${existingCount} existing menu items`);
      console.log('💡 To add sample data, delete existing items first or use admin portal');
      console.log('   Sample items will be added anyway...\n');
    }
    
    // Insert sample items
    console.log('📝 Adding sample menu items...');
    const result = await menuCollection.insertMany(sampleMenuItems);
    
    console.log(`\n✅ Successfully added ${result.insertedCount} menu items!`);
    console.log('\n📊 Items added:');
    
    const meals = sampleMenuItems.filter(item => item.category === 'meal');
    const drinks = sampleMenuItems.filter(item => item.category === 'drink');
    
    console.log(`\n🍽️  Meals (${meals.length}):`);
    meals.forEach(item => {
      console.log(`   - ${item.name} - $${item.price.toFixed(2)}`);
    });
    
    console.log(`\n🥤 Drinks (${drinks.length}):`);
    drinks.forEach(item => {
      console.log(`   - ${item.name} - $${item.price.toFixed(2)}`);
    });
    
    console.log('\n🎉 Done! Refresh your website to see the items.');
    console.log('   Visit: http://localhost:3000');
    
  } catch (error) {
    console.error('\n❌ Error adding sample menu:', error.message);
    
    if (error.message.includes('authentication')) {
      console.log('\n💡 Tip: Check your MongoDB username and password');
    } else if (error.message.includes('IP')) {
      console.log('\n💡 Tip: Make sure your IP is whitelisted in MongoDB Atlas');
    } else if (error.message.includes('timeout')) {
      console.log('\n💡 Tip: Check your internet connection and MongoDB cluster status');
    }
    
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Connection closed');
    }
  }
}

addSampleMenu();
