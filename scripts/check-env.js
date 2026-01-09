// Check if environment variables are set correctly
// Run with: node scripts/check-env.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking environment setup...\n');

// Check for .env.local file
const envLocalPath = path.join(__dirname, '..', '.env.local');
const envPath = path.join(__dirname, '..', '.env');
const envLocalWrongPath = path.join(__dirname, '..', 'env.local');

console.log('📁 Checking for environment files:');

if (fs.existsSync(envLocalPath)) {
  console.log('   ✅ .env.local exists (CORRECT)');
} else {
  console.log('   ❌ .env.local NOT FOUND');
  console.log('   💡 Create a file named .env.local (with a dot at the beginning)');
}

if (fs.existsSync(envPath)) {
  console.log('   ⚠️  .env exists (Next.js will use .env.local first)');
}

if (fs.existsSync(envLocalWrongPath)) {
  console.log('   ❌ env.local exists (WRONG NAME - should be .env.local with a dot)');
  console.log('   💡 Rename it to .env.local');
}

// Try to read .env.local
if (fs.existsSync(envLocalPath)) {
  console.log('\n📄 Reading .env.local:');
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  const lines = envContent.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
  
  let hasMongoUri = false;
  let mongoUriValue = '';
  
  lines.forEach(line => {
    if (line.startsWith('MONGODB_URI=')) {
      hasMongoUri = true;
      mongoUriValue = line.split('=')[1]?.trim() || '';
    }
  });
  
  if (hasMongoUri) {
    console.log('   ✅ MONGODB_URI is set');
    
    // Check if database name is included
    if (mongoUriValue.includes('/helens-taste') || mongoUriValue.includes('/helens-taste?')) {
      console.log('   ✅ Database name (/helens-taste) is included');
    } else {
      console.log('   ⚠️  Database name might be missing');
      console.log('   💡 Add /helens-taste before the ? in your connection string');
      console.log('   Example: ...mongodb.net/helens-taste?retryWrites...');
    }
    
    // Check for special characters that might need encoding
    if (mongoUriValue.includes('@') && !mongoUriValue.includes('%40')) {
      console.log('   ⚠️  Password might contain @ that needs URL encoding');
      console.log('   💡 Replace @ with %40 in the password part');
    }
    
    // Show masked connection string
    const masked = mongoUriValue.replace(/:[^:@]+@/, ':****@');
    console.log(`   Connection: ${masked.substring(0, 80)}...`);
  } else {
    console.log('   ❌ MONGODB_URI is NOT set');
    console.log('   💡 Add: MONGODB_URI=your-connection-string');
  }
  
  // Check other required vars
  const requiredVars = ['NEXTAUTH_URL', 'NEXTAUTH_SECRET', 'ADMIN_USERNAME', 'ADMIN_PASSWORD', 'NEXT_PUBLIC_OWNER_WHATSAPP_NUMBER'];
  console.log('\n📋 Other environment variables:');
  requiredVars.forEach(varName => {
    const hasVar = lines.some(line => line.startsWith(varName + '='));
    if (hasVar) {
      console.log(`   ✅ ${varName} is set`);
    } else {
      console.log(`   ⚠️  ${varName} is not set (optional but recommended)`);
    }
  });
} else {
  console.log('\n❌ Cannot read .env.local - file does not exist');
  console.log('\n💡 Create .env.local file with this content:');
  console.log(`
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/helens-taste?retryWrites=true&w=majority
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_OWNER_WHATSAPP_NUMBER=1234567890
  `);
}

console.log('\n✨ Done!');
