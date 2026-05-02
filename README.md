# Financial Data Automation

Modern web application for automating financial data processes with a React frontend and Node.js/Express backend.

## Features

- 🔐 User authentication with JWT
- 📊 Financial data automation
- 📧 Email notifications via Nodemailer
- 📱 SMS notifications via Twilio
- 🎨 Modern UI with Tailwind CSS
- ⚡ Real-time updates with React Hot Toast
- 🛡️ Rate limiting for API security

## Tech Stack

### Frontend
- React 18.3.1
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React Icons

### Backend
- Node.js
- Express 5.1.0
- TypeScript
- JWT Authentication
- Bcrypt for password hashing
- Axios for HTTP requests
- CORS enabled

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd financial-data-automation
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your environment variables:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
DATABASE_URL=your-database-url
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### Development

Run the development server:
```bash
# Start the frontend
npm run dev

# Start the backend server (in another terminal)
npm run server
```

### Build

Build for production:
```bash
npm run build
```

### Production

Start the production server:
```bash
npm start
```

## Available Scripts

- `npm run dev` - Start Vite development server
- `npm run server` - Start the backend server with ts-node
- `npm run build` - Build TypeScript and Vite for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm start` - Start the production server

## Project Structure

```
financial-data-automation/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React context providers
│   ├── pages/          # Page components
│   ├── server/         # Backend server code
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main App component
│   ├── config.ts       # Configuration
│   ├── index.css       # Global styles
│   └── main.tsx        # Entry point
├── .env                # Environment variables
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## License

Private - All rights reserved

## Version

0.1.0
