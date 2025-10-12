# 📊 Subscription Management App

A modern, full-stack subscription management application built with Next.js, featuring real-time currency conversion, advanced analytics, and PWA capabilities. Track your subscriptions, analyze spending patterns, and manage shared subscriptions with ease.

![Subscription Management App](https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-6.19.0-green?style=for-the-badge&logo=mongodb)

## 🎯 Project Overview

This application helps users manage their subscription services efficiently by providing:
- **Centralized tracking** of all subscription services
- **Real-time currency conversion** for global users
- **Advanced analytics** with spending insights
- **Shared subscription management** for family/team accounts
- **PWA capabilities** for mobile-first experience
- **Secure authentication** with JWT and Google OAuth

## ✨ Features

### 🏠 Dashboard
- **Overview Statistics**: Total monthly/yearly spending with real-time currency conversion
- **Subscription Cards**: Visual cards showing subscription details, billing cycles, and cost per person
- **Smart Notifications**: Intelligent alerts for upcoming renewals and spending insights
- **Responsive Design**: Optimized for desktop and mobile devices

### 📈 Advanced Analytics
- **Spending Trends**: Interactive charts showing spending patterns over time
- **Category Breakdown**: Visual distribution of spending by subscription categories
- **Cost Analysis**: Detailed insights into subscription costs and trends
- **Currency Support**: Multi-currency support with real-time conversion rates

### 💰 Financial Management
- **Real-time Currency Conversion**: Live exchange rates using ExchangeRate-API
- **Shared Subscriptions**: Track subscriptions shared among multiple people
- **Cost Per Person**: Automatic calculation of individual costs for shared subscriptions
- **Multiple Billing Cycles**: Support for monthly, yearly, weekly, and daily billing

### ⚙️ Settings & Customization
- **Currency Selection**: Choose your preferred base currency for all calculations
- **Persistent Settings**: Settings saved across browser sessions
- **Collapsible Sidebar**: Space-efficient navigation with persistent state

### 📱 PWA Features
- **Offline Support**: Service worker for offline functionality
- **Installable**: Add to home screen on mobile devices
- **App Manifest**: Native app-like experience
- **Caching**: Intelligent caching for improved performance

## 🚀 Tech Stack

### Frontend
- **Next.js 15.5.2** - React framework with App Router
- **React 19.1.0** - UI library with latest features
- **Tailwind CSS 3.4.0** - Utility-first CSS framework
- **Recharts 3.2.0** - Data visualization library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB 6.19.0** - NoSQL database
- **bcryptjs 3.0.2** - Password hashing
- **jsonwebtoken 9.0.2** - JWT authentication

### Utilities
- **Real-time Currency API** - ExchangeRate-API for live conversion rates
- **Data Caching** - Custom caching system with localStorage
- **Service Worker** - Offline functionality and caching

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB database (local or cloud)
- ExchangeRate-API key (free tier available)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/subscription-management.git
   cd subscription-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/subscription-management
   
   # Authentication
   JWT_SECRET=your_super_secret_jwt_key_here
   
   # Currency API
   EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Initialize the database**
   ```bash
   npm run init-db
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Deploy to Vercel** (recommended)
   ```bash
   npm install -g vercel
   vercel --prod
   ```

## 📁 Project Structure

```
subscription-management/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── subscriptions/ # Subscription CRUD operations
│   │   │   └── categories/    # Category management
│   │   ├── analytics/         # Analytics dashboard
│   │   ├── login/            # Login page
│   │   └── register/         # Registration page
│   ├── components/           # Reusable React components
│   ├── contexts/            # React Context providers
│   ├── entities/            # Data models and schemas
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Database connection
│   ├── middleware/          # Authentication middleware
│   └── utils/               # Utility functions
├── public/                  # Static assets
├── docs/                   # Documentation files
└── package.json           # Dependencies and scripts
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### Subscriptions
- `GET /api/subscriptions` - Get user subscriptions
- `POST /api/subscriptions` - Create new subscription
- `PUT /api/subscriptions/[id]` - Update subscription
- `DELETE /api/subscriptions/[id]` - Delete subscription

### Categories
- `GET /api/categories` - Get available categories

### Data
- `GET /api/data` - Get user data with calculations
- `POST /api/init` - Initialize user data

## 🔧 Key Features Implementation

### Real-time Currency Conversion
- Fetches live exchange rates from ExchangeRate-API
- 5-minute caching to reduce API calls
- Fallback rates for offline functionality
- Support for 160+ currencies

### Shared Subscriptions
- Track how many people share a subscription
- Automatic cost-per-person calculation
- Visual indicators for shared subscriptions

### Advanced Analytics
- Interactive charts using Recharts
- Spending trends over time
- Category-wise breakdown
- Cost analysis and insights

### PWA Capabilities
- Service worker for offline functionality
- App manifest for installability
- Caching strategies for optimal performance
- Mobile-optimized interface

## 🎨 UI/UX Features

- **Modern Design**: Clean, intuitive interface with Tailwind CSS
- **Responsive Layout**: Works seamlessly on all device sizes
- **Dark Mode Ready**: Infrastructure for theme switching
- **Accessibility**: Keyboard navigation and screen reader support
- **Loading States**: Smooth loading animations and transitions

## 📱 Mobile Experience

- **PWA Installation**: Add to home screen on mobile devices
- **Touch Optimized**: Swipe gestures and touch-friendly controls
- **Offline Support**: Continue using the app without internet
- **Fast Loading**: Optimized for mobile performance

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Client and server-side validation
- **CORS Protection**: Proper CORS configuration


## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run init-db      # Initialize database with sample data
```

### Development Guidelines

1. **Code Style**: Follow ESLint configuration
2. **Components**: Use functional components with hooks
3. **State Management**: Use React Context for global state
4. **API Routes**: Follow RESTful conventions
5. **Error Handling**: Implement proper error boundaries
6. **Testing**: Write unit tests for utility functions

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `EXCHANGE_RATE_API_KEY` | API key for currency conversion | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check MongoDB is running
mongod --version

# Verify connection string
echo $MONGODB_URI
```

**Currency API Issues**
- Verify API key is valid
- Check API rate limits
- Ensure internet connection

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Performance Optimization

- Enable MongoDB indexes for frequently queried fields
- Implement Redis caching for currency rates
- Use Next.js Image optimization
- Enable compression middleware

## 📚 Documentation

Additional documentation is available in the `/docs` folder:
- `AUTHENTICATION_SETUP.md` - Authentication setup guide
- `SUGGESTIONS.md` - Feature suggestions and roadmap
- `UTILS_README.md` - Utility functions documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [ExchangeRate-API](https://exchangerate-api.com/) for real-time currency data
- [Recharts](https://recharts.org/) for beautiful data visualization
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Next.js](https://nextjs.org/) for the amazing React framework
- [MongoDB](https://www.mongodb.com/) for the flexible database solution
