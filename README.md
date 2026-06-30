<div align="center">

<!-- ████████████████████████████████████████████████████ -->
<!--                    ANIMATED BANNER                   -->
<!-- ████████████████████████████████████████████████████ -->

<img src="./assets/banner.svg" alt="StudyBazar — The Student Marketplace" width="100%" style="border-radius:12px"/>

<br/>

<!-- Animated Typing Headline -->
[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=24&duration=2800&pause=900&color=FF6B00&center=true&vCenter=true&multiline=false&width=700&height=60&lines=Buy+%7C+Sell+%7C+Share+Study+Resources+%F0%9F%93%9A;Student-First+Marketplace+%F0%9F%8E%93;Built+with+Next.js+19+%E2%9A%A1;Powered+by+Redux+%2B+JWT+Auth+%F0%9F%94%90;Designed+for+every+campus+%F0%9F%8F%AB)](https://git.io/typing-svg)

<br/>

<!-- ──────────── PRIMARY BADGE ROW ──────────── -->

![Next.js](https://img.shields.io/badge/Next.js-16.2.6-FF6B00?style=for-the-badge&logo=nextdotjs&logoColor=FF6B00&labelColor=0D0D0D)
![React](https://img.shields.io/badge/React-19.2.4-FF7A1A?style=for-the-badge&logo=react&logoColor=61DAFB&labelColor=0D0D0D)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.12-FF8C42?style=for-the-badge&logo=redux&logoColor=764ABC&labelColor=0D0D0D)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-FF6B00?style=for-the-badge&logo=tailwindcss&logoColor=06B6D4&labelColor=0D0D0D)

<br/>

![Status](https://img.shields.io/badge/Status-Active_Development-FF6B00?style=flat-square&labelColor=141414)
![License](https://img.shields.io/badge/License-MIT-FF8C42?style=flat-square&labelColor=141414)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-FF6B00?style=flat-square&labelColor=141414)
![Platform](https://img.shields.io/badge/Platform-Web_%7C_Mobile_PWA-FF7A1A?style=flat-square&labelColor=141414)
![Language](https://img.shields.io/badge/Language-JavaScript-FF8C42?style=flat-square&logo=javascript&labelColor=141414)
![Made with ❤️](https://img.shields.io/badge/Made_with-❤️_for_Students-FF6B00?style=flat-square&labelColor=141414)

</div>

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--                   TABLE OF CONTENTS                  -->
<!-- ████████████████████████████████████████████████████ -->

<div align="center">

## 🗂️ Table of Contents

</div>

| # | Section | # | Section |
|---|---------|---|---------|
| 1 | [🔥 About The Project](#-about-the-project) | 9 | [🔐 Authentication Flow](#-authentication-flow) |
| 2 | [✨ Features](#-features) | 10 | [📱 Responsive Design](#-responsive-design) |
| 3 | [🛠️ Tech Stack](#️-tech-stack) | 11 | [🎨 Design System](#-design-system) |
| 4 | [📂 Project Structure](#-project-structure) | 12 | [🌐 Pages & Routes](#-pages--routes) |
| 5 | [🚀 Getting Started](#-getting-started) | 13 | [🔌 API Integration](#-api-integration) |
| 6 | [📦 Installation](#-installation) | 14 | [🤝 Contributing](#-contributing) |
| 7 | [⚙️ Configuration](#️-configuration) | 15 | [📄 License](#-license) |
| 8 | [🗃️ Redux State Management](#️-redux-state-management) | 16 | [👤 Developer](#-developer) |

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--                   ABOUT THE PROJECT                  -->
<!-- ████████████████████████████████████████████████████ -->

## 🔥 About The Project

<table>
<tr>
<td width="60%">

**StudyBazar** is a modern, full-stack web marketplace built exclusively for students. Whether you want to sell your old textbooks, buy affordable study notes, or find lost items on campus — StudyBazar is your one-stop platform.

Inspired by the hustle of campus life, StudyBazar bridges the gap between students who need resources and those who have them. Built with a sleek **matte-black** aesthetic and intuitive iOS-inspired design language, it delivers a premium app-like experience right in the browser.

> 💡 **Why StudyBazar?** Students spend thousands on textbooks and notes each semester. We make it effortless to recycle, resell, and rediscover study materials within your own campus community.

</td>
<td width="40%" align="center">

```
╔══════════════════════════════╗
║   🎓  STUDYBAZAR STATS       ║
╠══════════════════════════════╣
║  📚  Marketplace Platform    ║
║  🔐  JWT + OAuth Auth        ║
║  📱  Mobile-First Design     ║
║  ⚡  Next.js 16 + React 19   ║
║  🗃️  Redux State Mgmt        ║
║  🎨  iOS Design Language     ║
║  🌐  Railway Backend API     ║
║  🔄  Refresh Token System    ║
╚══════════════════════════════╝
```

</td>
</tr>
</table>

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--                      FEATURES                        -->
<!-- ████████████████████████████████████████████████████ -->

## ✨ Features

<div align="center">

### 🔐 Authentication & Security

</div>

| Feature | Description | Status |
|---------|-------------|--------|
| 📧 **Email & Password Login** | Secure sign-in with form validation, show/hide password, remember me | ✅ Live |
| 🔵 **Google OAuth** | One-click sign-in with Google via social button integration | ✅ Live |
| ✉️ **Email Verification** | Verify your account via email before accessing the platform | ✅ Live |
| 🔁 **Forgot Password Flow** | Request a secure reset link sent to your registered email | ✅ Live |
| 🔑 **Reset Password** | Securely reset password with token-based validation | ✅ Live |
| 🛡️ **Protected Routes** | All core pages gated behind authentication middleware | ✅ Live |
| 🔄 **Auto Token Refresh** | JWT access tokens auto-refreshed via HTTP-only refresh cookies | ✅ Live |
| 📊 **Redux Auth State** | Centralized auth state management with `@reduxjs/toolkit` | ✅ Live |

<br/>

<div align="center">

### 🛒 Marketplace & Products

</div>

| Feature | Description | Status |
|---------|-------------|--------|
| 📋 **Product Listings** | Browse all available study resources, books & notes | ✅ Live |
| 🏷️ **Condition Badges** | Color-coded badges: New, Like New, Good, Used | ✅ Live |
| 💖 **Like / Wishlist** | Heart-toggle to save favorite listings | ✅ Live |
| 💬 **Chat with Seller** | Initiate contact with sellers directly from product cards | ✅ Live |
| 🔍 **Search Bar** | Full-text search with real-time filtering | ✅ Live |
| 🎛️ **Filter Modal** | Advanced filtering by category, price range, condition | ✅ Live |
| ₹ **Indian Rupee Pricing** | All prices displayed in ₹ with `.toLocaleString()` formatting | ✅ Live |
| 📸 **Image Upload** | Product image display with graceful fallback on error | ✅ Live |
| 🖊️ **Sell / Create Listing** | Upload and publish your study resources for sale | ✅ Live |
| 📄 **Pagination** | Smooth paginated product browsing with `usePagination` hook | ✅ Live |

<br/>

<div align="center">

### 👤 User Profiles

</div>

| Feature | Description | Status |
|---------|-------------|--------|
| 🖼️ **Profile Hero** | Stunning profile banner with avatar, name, college & bio | ✅ Live |
| 📊 **Profile Stats** | Products listed, sold, followers count, and rating | ✅ Live |
| ✏️ **Edit Profile Modal** | Update name, email, phone, college, branch, year, city, bio | ✅ Live |
| 🔒 **Change Password Modal** | Securely update password from profile settings | ✅ Live |
| ❌ **Delete Account Modal** | Permanent account deletion with confirmation prompt | ✅ Live |
| 🛍️ **Products Listed** | Grid view of all active listings by the user | ✅ Live |
| 💰 **Products Sold** | History of sold items on the user's profile | ✅ Live |
| ⚙️ **Settings Section** | Centralized settings hub linked from profile | ✅ Live |

<br/>

<div align="center">

### 🧭 Navigation & UX

</div>

| Feature | Description | Status |
|---------|-------------|--------|
| 🏝️ **Floating Island Header** | macOS-inspired floating pill navigation for desktop | ✅ Live |
| 📱 **Bottom Tab Nav** | iOS-style bottom navigation bar for mobile users | ✅ Live |
| 🌫️ **Glassmorphism Header** | Frosted-glass blur backdrop with scroll-aware behavior | ✅ Live |
| 🔔 **Safe Area Support** | iPhone notch & Dynamic Island safe area padding via CSS env() | ✅ Live |
| 🌐 **Lost & Found Board** | Report and find lost campus items | ✅ Live |
| 🐛 **Debug Page** | Developer debug panel at `/debug` | ✅ Live |
| ⚡ **Memoized Components** | `React.memo` for performance-optimized profile rendering | ✅ Live |

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--                     TECH STACK                       -->
<!-- ████████████████████████████████████████████████████ -->

## 🛠️ Tech Stack

<div align="center">

### 🖥️ Frontend Framework

</div>

```
┌─────────────────────────────────────────────────────────────────────┐
│                      STUDYBAZAR TECH STACK                          │
├──────────────────┬──────────────────────────────────────────────────┤
│  ⚡ Framework    │  Next.js 16.2.6   (App Router, Server Components)│
│  ⚛  UI Library  │  React 19.2.4     (Concurrent Features, Hooks)   │
│  🗃️ State Mgmt   │  Redux Toolkit 2.12 + React-Redux 9.3           │
│  🎨 Styling     │  Tailwind CSS v4  + Custom CSS-in-JS             │
│  🔤 Typography  │  Geist Sans + Geist Mono (Next Font)             │
│  🎯 Icons       │  Lucide React 1.22 + React Icons 5.7             │
│  🔗 Routing     │  Next.js App Router (file-based routing)         │
│  🧹 Linting     │  ESLint 9 + eslint-config-next                   │
│  🔮 Compiler    │  Babel React Compiler (experimental)             │
└──────────────────┴──────────────────────────────────────────────────┘
```

<br/>

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=FF6B00)
![React](https://img.shields.io/badge/React-0D0D0D?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux_Toolkit-0D0D0D?style=for-the-badge&logo=redux&logoColor=764ABC)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-0D0D0D?style=for-the-badge&logo=tailwindcss&logoColor=06B6D4)
![JavaScript](https://img.shields.io/badge/JavaScript-0D0D0D?style=for-the-badge&logo=javascript&logoColor=F7DF1E)

</div>

<br/>

<div align="center">

### ☁️ Backend & Infrastructure

</div>

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BACKEND SERVICES                             │
├──────────────────┬──────────────────────────────────────────────────┤
│  🌐 API Host     │  Railway.app   (Cloud deployment)                │
│  🔐 Auth         │  JWT Access Tokens + HTTP-only Refresh Cookies   │
│  🔵 OAuth        │  Google OAuth 2.0 (Social Login)                 │
│  📡 API Base     │  diplomatic-mindfulness-production.railway.app   │
│  🔄 Token Mgmt   │  Auto-refresh on 401 with /auth/refresh endpoint │
│  🍪 Sessions     │  HTTP-only cookies (credentials: include)        │
└──────────────────┴──────────────────────────────────────────────────┘
```

<br/>

<div align="center">

![Railway](https://img.shields.io/badge/Railway-0D0D0D?style=for-the-badge&logo=railway&logoColor=FF6B00)
![JWT](https://img.shields.io/badge/JWT-0D0D0D?style=for-the-badge&logo=jsonwebtokens&logoColor=FF6B00)
![REST API](https://img.shields.io/badge/REST_API-0D0D0D?style=for-the-badge&logo=fastapi&logoColor=FF6B00)

</div>

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--                  PROJECT STRUCTURE                   -->
<!-- ████████████████████████████████████████████████████ -->

## 📂 Project Structure

```
studybazar/
│
├── 📁 app/                          # Next.js App Router (Pages)
│   ├── 📁 auth/                     # Authentication pages group
│   │   ├── 📁 forgot-password/      # ┌ Forgot password request
│   │   │   └── page.jsx             # │
│   │   ├── 📁 reset-password/       # ├ Reset password with token
│   │   │   └── page.jsx             # │
│   │   ├── 📁 signin/               # ├ Login (email + Google OAuth)
│   │   │   └── page.jsx             # │
│   │   ├── 📁 signup/               # ├ Registration with validation
│   │   │   └── page.jsx             # │
│   │   └── 📁 verify-email/         # └ Email verification flow
│   │       └── page.jsx             #
│   ├── 📁 debug/                    # Developer debug panel
│   │   └── page.jsx                 #
│   ├── 📁 lost-found/               # Lost & found listings
│   │   └── page.jsx                 #
│   ├── 📁 profile/                  # User profile page
│   │   └── page.jsx                 #
│   ├── 📁 search/                   # Product search results
│   │   └── page.jsx                 #
│   ├── 📁 sell/                     # Create new product listing
│   │   └── page.jsx                 #
│   ├── favicon.ico                  # App favicon
│   ├── globals.css                  # Global CSS & Tailwind imports
│   ├── layout.jsx                   # Root layout (Providers + AuthInit)
│   └── page.jsx                     # Home page (product feed)
│
├── 📁 components/                   # Reusable React components
│   ├── 📁 auth/                     # Auth-specific components
│   │   ├── AuthFooter.jsx           # Footer for auth pages
│   │   ├── AuthHeader.jsx           # Header for auth pages
│   │   ├── AuthIllustration.jsx     # Decorative illustration
│   │   ├── AuthLayout.jsx           # Auth page layout wrapper
│   │   ├── GoogleAuthButton.jsx     # Google OAuth button
│   │   ├── LoginForm.jsx            # Login form component
│   │   ├── PasswordStrength.jsx     # Password strength meter
│   │   ├── RememberMe.jsx           # Remember me checkbox
│   │   └── SignupForm.jsx           # Signup form component
│   ├── 📁 layout/                   # Layout components
│   │   └── AuthLayout.jsx           # Auth-specific layout
│   ├── 📁 profile/                  # Profile section components
│   │   ├── DeleteModal.jsx          # Delete account confirmation
│   │   ├── EditModal.jsx            # Edit profile form modal
│   │   ├── PasswordModal.jsx        # Change password modal
│   │   ├── ProfileHero.jsx          # Profile banner & avatar
│   │   ├── ProfileInfo.jsx          # Bio, college, location info
│   │   ├── ProfilePage.jsx          # Main profile page composition
│   │   ├── ProfileProducts.jsx      # User's listed products grid
│   │   └── SettingsSection.jsx      # Settings links & options
│   ├── 📁 ui/                       # Generic UI component library
│   │   ├── AuthCard.jsx             # Card wrapper for auth pages
│   │   ├── Button.jsx               # Primary + Google button variants
│   │   ├── Card.jsx                 # Generic card component
│   │   ├── Checkbox.jsx             # Custom checkbox input
│   │   ├── Divider.jsx              # Section divider (with label)
│   │   ├── Field.jsx                # Form field with label + error
│   │   ├── FilterModal.jsx          # Product filter slide-up modal
│   │   ├── FormError.jsx            # Inline form error display
│   │   ├── Heading.jsx              # Styled heading component
│   │   ├── Icons.jsx                # Eye / EyeOff icon set
│   │   ├── Input.jsx                # Custom styled text input
│   │   ├── Label.jsx                # Form label component
│   │   ├── Loader.jsx               # Loading spinner
│   │   ├── Logo.jsx                 # StudyBazar logo component
│   │   ├── Modal.jsx                # Generic modal wrapper
│   │   ├── PasswordStrength.jsx     # Password strength indicator
│   │   ├── ProductCard.jsx          # 🌟 Core product card
│   │   ├── ProductListing.jsx       # Product grid / listing view
│   │   ├── SearchBar.jsx            # Advanced search component
│   │   ├── SocialButton.jsx         # Social login button base
│   │   ├── StepIndicator.jsx        # Multi-step form progress
│   │   ├── SubText.jsx              # Muted secondary text
│   │   └── SuccessScreen.jsx        # Success state screen
│   ├── AuthInitializer.jsx          # Hydrates auth state on load
│   ├── AuthInitializer.module.css   # Auth initializer styles
│   ├── BottomTabNav.jsx             # 📱 Mobile bottom navigation
│   ├── Header.jsx                   # 🏝️ Floating island header
│   └── ProtectedRoute.jsx           # Auth guard HOC
│
├── 📁 constants/
│   └── colors.js                    # 🎨 Design token color palette
│
├── 📁 features/
│   └── 📁 auth/
│       └── authSlice.js             # Redux auth slice (accessToken)
│
├── 📁 hooks/                        # Custom React hooks
│   ├── useAuth.js                   # Auth state & actions hook
│   ├── useForgotPassword.js         # Forgot password flow hook
│   ├── useLogin.js                  # Login form logic hook
│   ├── usePagination.js             # Pagination state hook
│   └── useSignup.js                 # Signup form logic hook
│
├── 📁 lib/
│   └── fetchWithAuth.js             # 🔐 Auth-aware fetch wrapper
│
├── next.config.mjs                  # Next.js configuration
├── jsconfig.json                    # JS path aliases (@/)
├── eslint.config.mjs                # ESLint configuration
└── package.json                     # Dependencies & scripts
```

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--                  GETTING STARTED                     -->
<!-- ████████████████████████████████████████████████████ -->

## 🚀 Getting Started

### ✅ Prerequisites

Before you begin, make sure you have the following installed:

```bash
node --version      # v18.0.0 or higher (v20+ recommended)
npm --version       # v9.0.0 or higher
git --version       # Latest stable
```

> 💡 Use [nvm](https://github.com/nvm-sh/nvm) to easily manage Node.js versions.

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--                   INSTALLATION                       -->
<!-- ████████████████████████████████████████████████████ -->

## 📦 Installation

### Step 1 — Clone the Repository

```bash
git clone https://github.com/<your-username>/studybazar.git
cd studybazar
```

### Step 2 — Install Dependencies

```bash
npm install
# or with yarn
yarn install
# or with pnpm
pnpm install
```

### Step 3 — Set Up Environment Variables

```bash
cp .env.example .env.local
```

Then fill in your environment variables (see [⚙️ Configuration](#️-configuration) below).

### Step 4 — Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

### Step 5 — Build for Production

```bash
npm run build
npm run start
```

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--                   CONFIGURATION                      -->
<!-- ████████████████████████████████████████████████████ -->

## ⚙️ Configuration

### 🔧 Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# ─────────────────────────────────────────────
#  🌐  API Configuration
# ─────────────────────────────────────────────
NEXT_PUBLIC_API_BASE_URL=https://your-backend.up.railway.app

# ─────────────────────────────────────────────
#  🔵  Google OAuth (if using social login)
# ─────────────────────────────────────────────
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# ─────────────────────────────────────────────
#  🔐  JWT Configuration (Backend-side)
# ─────────────────────────────────────────────
# These are backend env vars — set them on Railway/Vercel/etc.
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### 📋 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | ✅ Yes | Base URL of your backend REST API |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | ⚠️ Optional | Google OAuth client ID for social login |
| `JWT_SECRET` | 🔒 Backend | Secret key for signing JWT access tokens |
| `JWT_REFRESH_SECRET` | 🔒 Backend | Secret key for signing refresh tokens |
| `JWT_EXPIRES_IN` | 🔒 Backend | Access token expiry duration (e.g. `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | 🔒 Backend | Refresh token expiry duration (e.g. `7d`) |

### 🧩 `next.config.mjs`

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image domains for external product images
  images: {
    domains: [
      'i.pinimg.com',
      // Add your image CDN domains here
    ],
  },
};

export default nextConfig;
```

### 🎨 Path Aliases (`jsconfig.json`)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

This allows clean imports like:
```js
import { COLORS } from "@/constants/colors";
import Header from "@/components/Header";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
```

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--               REDUX STATE MANAGEMENT                 -->
<!-- ████████████████████████████████████████████████████ -->

## 🗃️ Redux State Management

StudyBazar uses **Redux Toolkit** for centralized, predictable state management.

### 🏗️ Store Architecture

```
redux/
├── store.js              # configureStore with all reducers
├── Providers.jsx          # <Provider store={store}> wrapper
└── features/
    └── auth/
        └── authSlice.js   # Authentication state slice
```

### 📦 Auth Slice

```js
// features/auth/authSlice.js

import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,        // JWT access token (in-memory only)
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;   // Store token after login
    },
    clearAccessToken: (state) => {
      state.accessToken = null;             // Clear on logout
    },
  },
});

export const { setAccessToken, clearAccessToken } = authSlice.actions;
export default authSlice.reducer;
```

### 🔒 Security Pattern

```
┌─────────────────────────────────────────────────────────┐
│                   TOKEN STORAGE STRATEGY                │
├─────────────────────────────────────────────────────────┤
│  ACCESS TOKEN    →  Redux Store (in-memory)             │
│                     Short-lived (15 min)                │
│                     Never stored in localStorage        │
├─────────────────────────────────────────────────────────┤
│  REFRESH TOKEN   →  HTTP-only Cookie (browser)          │
│                     Long-lived (7 days)                 │
│                     Inaccessible to JavaScript          │
│                     credentials: "include" on all reqs  │
└─────────────────────────────────────────────────────────┘
```

### 🔄 Using Redux in Components

```jsx
import { useSelector, useDispatch } from "react-redux";
import { setAccessToken, clearAccessToken } from "@/features/auth/authSlice";

// Access token from state
const accessToken = useSelector((state) => state.auth.accessToken);

// Dispatch actions
const dispatch = useDispatch();
dispatch(setAccessToken(data.access_token));   // After login
dispatch(clearAccessToken());                   // On logout
```

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--                AUTHENTICATION FLOW                   -->
<!-- ████████████████████████████████████████████████████ -->

## 🔐 Authentication Flow

### 🗺️ Complete Auth Journey

```
 ┌──────────┐     ┌──────────────┐     ┌────────────────────┐
 │  User    │────▶│  /auth/signup │────▶│  Email Verification │
 │  Visits  │     │   (Register) │     │  (verify-email)    │
 └──────────┘     └──────────────┘     └────────┬───────────┘
                                                  │ Verified
                                                  ▼
 ┌──────────┐     ┌──────────────┐     ┌────────────────────┐
 │  Home    │◀────│  Redux Store │◀────│    /auth/signin    │
 │  (Feed)  │     │  accessToken │     │   (Login Page)     │
 └──────────┘     └──────────────┘     └────────────────────┘
      │
      │  Token Expired (401)?
      ▼
 ┌──────────────────────────────────────────┐
 │  fetchWithAuth() auto-refresh logic       │
 │  POST /auth/refresh (with cookie)         │
 │  → New access token → Retry request       │
 └──────────────────────────────────────────┘
```

### 🛡️ `fetchWithAuth` — The Smart Fetch Wrapper

```js
// lib/fetchWithAuth.js

export async function fetchWithAuth(url, options = {}) {
  const state = store.getState();
  const accessToken = state.auth.accessToken;

  // Attach auth headers
  const headers = {
    "Content-Type": "application/json",
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",  // Always send refresh cookie
  });

  // 401 = token expired → auto-refresh
  if (response.status === 401) {
    const refreshResponse = await fetch("/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      store.dispatch(setAccessToken(data.access_token));
      return fetchWithAuth(url, options);  // Retry original request
    }
  }

  return response;
}
```

### 🚦 Protected Routes

```jsx
// components/ProtectedRoute.jsx
// Wraps any page that requires authentication

<ProtectedRoute>
  <Header />
  <ProductListing />
  <BottomTabNav />
</ProtectedRoute>
```

### 🔑 Sign-In Flow

```
User enters email + password
          │
          ▼
    Form Validation
    ✓ Email format check
    ✓ Password ≥ 8 chars
    ✓ Required fields
          │
          ▼
    POST /auth/login
    payload: { email, password }
          │
      ┌───┴───┐
      │       │
    200 OK   4xx Error
      │       │
      │       └──▶ Display error message
      │
      ▼
  store.dispatch(setAccessToken(token))
      │
      ▼
  router.push("/")  → Home feed
```

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--                  RESPONSIVE DESIGN                   -->
<!-- ████████████████████████████████████████████████████ -->

## 📱 Responsive Design

StudyBazar is built **mobile-first** with distinct experiences for each screen size:

### 📱 Mobile Experience (< 768px)

```
┌─────────────────────────┐
│ ≡  StudyBazar           │   ← Compact logo header (fixed top)
├─────────────────────────┤
│                         │
│   🔍 Search Bar         │   ← Full-width search
│                         │
│  ┌────────┐ ┌────────┐  │
│  │Product │ │Product │  │   ← 2-column product grid
│  │  Card  │ │  Card  │  │
│  └────────┘ └────────┘  │
│                         │
├─────────────────────────┤
│  🏠  💰  ℹ️   🔍  👤  │   ← Bottom tab navigation
└─────────────────────────┘
```

**Mobile Features:**
- Fixed top header with only logo (no nav clutter)
- Bottom tab navigation with 5 icons: Home, Sell, Lost, Search, Profile
- iOS safe area inset support (`env(safe-area-inset-*)`)
- Touch-optimized button sizes (44pt minimum)
- Active haptic-style feedback via CSS transforms

### 🖥️ Desktop Experience (≥ 768px)

```
┌───────────────────────────────────────────────────────────┐
│                                                           │
│    ╔═══════════════════════════════════════════╗          │
│    ║ 📚 StudyBazar │ 🏠Home 💰Sell ℹ️Lost 🔍 👤 ║         │   ← Floating island
│    ╚═══════════════════════════════════════════╝          │
│                                                           │
│  ┌───────────────────────────────────────────────────┐   │
│  │  🔍  Search study materials...          [Filter]  │   │   ← Search bar
│  └───────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐       │
│  │ Card │  │ Card │  │ Card │  │ Card │  │ Card │       │   ← 4-5 column grid
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘       │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**Desktop Features:**
- Floating pill navigation (backdrop-blur glassmorphism)
- Shrinks slightly on scroll for a dynamic feel
- 4-column product grid
- No bottom navigation (all nav in floating header)

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--                   DESIGN SYSTEM                      -->
<!-- ████████████████████████████████████████████████████ -->

## 🎨 Design System

### 🎨 Color Palette

```js
// constants/colors.js — The StudyBazar Design Tokens

export const COLORS = {
  //  ─── Backgrounds ───
  background:   "#0A0A0A",   // 🖤  Deep matte black app background
  card:         "#141414",   // 🖤  Card surface — slightly lighter
  secondaryBg:  "#1E1E1E",   // 🖤  Secondary background panels
  inputBg:      "#1A1A1A",   // 🖤  Input & field backgrounds
  accent:       "#2A2A2A",   // 🖤  Subtle accent layer

  //  ─── Borders ───
  border:       "#2A2A2A",   // ━   Default border color
  borderFocus:  "#FFFFFF",   // ━   Focused input border
  placeholder:  "#3A3A3A",   // ━   Placeholder skeleton color

  //  ─── Text ───
  primary:      "#FFFFFF",   // ◉   Primary text (white)
  primaryHover: "#E0E0E0",   // ◎   Hover state for white text
  textPrimary:  "#FFFFFF",   // ◉   Alias: primary text
  textSecondary:"#A0A0A0",   // ◎   Secondary/muted text
  textMuted:    "#6B6B6B",   // ◌   Tertiary / hint text

  //  ─── Semantic ───
  success:      "#22C55E",   // ✅  Green: "New" condition badge
  error:        "#EF4444",   // ❌  Red: errors & liked heart icon
};
```

### 🎨 Condition Colors (Product Badges)

| Condition | Color | Hex |
|-----------|-------|-----|
| 🟢 **New** | Green | `#22C55E` |
| 🍏 **Like New** | Light Green | `#34C759` |
| 🟡 **Good** | Yellow | `#FFCC00` |
| 🟠 **Used** | Orange | `#FF9500` |

### 🖋️ Typography

```
Font Stack:
├── Display:  -apple-system, 'SF Pro Display', system-ui
├── Body:     -apple-system, 'SF Pro Text', system-ui
├── Code:     Geist Mono (Next Font)
└── UI:       Geist Sans (Next Font)

Sizes:
├── Logo:        20px / 600 weight
├── H1 (Title):  72px / 900 weight   (banner)
├── H2:          24px / 700 weight
├── H3:          18px / 600 weight
├── Body:        14-16px / 400 weight
├── Small:       11-13px / 400 weight
└── Badge:       11px / 600 weight / UPPERCASE
```

### 🎞️ Animation Tokens

```css
/* Easing curves used throughout StudyBazar */
--ease-smooth:   cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-bounce:   cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);

/* Duration scale */
--duration-fast:   150ms;
--duration-normal: 250ms;
--duration-slow:   350ms;
--duration-enter:  400ms;

/* Common transforms */
hover-lift:     translateY(-4px)
hover-scale:    scale(1.05)
active-press:   scale(0.98)
```

### 🪟 Glassmorphism Spec

```css
/* Floating Header Island */
background:        rgba(20, 20, 20, 0.85);
backdrop-filter:   blur(25px);
-webkit-backdrop-filter: blur(25px);
border:            0.5px solid rgba(255, 255, 255, 0.15);
border-radius:     30px;
box-shadow:        0 4px 20px rgba(0, 0, 0, 0.1);
```

### 🃏 Card Spec

```css
/* Product Card */
background:    #141414;
border-radius: 20px;
border:        1px solid #2A2A2A;
overflow:      hidden;
transition:    all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

/* Hover State */
transform:     translateY(-4px);
box-shadow:    0 8px 28px rgba(0, 0, 0, 0.2);
border-color:  #FFFFFF;

/* Image Zoom on Hover */
.product-image → transform: scale(1.05);
```

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--                   PAGES & ROUTES                     -->
<!-- ████████████████████████████████████████████████████ -->

## 🌐 Pages & Routes

| Route | Page | Auth | Description |
|-------|------|------|-------------|
| `/` | Home Feed | 🔒 Yes | Product listing with search, filter & bottom nav |
| `/auth/signin` | Sign In | ❌ No | Login with email/password + Google OAuth |
| `/auth/signup` | Sign Up | ❌ No | Multi-step registration with validation |
| `/auth/forgot-password` | Forgot Password | ❌ No | Request a password reset email |
| `/auth/reset-password` | Reset Password | ❌ No | Update password using reset token |
| `/auth/verify-email` | Verify Email | ❌ No | Email confirmation after signup |
| `/profile` | User Profile | 🔒 Yes | Stats, listings, settings, modals |
| `/sell` | Create Listing | 🔒 Yes | Post a new product for sale |
| `/search` | Search | 🔒 Yes | Full-text product search |
| `/lost-found` | Lost & Found | 🔒 Yes | Campus lost & found board |
| `/debug` | Debug Panel | 🔒 Yes | Developer state inspector |

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--                  API INTEGRATION                     -->
<!-- ████████████████████████████████████████████████████ -->

## 🔌 API Integration

### 🌐 Base URL

```
https://diplomatic-mindfulness-production-621b.up.railway.app
```

### 🔐 Auth Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Register new user | ❌ |
| `POST` | `/auth/login` | Login and get access token | ❌ |
| `POST` | `/auth/refresh` | Refresh access token via cookie | ❌ |
| `POST` | `/auth/logout` | Invalidate session & cookie | ✅ |
| `POST` | `/auth/forgot-password` | Send reset email | ❌ |
| `POST` | `/auth/reset-password` | Reset with token | ❌ |
| `GET` | `/auth/verify-email/:token` | Verify email address | ❌ |

### 🛒 Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/products` | Fetch all products (paginated) | ✅ |
| `GET` | `/products/:id` | Get single product details | ✅ |
| `POST` | `/products` | Create new product listing | ✅ |
| `PUT` | `/products/:id` | Update existing product | ✅ |
| `DELETE` | `/products/:id` | Delete product listing | ✅ |
| `GET` | `/products/search` | Search products by query | ✅ |

### 👤 User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/users/profile` | Get current user profile | ✅ |
| `PUT` | `/users/profile` | Update profile info | ✅ |
| `PUT` | `/users/password` | Change password | ✅ |
| `DELETE` | `/users/account` | Delete account permanently | ✅ |

### 📡 Making Authenticated Requests

```js
import { fetchWithAuth } from "@/lib/fetchWithAuth";

// Example: Fetch all products
const fetchProducts = async () => {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/products?page=1&limit=12`
  );

  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};

// Example: Create a new listing
const createListing = async (productData) => {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`,
    {
      method: "POST",
      body: JSON.stringify(productData),
    }
  );

  return response.json();
};
```

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--                  CUSTOM HOOKS                        -->
<!-- ████████████████████████████████████████████████████ -->

## 🪝 Custom Hooks

### `usePagination`

```js
// hooks/usePagination.js
// Manages pagination state for product listings

const {
  currentPage,
  totalPages,
  nextPage,
  prevPage,
  goToPage,
  paginatedData
} = usePagination(allProducts, { itemsPerPage: 12 });
```

### `useAuth`

```js
// hooks/useAuth.js
// Provides auth state & helper methods

const {
  isAuthenticated,
  user,
  login,
  logout,
  refreshToken
} = useAuth();
```

### `useLogin`

```js
// hooks/useLogin.js
// Encapsulates entire login form logic

const {
  form,
  touched,
  isLoading,
  apiError,
  handleSubmit,
  updateField,
  isFormValid
} = useLogin();
```

### `useSignup`

```js
// hooks/useSignup.js
// Multi-step signup form logic

const {
  step,
  form,
  errors,
  nextStep,
  prevStep,
  handleSubmit,
  isLoading
} = useSignup();
```

### `useForgotPassword`

```js
// hooks/useForgotPassword.js
// Forgot password form & API call

const {
  email,
  isLoading,
  isSuccess,
  error,
  handleSubmit,
  setEmail
} = useForgotPassword();
```

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--              COMPONENT DOCUMENTATION                 -->
<!-- ████████████████████████████████████████████████████ -->

## 📦 Key Components

### `<ProductCard />`

The heart of StudyBazar — displays all product details in a polished card.

```jsx
<ProductCard
  product={{
    id: "prod_123",
    title: "Data Structures & Algorithms Notes",
    description: "Handwritten notes covering all DSA topics...",
    price: 299,
    condition: "like new",        // new | like new | good | used
    seller: {
      name: "Aakash K.",
      avatar: "https://...",
      location: "IIT Campus"
    },
    image: "https://...",
    isVerified: true,
    createdAt: "2026-06-30T12:00:00Z"
  }}
  onChat={(product) => openChatModal(product)}
  onLike={(id, liked) => handleLike(id, liked)}
  onPress={(product) => router.push(`/product/${product.id}`)}
/>
```

**ProductCard Features:**
- 3:2 aspect-ratio image with zoom on hover
- Condition badge overlay (color-coded)
- Like/heart toggle button (bottom-right of image)
- Seller avatar + name + location
- Price tag with ₹ symbol
- Chat button → initiates contact
- Smooth `translateY(-4px)` hover lift

<br/>

### `<Header />`

Auto-detects device type and renders the appropriate navigation:

```jsx
// Renders floating island on desktop, compact logo on mobile
<Header />
```

**Desktop** — Floating pill with backdrop-blur, all nav links visible.
**Mobile** — Simple fixed header with just the logo (navigation in BottomTabNav).

<br/>

### `<FilterModal />`

Advanced product filtering interface:

```jsx
<FilterModal
  isOpen={isFilterOpen}
  onClose={() => setIsFilterOpen(false)}
  onApply={(filters) => applyFilters(filters)}
/>
```

**Filterable Fields:**
- Category (Books, Notes, Stationery, Electronics, etc.)
- Price range (min / max slider)
- Condition (New, Like New, Good, Used)
- Location / Campus
- Sort order (Price ↑↓, Newest, Rating)

<br/>

### `<AuthInitializer />`

Silently rehydrates auth state on page load/refresh by hitting the `/auth/refresh` endpoint:

```jsx
// Wraps entire app in layout.jsx
<Providers>
  <AuthInitializer>
    {children}
  </AuthInitializer>
</Providers>
```

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--               SCRIPTS REFERENCE                      -->
<!-- ████████████████████████████████████████████████████ -->

## 📜 Scripts Reference

```bash
# ── Development ──
npm run dev           # Start Next.js dev server on :3000 (hot reload)

# ── Production ──
npm run build         # Build optimized production bundle
npm run start         # Start production server

# ── Code Quality ──
npm run lint          # Run ESLint across the codebase

# ── Utilities ──
npm install           # Install all dependencies
npm install <pkg>     # Add new dependency
npm update            # Update all packages to latest semver
```

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--                  CONTRIBUTING                        -->
<!-- ████████████████████████████████████████████████████ -->

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

### 🔄 Contribution Workflow

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/<your-username>/studybazar.git

# 3. Create a feature branch
git checkout -b feature/amazing-new-feature

# 4. Make your changes & commit
git add .
git commit -m "feat: add amazing new feature"

# 5. Push to your fork
git push origin feature/amazing-new-feature

# 6. Open a Pull Request on GitHub
```

### 📝 Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add product wishlist` |
| `fix` | Bug fix | `fix: correct JWT refresh loop` |
| `style` | UI/CSS changes | `style: update card hover animation` |
| `refactor` | Code refactoring | `refactor: split ProductCard logic` |
| `docs` | Documentation | `docs: update README` |
| `chore` | Build/config | `chore: update dependencies` |
| `perf` | Performance | `perf: memoize profile components` |
| `test` | Testing | `test: add auth hook unit tests` |

### ✅ Pull Request Checklist

Before submitting a PR, please ensure:

- [ ] Code follows the existing style (iOS-inspired, dark theme)
- [ ] New components use the `COLORS` design tokens
- [ ] No hardcoded color values — use `constants/colors.js`
- [ ] Authentication flows use `fetchWithAuth` for API calls
- [ ] Mobile responsive (test at 375px, 768px, 1280px)
- [ ] No `console.log` statements left in production code
- [ ] New pages wrapped in `<ProtectedRoute>` if auth required

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--                   ROADMAP                            -->
<!-- ████████████████████████████████████████████████████ -->

## 🗺️ Roadmap

- [x] ✅ JWT Authentication + Google OAuth
- [x] ✅ Product listing with condition badges
- [x] ✅ User profiles with stats
- [x] ✅ Floating island desktop navigation
- [x] ✅ Mobile bottom tab navigation
- [x] ✅ Search & filter functionality
- [x] ✅ Lost & Found board
- [ ] 🚧 Real-time in-app chat (WebSocket)
- [ ] 🚧 Push notifications (FCM/PWA)
- [ ] 🚧 Product image upload (Cloudinary/S3)
- [ ] 🚧 Advanced search with Elasticsearch
- [ ] 🚧 Ratings & reviews system
- [ ] 🚧 College/campus verification (email domain)
- [ ] 🚧 Payment integration (Razorpay/UPI)
- [ ] 🚧 Admin dashboard
- [ ] 🚧 Mobile app (React Native)
- [ ] 🔮 AI-powered price suggestions
- [ ] 🔮 Smart recommendations engine

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--               FOLDER NAMING CONVENTIONS              -->
<!-- ████████████████████████████████████████████████████ -->

## 📏 Code Style & Conventions

```
📁 Files:      PascalCase for components  →  ProductCard.jsx
               camelCase for utilities    →  fetchWithAuth.js
               camelCase for hooks        →  usePagination.js

🏷️ Components: Descriptive names          →  <ProfileHero />
               Feature prefix for groups →  <ProfileProducts />

🎨 CSS:        CSS-in-JS inside jsx       →  <style jsx global>
               Module CSS where needed   →  *.module.css
               Tailwind utility classes  →  className="flex items-center"

🗃️ State:      Redux for global state     →  auth, cart, notifications
               useState for local state   →  isLoading, isOpen

🔗 Imports:    @ alias for root          →  @/components/Header
               Relative for same folder  →  ./ProfileHero
```

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--                     LICENSE                          -->
<!-- ████████████████████████████████████████████████████ -->

## 📄 License

Distributed under the **MIT License**.

```
MIT License

Copyright (c) 2026 StudyBazar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--                    DEVELOPER                         -->
<!-- ████████████████████████████████████████████████████ -->

## 👤 Developer

<div align="center">

<img src="https://avatars.githubusercontent.com/u/0?v=4" width="100" style="border-radius:50%;border:3px solid #FF6B00" alt="Developer Avatar"/>

### **Aakash Kavediya**

*Full-Stack Developer · Student Innovator · Open Source Enthusiast*

[![GitHub](https://img.shields.io/badge/GitHub-0D0D0D?style=for-the-badge&logo=github&logoColor=FF6B00)](https://github.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0D0D0D?style=for-the-badge&logo=linkedin&logoColor=0A66C2)](https://linkedin.com)
[![Email](https://img.shields.io/badge/Email-0D0D0D?style=for-the-badge&logo=gmail&logoColor=EA4335)](mailto:aakash@university.edu)

</div>

---

<br/>

<!-- ████████████████████████████████████████████████████ -->
<!--                   FOOTER                             -->
<!-- ████████████████████████████████████████████████████ -->

<div align="center">

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║       📚  StudyBazar — Knowledge Has No Price Tag           ║
║                                                              ║
║    Built with  ⚡ Next.js  ·  ⚛ React  ·  🗃️ Redux         ║
║    Styled with  🎨 Tailwind CSS  ·  🖤 Matte Black Theme     ║
║                                                              ║
║         Give this repo a ⭐ if it helped you!               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

<br/>

[![Star on GitHub](https://img.shields.io/github/stars/yourusername/studybazar?style=social)](https://github.com/yourusername/studybazar)
[![Fork on GitHub](https://img.shields.io/github/forks/yourusername/studybazar?style=social)](https://github.com/yourusername/studybazar/fork)

<br/>

*Made with* **🔥** *and lots of* **☕** *by the StudyBazar team.*

*© 2026 StudyBazar. All rights reserved.*

</div>
