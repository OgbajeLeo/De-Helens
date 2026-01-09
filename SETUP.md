# Quick Setup Guide

Follow these steps to get your restaurant website up and running:

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up MongoDB

### Option A: Local MongoDB
1. Install MongoDB on your machine
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/helens-taste`

### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `<password>` with your database password

## Step 3: Create Environment File

Create `.env.local` in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/helens-taste
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/helens-taste

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-random-string-here

# Admin Credentials (change these!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password

# WhatsApp Number (include country code, no + sign)
# Example: 1234567890 for US, 447911123456 for UK
NEXT_PUBLIC_OWNER_WHATSAPP_NUMBER=1234567890
```

## Step 4: Create Admin User

After starting the server, create your admin account:

**Method 1: Using API (Recommended)**
```bash
curl -X POST http://localhost:3000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```

**Method 2: Using Script**
```bash
node scripts/setup-admin.js
```

## Step 5: Start Development Server

```bash
npm run dev
```

## Step 6: Access the Website

- **Customer Site**: http://localhost:3000
- **Admin Portal**: http://localhost:3000/admin/login

## Step 7: Add Menu Items

1. Login to admin portal
2. Click "Add New Item"
3. Fill in the form:
   - Name
   - Description
   - Price
   - Category (Meal or Drink)
   - Image URL (optional)
   - Available (checkbox)

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify connection string in `.env.local`
- For Atlas: Check IP whitelist and credentials

### Admin Login Not Working
- Make sure you've created the admin user (Step 4)
- Check username/password in `.env.local`
- Verify MongoDB connection

### WhatsApp Not Opening
- Check `NEXT_PUBLIC_OWNER_WHATSAPP_NUMBER` in `.env.local`
- Format: country code + number (no +, no spaces)
- Example: `1234567890` for US number

## Next Steps

1. Add your menu items through the admin portal
2. Customize colors and styling if needed
3. Test the cart and checkout flow
4. Deploy to production (Vercel, Netlify, etc.)

## Production Checklist

- [ ] Change admin password
- [ ] Update `NEXTAUTH_SECRET` to a secure random string
- [ ] Use MongoDB Atlas or production MongoDB
- [ ] Update `NEXTAUTH_URL` to your production domain
- [ ] Set `NEXT_PUBLIC_OWNER_WHATSAPP_NUMBER` to production number
- [ ] Test all functionality
- [ ] Set up SSL/HTTPS
