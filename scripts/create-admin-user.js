// Create default admin user in MongoDB
// Run with: node scripts/create-admin-user.js

const fs = require("fs");
const path = require("path");

// Try to load dotenv, but fallback to manual reading if not available
let dotenvLoaded = false;
try {
  require("dotenv").config({ path: ".env.local" });
  dotenvLoaded = true;
} catch (e) {
  // dotenv not available, will read manually
}

// If dotenv didn't load, read .env.local manually
if (!dotenvLoaded) {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      // Skip comments and empty lines
      if (trimmed && !trimmed.startsWith("#")) {
        const match = trimmed.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          let value = match[2].trim();
          // Remove quotes if present
          value = value.replace(/^["']|["']$/g, "");
          process.env[key] = value;
        }
      }
    });
  }
}

const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

if (!MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI not found in .env.local");
  console.log("\nPlease add MONGODB_URI to your .env.local file");
  process.exit(1);
}

async function createAdminUser() {
  let client;

  try {
    console.log("🔄 Connecting to MongoDB...");
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db();
    const adminsCollection = db.collection("admins");

    // Check if admin already exists
    const existingAdmin = await adminsCollection.findOne({
      username: ADMIN_USERNAME,
    });
    if (existingAdmin) {
      console.log(`\n⚠️  Admin user "${ADMIN_USERNAME}" already exists!`);
      console.log(
        "💡 To create a new admin, use a different username or delete the existing one first."
      );

      const update = process.argv.includes("--update");
      if (update) {
        console.log("\n🔄 Updating existing admin password...");
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        await adminsCollection.updateOne(
          { username: ADMIN_USERNAME },
          {
            $set: {
              password: hashedPassword,
              updatedAt: new Date(),
            },
          }
        );
        console.log("✅ Admin password updated successfully!");
      } else {
        console.log(
          "\n💡 To update the password, run: node scripts/create-admin-user.js --update"
        );
      }
      await client.close();
      return;
    }

    // Hash password
    console.log("\n🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create admin user
    const admin = {
      username: ADMIN_USERNAME,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("📝 Creating admin user...");
    const result = await adminsCollection.insertOne(admin);

    console.log("\n✅ Admin user created successfully!");
    console.log("\n📋 Admin Credentials:");
    console.log("   Username:", ADMIN_USERNAME);
    console.log("   Password:", ADMIN_PASSWORD);
    console.log("   ID:", result.insertedId.toString());
    console.log("\n⚠️  IMPORTANT: Save these credentials!");
    console.log("   You will need them to login to the admin portal.");
    console.log("\n🎯 Next steps:");
    console.log("   1. Visit: http://localhost:3000/admin/login");
    console.log("   2. Login with the credentials above");
    console.log("   3. Start adding menu items!");
  } catch (error) {
    console.error("\n❌ Error creating admin user:", error.message);

    if (error.message.includes("authentication")) {
      console.log(
        "\n💡 Tip: Check your MongoDB username and password in the connection string"
      );
    } else if (error.message.includes("IP")) {
      console.log(
        "\n💡 Tip: Make sure your IP is whitelisted in MongoDB Atlas"
      );
    } else if (error.message.includes("timeout")) {
      console.log(
        "\n💡 Tip: Check your internet connection and MongoDB cluster status"
      );
    }

    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log("\n🔌 Connection closed");
    }
  }
}

createAdminUser();
