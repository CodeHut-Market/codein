import { CodeSnippet, User, Purchase } from "@shared/api";

// Enhanced User interface for internal use
interface EnhancedUser extends User {
  role: "user" | "admin" | "moderator";
  lastLoginAt: string;
  isActive: boolean;
  emailVerified: boolean;
}

// Password storage (in production, use a secure database)
interface PasswordStore {
  [userId: string]: string; // hashed password
}

// Initialize password store in global scope for demo
const getPasswordStore = (): PasswordStore => {
  const globalStore: any = global as any;
  if (!globalStore.passwords) {
    globalStore.passwords = {};
  }
  return globalStore.passwords;
};

/**
 * In-memory database for demonstration purposes
 * In a real application, you would use a proper database like PostgreSQL, MongoDB, etc.
 */

// Sample users with enhanced fields
export const users: EnhancedUser[] = [
  {
    id: "user-1",
    username: "JohnDoe",
    email: "john@example.com",
    bio: "Full-stack developer with 5+ years of experience in React and Node.js",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random",
    totalSnippets: 12,
    totalDownloads: 245,
    rating: 4.8,
    role: "admin",
    lastLoginAt: "2024-03-15T10:00:00Z",
    isActive: true,
    emailVerified: true,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "user-2",
    username: "SarahK",
    email: "sarah@example.com",
    bio: "Vue.js specialist and UI/UX enthusiast",
    avatar: "https://ui-avatars.com/api/?name=Sarah+K&background=random",
    totalSnippets: 8,
    totalDownloads: 189,
    rating: 4.9,
    role: "user",
    lastLoginAt: "2024-03-14T14:30:00Z",
    isActive: true,
    emailVerified: true,
    createdAt: "2024-02-20T14:30:00Z",
  },
  {
    id: "user-3",
    username: "DevMaster",
    email: "dev@example.com",
    bio: "Backend developer specializing in APIs and microservices",
    avatar: "https://ui-avatars.com/api/?name=Dev+Master&background=random",
    totalSnippets: 15,
    totalDownloads: 312,
    rating: 4.7,
    role: "moderator",
    lastLoginAt: "2024-03-13T09:15:00Z",
    isActive: true,
    emailVerified: true,
    createdAt: "2024-01-08T09:15:00Z",
  },
  {
    id: "user-4",
    username: "CSSGuru",
    email: "css@example.com",
    bio: "CSS and design systems expert",
    avatar: "https://ui-avatars.com/api/?name=CSS+Guru&background=random",
    totalSnippets: 20,
    totalDownloads: 456,
    rating: 4.6,
    role: "user",
    lastLoginAt: "2024-03-12T16:45:00Z",
    isActive: true,
    emailVerified: true,
    createdAt: "2023-12-10T16:45:00Z",
  },
  {
    id: "user-5",
    username: "ReactPro",
    email: "react@example.com",
    bio: "React specialist with expertise in hooks and performance optimization",
    avatar: "https://ui-avatars.com/api/?name=React+Pro&background=random",
    totalSnippets: 18,
    totalDownloads: 387,
    rating: 4.8,
    role: "user",
    lastLoginAt: "2024-03-11T11:20:00Z",
    isActive: true,
    emailVerified: true,
    createdAt: "2024-01-25T11:20:00Z",
  },
  {
    id: "user-6",
    username: "JSValidator",
    email: "js@example.com",
    bio: "JavaScript developer focused on form validation and utilities",
    avatar: "https://ui-avatars.com/api/?name=JS+Validator&background=random",
    totalSnippets: 10,
    totalDownloads: 156,
    rating: 4.5,
    role: "user",
    lastLoginAt: "2024-03-10T08:30:00Z",
    isActive: true,
    emailVerified: true,
    createdAt: "2024-03-05T08:30:00Z",
  },
  {
    id: "user-admin",
    username: "AdminUser",
    email: "admin@codehut.com",
    bio: "Platform administrator managing CodeHut marketplace",
    avatar: "https://ui-avatars.com/api/?name=Admin+User&background=random",
    totalSnippets: 5,
    totalDownloads: 100,
    rating: 5.0,
    role: "admin",
    lastLoginAt: "2024-03-15T12:00:00Z",
    isActive: true,
    emailVerified: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
];

// Sample code snippets
export const codeSnippets: CodeSnippet[] = [
  {
    id: "snippet-1",
    title: "React Login Form",
    description:
      "Simple and responsive login component using React and Tailwind CSS with form validation and loading states.",
    code: `import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Login logic here
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}`,
    price: 5,
    rating: 4.8,
    author: "JohnDoe",
    authorId: "user-1",
    tags: ["React", "Form", "Authentication", "Tailwind"],
    language: "JavaScript",
    framework: "React",
    downloads: 89,
    createdAt: "2024-01-20T12:00:00Z",
    updatedAt: "2024-01-20T12:00:00Z",
  },
  {
    id: "snippet-2",
    title: "Vue Dashboard Component",
    description:
      "Complete dashboard with charts and analytics using Vue 3 and Chart.js with real-time data updates.",
    code: `<template>
  <div class="dashboard">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Revenue</h3>
        <canvas ref="revenueChart"></canvas>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Users</h3>
        <canvas ref="usersChart"></canvas>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Orders</h3>
        <canvas ref="ordersChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

const revenueChart = ref(null);
const usersChart = ref(null);
const ordersChart = ref(null);

onMounted(() => {
  // Initialize charts
  new Chart(revenueChart.value, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        label: 'Revenue',
        data: [12000, 15000, 13000, 17000, 16000],
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1
      }]
    }
  });
});
</script>`,
    price: 15,
    rating: 4.9,
    author: "SarahK",
    authorId: "user-2",
    tags: ["Vue", "Dashboard", "Charts", "Analytics"],
    language: "JavaScript",
    framework: "Vue",
    downloads: 45,
    createdAt: "2024-02-25T09:30:00Z",
    updatedAt: "2024-02-25T09:30:00Z",
  },
  {
    id: "snippet-3",
    title: "Node.js API Middleware",
    description:
      "Express middleware for authentication and rate limiting with JWT token validation and Redis support.",
    code: `const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Rate limiting middleware
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

module.exports = {
  authenticateToken,
  createRateLimit
};`,
    price: 8,
    rating: 4.7,
    author: "DevMaster",
    authorId: "user-3",
    tags: ["Node.js", "Express", "API", "Middleware", "Authentication"],
    language: "JavaScript",
    framework: "Express",
    downloads: 67,
    createdAt: "2024-03-01T14:15:00Z",
    updatedAt: "2024-03-01T14:15:00Z",
  },
  {
    id: "snippet-4",
    title: "CSS Grid Layout System",
    description:
      "Responsive grid system with modern CSS Grid and Flexbox, including auto-fit columns and gap utilities.",
    code: `.grid-container {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  padding: 1rem;
}

.grid-item {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.grid-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 0.75rem;
  }
}

@media (min-width: 1200px) {
  .grid-container {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
}

/* Utility classes */
.grid-span-2 { grid-column: span 2; }
.grid-span-3 { grid-column: span 3; }
.grid-row-span-2 { grid-row: span 2; }`,
    price: 3,
    rating: 4.6,
    author: "CSSGuru",
    authorId: "user-4",
    tags: ["CSS", "Grid", "Responsive", "Layout"],
    language: "CSS",
    downloads: 123,
    createdAt: "2024-01-10T16:20:00Z",
    updatedAt: "2024-01-10T16:20:00Z",
  },
  {
    id: "snippet-5",
    title: "React Shopping Cart",
    description:
      "Full-featured shopping cart with local storage, animations, and quantity management using React hooks.",
    code: `import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-blue-600 text-white rounded-lg"
      >
        Cart ({cartItems.length})
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Shopping Cart</h3>
              {cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty</p>
              ) : (
                <>
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center mb-2">
                      <span>{item.name}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          +
                        </button>
                        <span>\${item.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total: \${total.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}`,
    price: 12,
    rating: 4.8,
    author: "ReactPro",
    authorId: "user-5",
    tags: ["React", "E-commerce", "Cart", "LocalStorage", "Animation"],
    language: "JavaScript",
    framework: "React",
    downloads: 78,
    createdAt: "2024-02-15T11:45:00Z",
    updatedAt: "2024-02-15T11:45:00Z",
  },
  {
    id: "snippet-6",
    title: "JavaScript Form Validation",
    description:
      "Comprehensive form validation library with custom rules, error messages, and real-time validation.",
    code: `class FormValidator {
  constructor(form) {
    this.form = form;
    this.errors = {};
    this.rules = {};
    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.validateForm();
    });

    // Real-time validation
    this.form.addEventListener('blur', (e) => {
      if (e.target.matches('input, textarea, select')) {
        this.validateField(e.target);
      }
    }, true);
  }

  addRule(fieldName, rules) {
    this.rules[fieldName] = rules;
    return this;
  }

  validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const rules = this.rules[fieldName];

    if (!rules) return true;

    delete this.errors[fieldName];

    for (const rule of rules) {
      if (!rule.test(value)) {
        this.errors[fieldName] = rule.message;
        this.showError(field, rule.message);
        return false;
      }
    }

    this.clearError(field);
    return true;
  }

  validateForm() {
    let isValid = true;
    const fields = this.form.querySelectorAll('input, textarea, select');

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (isValid) {
      this.onSuccess();
    }

    return isValid;
  }

  showError(field, message) {
    this.clearError(field);
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
  }

  clearError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  onSuccess() {
    console.log('Form is valid!');
    // Handle successful form submission
  }

  // Predefined validation rules
  static rules = {
    required: {
      test: (value) => value.length > 0,
      message: 'This field is required'
    },
    email: {
      test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Please enter a valid email address'
    },
    minLength: (min) => ({
      test: (value) => value.length >= min,
      message: \`Minimum \${min} characters required\`
    }),
    password: {
      test: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(value),
      message: 'Password must contain at least 8 characters, one uppercase, one lowercase, and one number'
    }
  };
}

// Usage example:
const validator = new FormValidator(document.getElementById('myForm'))
  .addRule('email', [FormValidator.rules.required, FormValidator.rules.email])
  .addRule('password', [FormValidator.rules.required, FormValidator.rules.password])
  .addRule('name', [FormValidator.rules.required, FormValidator.rules.minLength(2)]);`,
    price: 6,
    rating: 4.5,
    author: "JSValidator",
    authorId: "user-6",
    tags: ["JavaScript", "Validation", "Forms", "Utility"],
    language: "JavaScript",
    downloads: 92,
    createdAt: "2024-03-10T13:20:00Z",
    updatedAt: "2024-03-10T13:20:00Z",
  },
];

// Sample purchases
export const purchases: Purchase[] = [
  {
    id: "purchase-1",
    userId: "user-1",
    snippetId: "snippet-2",
    price: 15,
    purchaseDate: "2024-03-01T10:30:00Z",
  },
  {
    id: "purchase-2",
    userId: "user-2",
    snippetId: "snippet-1",
    price: 5,
    purchaseDate: "2024-03-02T14:15:00Z",
  },
];

// Helper functions to simulate database operations
export const findUserById = (id: string): EnhancedUser | undefined => {
  return users.find((user) => user.id === id);
};

export const findUserByUsername = (
  username: string,
): EnhancedUser | undefined => {
  return users.find((user) => user.username === username);
};

export const findUserByEmail = (email: string): EnhancedUser | undefined => {
  return users.find((user) => user.email === email);
};

export const findSnippetById = (id: string): CodeSnippet | undefined => {
  return codeSnippets.find((snippet) => snippet.id === id);
};

export const createSnippet = (
  snippet: Omit<
    CodeSnippet,
    "id" | "createdAt" | "updatedAt" | "rating" | "downloads"
  >,
): CodeSnippet => {
  const newSnippet: CodeSnippet = {
    ...snippet,
    id: `snippet-${Date.now()}`,
    rating: 0,
    downloads: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  codeSnippets.push(newSnippet);
  return newSnippet;
};

export const createPurchase = (
  purchase: Omit<Purchase, "id" | "purchaseDate">,
): Purchase => {
  const newPurchase: Purchase = {
    ...purchase,
    id: `purchase-${Date.now()}`,
    purchaseDate: new Date().toISOString(),
  };

  purchases.push(newPurchase);
  return newPurchase;
};

// User management functions
export const addUser = (user: EnhancedUser, passwordHash: string): void => {
  users.push(user);
  const passwordStore = getPasswordStore();
  passwordStore[user.id] = passwordHash;
};

export const updateUser = (
  userId: string,
  updates: Partial<EnhancedUser>,
): EnhancedUser | null => {
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex === -1) return null;

  users[userIndex] = { ...users[userIndex], ...updates };
  return users[userIndex];
};

export const updateUserPassword = (
  userId: string,
  passwordHash: string,
): void => {
  const passwordStore = getPasswordStore();
  passwordStore[userId] = passwordHash;
};

export const getUserPassword = (userId: string): string | undefined => {
  const passwordStore = getPasswordStore();
  return passwordStore[userId];
};

import bcrypt from "bcryptjs";

// Initialize demo passwords (hashed with bcryptjs)
export const initializeDemoPasswords = (): void => {
  const passwordStore = getPasswordStore();
  // Use a single strong demo password for all non-admin demo users
  // Password: demo1234A!
  const userHash = bcrypt.hashSync("demo1234A!", 10);
  const adminHash = bcrypt.hashSync("admin1234A!", 10);

  passwordStore["user-1"] = userHash;
  passwordStore["user-2"] = userHash;
  passwordStore["user-3"] = userHash;
  passwordStore["user-4"] = userHash;
  passwordStore["user-5"] = userHash;
  passwordStore["user-6"] = userHash;
  passwordStore["user-admin"] = adminHash;
};

// Initialize demo data
initializeDemoPasswords();

export type { EnhancedUser };
