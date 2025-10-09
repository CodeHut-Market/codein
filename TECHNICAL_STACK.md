# 🚀 CodeIn Platform - Complete Technical Stack & Features

## 📋 Project Overview

**CodeIn** is a comprehensive code snippet sharing and marketplace platform where developers can:
- Upload, share, and sell code snippets
- Discover and purchase code from other developers
- Collaborate and learn from the community
- Monetize their coding expertise

---

## 🛠️ Technical Stack

### Frontend Technologies

#### Core Framework
- **Next.js 14.2.33** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **React Router DOM 7.9.1** - Client-side routing (for legacy SPA pages)

#### Styling & UI
- **Tailwind CSS 3** - Utility-first CSS framework
- **Radix UI** - Headless UI component library
  - Avatar, Checkbox, Context Menu, Dialog, Dropdown Menu
  - Hover Card, Label, Menubar, Popover, Progress
  - Scroll Area, Select, Separator, Slider, Slot
  - Switch, Tabs, Tooltip
- **shadcn/ui** - Pre-built component library
- **Lucide React** - Icon library
- **Framer Motion** - Animation library
- **Class Variance Authority (CVA)** - CSS class management
- **clsx & tailwind-merge** - Class name utilities
- **next-themes** - Dark mode support

#### Code Display & Syntax
- **PrismJS** - Syntax highlighting
- **React Syntax Highlighter** - Code highlighting component
- Support for **50+ programming languages**

#### 3D Graphics & Visualization
- **Three.js** - 3D rendering
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for Three.js

#### Charts & Analytics
- **Chart.js** - Chart library
- **react-chartjs-2** - React wrapper for Chart.js
- **Recharts** - Declarative chart library

### Backend Technologies

#### Server & API
- **Express 5.1.0** - Web server framework
- **Next.js API Routes** - Serverless functions
- **CORS** - Cross-origin resource sharing

#### Database & Storage
- **Supabase** - Backend as a Service (BaaS)
  - PostgreSQL database
  - Row Level Security (RLS)
  - Real-time subscriptions
  - File storage
- **pg (node-postgres)** - PostgreSQL client
- **@supabase/supabase-js 2.58.0** - Supabase SDK

#### Authentication & Security
- **Supabase Auth** - Authentication service
- **bcryptjs** - Password hashing
- **OAuth 2.0** - Social login
  - Google OAuth integration
  - GitHub OAuth integration
- **JWT** - Token-based authentication

### State Management & Data Fetching
- **@tanstack/react-query 5.90.2** - Server state management
- **React Context API** - Global state management

### Form Handling
- **React Hook Form 7.63.0** - Form library
- **@hookform/resolvers** - Validation resolvers
- **Zod 4.1.11** - Schema validation

### Utilities
- **date-fns 4.1.0** - Date manipulation
- **dotenv** - Environment variables

### Development Tools
- **TypeScript** - Type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Autoprefixer** - CSS vendor prefixes
- **PostCSS** - CSS processing

---

## 🎯 Core Features

### 1. 🔐 Authentication System

#### Supported Methods
- **Email/Password** - Traditional authentication
- **Google OAuth** - One-click sign-in with Google
- **GitHub OAuth** - Developer-friendly authentication
- **Session Management** - Persistent login sessions

#### Security Features
- Password hashing with bcryptjs
- JWT token-based authentication
- Row Level Security (RLS) in Supabase
- Secure OAuth flows
- Environment variable protection

### 2. 📤 Advanced Upload System

#### Upload Modes
- **Simple Mode** - Traditional form-based upload
- **Advanced Mode** - Drag-and-drop with intelligent detection

#### Intelligent Features
- **Language Auto-Detection** - Detects language from file extension
- **Framework Detection** - Identifies React, Vue, Angular, Django, Flask, Express, Next.js
- **Tag Extraction** - Auto-suggests tags from code analysis
- **XSS Prevention** - Security checks for web languages
- **File Validation** - Size and format validation

#### Supported Languages (50+)
- JavaScript (.js, .jsx, .mjs)
- TypeScript (.ts, .tsx)
- Python (.py)
- Java (.java)
- C++ (.cpp, .cc, .cxx)
- C (.c, .h)
- C# (.cs)
- HTML (.html, .htm)
- CSS (.css, .scss, .sass, .less)
- SQL (.sql)
- JSON, XML, YAML
- Rust, Go, PHP, Ruby
- Swift, Kotlin
- And 35+ more languages

#### Upload Features
- Drag & drop file upload
- Paste code directly (Ctrl+V)
- Code preview before upload
- Syntax validation
- Title & description management
- Tag management (up to 10 tags)
- Visibility options (Public, Private, Unlisted)
- Price setting (Free or Paid)
- File size limit: 5MB per file
- Code limit: 500KB maximum

### 3. 🔍 Explore & Discovery

