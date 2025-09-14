# 📊 Subscription Management App

A modern, full-stack subscription management application built with Next.js, featuring real-time currency conversion, advanced analytics, and PWA capabilities.

![Subscription Management App](https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-6.19.0-green?style=for-the-badge&logo=mongodb)

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

## 📦 Installation

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
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key
   ```

4. **Run the development server**
```bash
npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3010](http://localhost:3010)

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


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [ExchangeRate-API](https://exchangerate-api.com/) for real-time currency data
- [Recharts](https://recharts.org/) for beautiful data visualization
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Next.js](https://nextjs.org/) for the amazing React framework
