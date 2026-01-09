# De Helen's Taste - Restaurant Website

A modern restaurant website built with Next.js, featuring menu management, cart functionality, WhatsApp order integration, and an admin portal.

## Features

- 🍽️ **Landing Page** with hero section, meals, drinks, and about sections
- 🛒 **Shopping Cart** with persistent storage
- 📱 **WhatsApp Integration** for order notifications
- 🔐 **Admin Portal** for managing menu items
- 🎨 **Beautiful UI** with light green and yellow color scheme
- 💾 **MongoDB** integration for data storage

## Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- npm or yarn package manager

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd helens
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/helens-taste
   # Or use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/helens-taste

   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123

   NEXT_PUBLIC_OWNER_WHATSAPP_NUMBER=1234567890
   ```
   
   **Important:** 
   - Replace `NEXT_PUBLIC_OWNER_WHATSAPP_NUMBER` with the actual WhatsApp number (include country code, no + sign)
   - Change `NEXTAUTH_SECRET` to a random string for production
   - Update MongoDB URI with your database connection string

4. **Set up the admin user:**
   
   You can either:
   
   **Option A:** Use the API endpoint (after starting the server):
   ```bash
   curl -X POST http://localhost:3000/api/auth/setup \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```
   
   **Option B:** Use the setup script:
   ```bash
   node scripts/setup-admin.js
   ```
   
   Make sure your MongoDB is running and `MONGODB_URI` is set correctly.

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Customer Flow

1. Browse the menu on the landing page
2. Add items to cart
3. View cart and adjust quantities
4. Proceed to checkout
5. Enter customer information
6. Complete order - opens WhatsApp with order details

### Admin Portal

1. Navigate to `/admin/login`
2. Login with your admin credentials
3. Manage menu items:
   - Add new items (meals or drinks)
   - Edit existing items
   - Delete items
   - Toggle availability

## Project Structure

```
helens/
├── app/
│   ├── api/              # API routes
│   │   ├── menu/         # Menu CRUD operations
│   │   ├── auth/         # Authentication endpoints
│   │   └── orders/       # Order management
│   ├── admin/            # Admin portal pages
│   ├── cart/             # Cart page
│   ├── checkout/         # Checkout page
│   └── page.tsx          # Landing page
├── components/            # React components
├── context/              # React contexts (Cart, Auth)
├── lib/                  # Utilities and models
└── scripts/              # Setup scripts
```

## API Endpoints

### Menu
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create a new menu item
- `GET /api/menu/[id]` - Get a specific menu item
- `PUT /api/menu/[id]` - Update a menu item
- `DELETE /api/menu/[id]` - Delete a menu item

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/setup` - Create admin user (one-time setup)

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create a new order

## Database Collections

- `menu` - Menu items (meals and drinks)
- `orders` - Customer orders
- `admins` - Admin users

## Technologies Used

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **MongoDB** - Database
- **bcryptjs** - Password hashing
- **React Icons** - Icons

## Color Scheme

- Light Green: `#90EE90`
- Yellow: `#FFD700`
- Dark Green: `#228B22`

## Production Deployment

1. Update all environment variables with production values
2. Set up MongoDB Atlas or production MongoDB instance
3. Build the application:
   ```bash
   npm run build
   ```
4. Start the production server:
   ```bash
   npm start
   ```

## Notes

- The cart is stored in browser localStorage
- Admin authentication uses localStorage (consider upgrading to NextAuth.js for production)
- WhatsApp integration opens WhatsApp Web/App with pre-filled message
- Make sure to change default admin credentials in production

## Support

For issues or questions, please check the codebase or create an issue in the repository.