#### Search Capabilities
- Text search across title, description, tags
- Language filtering
- Category filtering
- Framework filtering
- Tag-based search
- Sort options: Trending, Recent, Popular, Most Downloaded

#### Display Features
- Grid layout with snippet cards
- Syntax-highlighted code previews
- Author information
- Rating and download counts
- Like and bookmark functionality

### 4. 👤 User Profiles & Dashboard

#### Profile Features
- User avatar and bio
- Coding preferences
- Portfolio showcase
- Activity feed
- Total snippets count
- Total downloads count
- User rating

#### Dashboard Features
- Personal snippets management
- Upload history
- Download statistics
- Favorites collection
- Transaction history
- Analytics and insights

### 5. 💰 Marketplace & Monetization

#### Payment Features
- **Razorpay Integration** - Payment processing
- Price setting for snippets
- Free and paid snippets
- Transaction tracking
- Earnings dashboard
- Purchase history

#### Pricing Options
- Free snippets (₹0)
- Paid snippets (custom pricing)
- Minimum price: ₹0.50
- Secure payment gateway

### 6. 📊 Code Snippet Management

#### Snippet Features
- **CRUD Operations** - Create, Read, Update, Delete
- **Version Control** - Track updates
- **Statistics Tracking**
  - View count
  - Download count
  - Like count
  - Comment count
- **Access Control**
  - Public visibility
  - Private visibility
  - Unlisted (link-only access)
- **Content Moderation**
  - Verification status (Pending, Verified, Rejected)
  - Featured snippets
  - Plagiarism detection

#### Code Display
- Syntax highlighting with PrismJS
- Copy-to-clipboard functionality
- Line numbers
- Code folding
- Download as file
- Full-screen view

### 7. 🤝 Social Features

#### Community Interaction
- **Comments System** - Discussion on snippets
- **Likes** - Appreciation system
- **Favorites** - Save for later
- **Bookmarks** - Personal collections
- **Sharing** - Social media integration
- **Following** - Follow other developers

#### Engagement Tracking
- View tracking
- Download tracking
- Like tracking
- Comment tracking
- Favorite tracking

### 8. 🔔 Real-time Features

#### Live Updates
- Real-time comment updates
- Live view count updates
- Real-time notifications
- Activity feed updates

### 9. 🛡️ Security Features

#### Data Protection
- Row Level Security (RLS)
- Secure authentication flows
- Environment variable encryption
- XSS prevention
- SQL injection prevention
- CSRF protection

#### Privacy Controls
- Public/Private snippet visibility
- Unlisted snippet access
- User data protection
- Secure payment processing

### 10. 📱 Responsive Design

#### Device Support
- Desktop (Full features)
- Tablet (Optimized layout)
- Mobile (Touch-optimized)
- Progressive Web App (PWA) ready

#### Browser Support
- Chrome 90+ (Full support)
- Firefox 88+ (Full support)
- Safari 14+ (Full support)
- Edge 90+ (Full support)
- Mobile browsers (Limited drag & drop)

### 11. 🎨 UI/UX Features

#### Design System
- Modern glassmorphism design
- Smooth animations with Framer Motion
- Hover effects and transitions
- Loading states and skeletons
- Toast notifications (Sonner)
- Error boundaries
- Empty states

#### Theme Support
- Light mode
- Dark mode
- System preference detection
- Custom color schemes

### 12. 📈 Analytics & Insights

#### User Analytics
- Upload statistics
- Download statistics
- View statistics
- Earnings analytics
- Popular snippets
- Trending languages

#### Platform Analytics
- Total users
- Total snippets
- Total downloads
- Revenue tracking
- Popular categories
- Language distribution

### 13. 🔗 API Integration

#### Internal APIs
- `/api/snippets` - Snippet management
- `/api/snippets/explore` - Public snippets
- `/api/snippets/my-snippets` - User snippets
- `/api/auth/*` - Authentication endpoints
- `/api/payments/*` - Payment processing

#### External APIs
- **Supabase API** - Database operations
- **Razorpay API** - Payment processing
- **Google OAuth API** - Social login
- **GitHub OAuth API** - Developer login
- **OpenRouter API** - AI features (optional)
- **LangSearch API** - Plagiarism detection (optional)

### 14. 📝 Content Management

#### Snippet Fields
- Title (3-100 characters)
- Description (max 1000 characters)
- Code (10 chars - 500KB)
- Language (auto-detected)
- Framework (auto-detected)
- Tags (up to 10)
- Category (predefined)
- Price (₹0+)
- Visibility (Public/Private/Unlisted)
- Allow comments (Yes/No)

#### Validation Rules
- Title length validation
- Code length validation
- XSS prevention for web languages
- File size limits
- Input sanitization

### 15. 🌐 Additional Features

#### Documentation
- Comprehensive setup guides
- API documentation
- Troubleshooting guides
- Quick reference checklists

