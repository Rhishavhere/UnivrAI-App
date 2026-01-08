<p align="center">
  <img src="https://img.shields.io/badge/UnivrAI-Smart%20Campus%20Assistant-6C63FF?style=for-the-badge&logo=sparkles&logoColor=white" alt="UnivrAI Banner"/>
</p>

<h1 align="center">🎓 UnivrAI</h1>

<p align="center">
  <em>Your AI-powered campus companion that speaks, listens, and helps.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Capacitor-7.4-119EFF?style=flat-square&logo=capacitor&logoColor=white" alt="Capacitor"/>
  <img src="https://img.shields.io/badge/Gemini%20AI-Powered-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini AI"/>
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-brightgreen?style=flat-square" alt="Platform"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License"/>
</p>

---

## ✨ Overview

**UnivrAI** is a next-generation smart campus assistant that transforms the way students interact with their university. Powered by Google's Gemini AI, it offers natural voice conversations, instant class schedules, campus navigation, and even emergency SOS alerts—all wrapped in a stunning, aurora-themed UI.

<br/>

## 🚀 Features

### 🎤 **Voice-First Experience**
- Natural speech recognition with real-time transcription
- Text-to-speech responses with beautiful animated subtitles
- Seamless keyboard fallback for quiet environments

### 🤖 **AI-Powered Conversations**
- Contextual understanding powered by Google Gemini
- Personalized responses using student profile data
- Memory of conversation history for coherent dialogues

### 📅 **Smart Class Management**
- Weekly timetable with day-wise breakdown
- Real-time class information including room locations
- Instructor details and timing at your fingertips

### 🗺️ **Campus Tour Guide**
- Virtual tour of key campus locations
- AI-guided exploration with voice descriptions
- Facility information with operating hours

### 🆘 **Emergency SOS System**
- Voice-activated emergency alerts
- Instant notification to campus security
- Backend integration with desktop alarm system

### 🎨 **Premium UI/UX**
- Mesmerizing aurora background animations
- Glassmorphism design language
- Smooth GSAP-powered transitions
- Dark mode optimized interface

<br/>

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Radix UI |
| **Animations** | GSAP, Framer Motion, Custom Aurora Shader |
| **Mobile** | Capacitor (Android & iOS native bridges) |
| **AI/ML** | Google Gemini API, Web Speech API, Edge TTS |
| **State** | React Query, Context API |
| **Build** | Vite, ESLint, PostCSS |
| **Backend** | Flask (Python) - SOS Alert Server |

<br/>

## 📦 Installation

### Prerequisites
- Node.js 18+ or Bun
- Android Studio (for Android builds)
- Xcode (for iOS builds, macOS only)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Rhishavhere/UnivrAI-App.git
cd UnivrAI-App

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
```

### Mobile Development

```bash
# Build web assets
npm run build

# Add Android platform
npx cap add android

# Sync and open in Android Studio
npx cap sync android
npx cap open android
```

<br/>

## 🔧 Configuration

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### SOS Server (Optional)

The emergency alert system requires a Python backend:

```bash
cd Server
pip install -r requirements.txt
python sos.py
```

<br/>

## 📱 Screenshots

| Voice Assistant | Chat Interface | Campus Info |
|:---:|:---:|:---:|
| Aurora-themed home with animated orbs | Clean chat UI with AI responses | Timetable & facility details |

<br/>

## 🏗️ Project Structure

```
voice-campus-pal/
├── src/
│   ├── components/      # UI components (Aurora, SplitText, etc.)
│   ├── contexts/        # Auth context & state management
│   ├── data/           # Student & campus data
│   ├── hooks/          # Custom hooks (speech recognition)
│   ├── pages/          # Route pages (Home, Chat, Info, Tour)
│   └── utils/          # Gemini API, TTS, alert utilities
├── Server/             # Flask SOS backend
├── android/            # Native Android project
└── public/            # Static assets
```

<br/>

## 🎯 Key Integrations

### Google Gemini AI
UnivrAI uses Gemini for understanding natural language queries and generating contextual, helpful responses tailored to each student's profile.

### Web Speech API
Native browser speech recognition provides real-time voice input, with graceful fallbacks for unsupported browsers.

### Edge TTS
High-quality text-to-speech synthesis brings the AI assistant's responses to life with natural-sounding voices.

### Capacitor
Bridges web technologies to native mobile platforms, enabling features like native speech recognition and notifications on Android/iOS.

<br/>


