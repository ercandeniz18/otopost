import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config.js';
import { rateLimit } from 'express-rate-limit';
import axios from 'axios';

// Type definitions
interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  picture?: string;
  verified: boolean;
  googleId?: string;
}

const app = express();
const router = express.Router();
const PORT = config.PORT;

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Vite's default port
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

// In-memory user store (replace with database in production)
const users: { [key: string]: User } = {};

// Password strength validation
const isPasswordStrong = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};

// Route handlers
const signupHandler = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    console.log('Signup request received:', req.body);
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // Check if user already exists
    if (Object.values(users).some(user => user.email === email)) {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }

    // Validate password strength
    if (!isPasswordStrong(password)) {
      res.status(400).json({
        message: 'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters'
      });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userId = uuidv4();
    users[userId] = {
      id: userId,
      email,
      password: hashedPassword,
      name: username,
      verified: true, // Auto-verify for testing
    };

    // Generate JWT
    const token = jwt.sign(
      { id: userId, email },
      config.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('User created successfully:', { userId, email, username });
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: userId,
        email,
        name: username,
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginHandler = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Missing email or password' });
      return;
    }

    // Find user
    const userId = Object.keys(users).find(id => users[id].email === email);
    if (!userId) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const user = users[userId];

    // Verify password
    if (!user.password) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Login successful:', { userId: user.id, email: user.email });
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Google OAuth callback handler
const googleCallbackHandler = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    console.log('Received Google OAuth callback request');
    const { code, client_id, client_secret, redirect_uri } = req.body;

    if (!code || !client_id || !client_secret || !redirect_uri) {
      console.error('Missing required parameters:', { code: !!code, client_id: !!client_id, client_secret: !!client_secret, redirect_uri: !!redirect_uri });
      res.status(400).json({ message: 'Missing required parameters' });
      return;
    }

    console.log('Exchanging code for tokens...');
    // Exchange code for tokens
    let tokenResponse;
    try {
      tokenResponse = await axios.post<GoogleTokenResponse>('https://oauth2.googleapis.com/token', {
        code,
        client_id,
        client_secret,
        redirect_uri,
        grant_type: 'authorization_code'
      });
    } catch (error) {
      console.error('Token exchange error:', error instanceof Error ? error.message : 'Unknown error');
      throw new Error('Failed to exchange code for tokens');
    }

    const { access_token } = tokenResponse.data;

    console.log('Fetching user info from Google...');
    // Get user info from Google
    let userInfoResponse;
    try {
      userInfoResponse = await axios.get<GoogleUserInfo>('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
    } catch (error) {
      console.error('User info fetch error:', error instanceof Error ? error.message : 'Unknown error');
      throw new Error('Failed to fetch user information');
    }

    const { email, name, picture, id: googleId } = userInfoResponse.data;

    // Check if user exists
    let userId = Object.keys(users).find(id => users[id].email === email);
    let user = userId ? users[userId] : null;

    if (!user) {
      console.log('Creating new user for Google account:', email);
      // Create new user
      userId = uuidv4();
      users[userId] = {
        id: userId,
        email,
        name,
        picture,
        verified: true,
        googleId
      };
      user = users[userId];
    } else {
      console.log('Found existing user:', email);
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Authentication successful for user:', email);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to authenticate with Google';
    res.status(500).json({ message: errorMessage });
  }
};

// Routes
router.post('/auth/signup', signupHandler);
router.post('/auth/login', loginHandler);
router.post('/auth/google/callback', googleCallbackHandler);

// Apply routes
app.use('/api', router);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for origin: ${corsOptions.origin}`);
}); 