#### Legal & Compliance
- Terms of Service
- Privacy Policy
- Cookie Policy
- DMCA Policy
- Security Policy
- Accessibility Statement

#### Support Pages
- Help Center
- FAQ
- Contact Support
- Status Page
- Community Guidelines

---

## 🗂️ Database Schema

### Main Tables

#### 1. **users** (via Supabase Auth)
- id (UUID)
- email
- username
- avatar_url
- created_at
- updated_at

#### 2. **user_profiles**
- id (UUID)
- user_id (FK)
- bio
- coding_preferences
- total_snippets
- total_downloads
- rating
- created_at
- updated_at

#### 3. **code_snippets**
- id (UUID)
- title
- description
- code
- language
- framework
- category
- tags (array)
- price
- author_id (FK)
- visibility
- allow_comments
- featured
- verification_status
- views
- downloads
- likes
- created_at
- updated_at

#### 4. **comments**
- id (UUID)
- snippet_id (FK)
- user_id (FK)
- comment_text
- created_at
- updated_at

#### 5. **favorites**
- id (UUID)
- snippet_id (FK)
- user_id (FK)
- created_at

#### 6. **likes**
- id (UUID)
- snippet_id (FK)
- user_id (FK)
- created_at

#### 7. **downloads**
- id (UUID)
- snippet_id (FK)
- user_id (FK)
- downloaded_at

#### 8. **transactions**
- id (UUID)
- buyer_id (FK)
- seller_id (FK)
- snippet_id (FK)
- amount
- currency
- payment_status
- payment_method
- created_at

---

## 🔧 Environment Configuration

### Required Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google OAuth
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your-google-client-id
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=your-google-client-secret

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Payment Gateway
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Optional APIs
LANGSEARCH_API_KEY=your-langsearch-key
OPENROUTER_API_KEY=your-openrouter-key

# Server Settings
PORT=3000
NODE_ENV=development
```

---

## 📦 Project Structure

```
codein-1/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   ├── auth/                 # Auth pages (callback, login, signup)
│   ├── components/           # Shared components
│   ├── dashboard/            # Dashboard pages
│   ├── explore/              # Explore/browse page
│   ├── profile/              # User profiles
│   ├── snippet/              # Snippet detail pages
│   ├── upload/               # Upload page
│   ├── lib/                  # Utilities and helpers
│   └── contexts/             # React contexts
├── client/                   # Legacy SPA components
│   ├── components/           # UI components
│   ├── contexts/             # Auth and other contexts
│   └── pages/                # SPA pages
├── components/               # Shared component library
├── contexts/                 # Shared contexts
├── hooks/                    # Custom React hooks
├── lib/                      # Shared utilities
├── public/                   # Static assets
├── server/                   # Express server
│   ├── controllers/          # Route controllers
│   ├── routes/               # API routes
│   └── services/             # Business logic
├── shared/                   # Shared types and interfaces
├── supabase/                 # Supabase config and migrations
│   ├── config.toml           # Supabase configuration
│   └── migrations/           # Database migrations
└── docs/                     # Documentation
```

---

## 🚀 Deployment

### Supported Platforms
- **Vercel** - Recommended for Next.js
- **Netlify** - Alternative deployment
- **Self-hosted** - Node.js server
- **Docker** - Containerized deployment

### Deployment Configuration
- **Domain**: codehutcode.vercel.app
- **Database**: Supabase Cloud
- **CDN**: Automatic via Vercel/Netlify
- **SSL**: Automatic HTTPS

---

## 📊 Performance Features

- **Code Splitting** - Dynamic imports for faster load
- **Image Optimization** - Next.js Image component
- **Lazy Loading** - Component-level lazy loading
- **Caching** - React Query caching
- **CDN** - Static asset delivery
- **SSR/SSG** - Server-side rendering where applicable

---

## 🎓 Key Innovations

1. **Intelligent Code Detection** - Auto-detects language, framework, and suggests tags
2. **Dual Upload Modes** - Simple and advanced upload options
3. **Marketplace Integration** - Built-in payment and monetization
4. **Real-time Collaboration** - Live updates and notifications
5. **Comprehensive Security** - Multi-layer security approach
6. **Developer-First Design** - Built by developers, for developers

---

## 📝 Summary

**CodeIn** is a full-stack, production-ready code snippet marketplace built with:
- Modern web technologies (Next.js, React, TypeScript)
- Secure authentication (OAuth + JWT)
- Scalable database (Supabase PostgreSQL)
- Payment integration (Razorpay)
- Real-time features (Supabase Realtime)
- Comprehensive UI/UX (Tailwind + Radix UI)
- 50+ language support
- Advanced upload system with AI-powered detection
- Complete marketplace functionality

**Total Lines of Code**: ~50,000+ lines
**Total Dependencies**: 60+
**Supported Languages**: 50+
**Features**: 100+

---

**Copyright © 2025 CodeIn Platform - All Rights Reserved**
