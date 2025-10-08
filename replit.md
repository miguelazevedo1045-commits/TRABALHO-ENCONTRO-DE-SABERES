# AI Language Quiz

## Overview

AI Language Quiz is an interactive language learning application inspired by Duolingo. It generates an endless stream of AI-powered quiz questions for various languages (English, Spanish, French, German, Portuguese) and topics (Grammar, Writing). The application provides instant feedback and explanations to help users learn effectively.

The app uses Google's Gemini AI to dynamically generate quiz questions, ensuring fresh and relevant content for each learning session. It's built as a single-page application with a clean, modern interface supporting both light and dark modes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 19.2.0 with TypeScript for type safety
- Vite 6.2.0 as the build tool and development server
- React JSX transform for modern component syntax
- TailwindCSS via CDN for utility-first styling

**Component Structure**
- **App.tsx**: Root component managing quiz state (language, topic, started/not started)
- **LanguageSelector**: Initial screen for selecting language and topic
- **Quiz**: Main quiz interface displaying questions, handling answers, and showing feedback
- **Loader**: Reusable loading spinner component

**State Management**
- Local React state using useState hooks
- No external state management library (Redux, Zustand, etc.)
- Simple parent-to-child prop passing for data flow

**Routing**
- No routing library used
- Conditional rendering based on quiz state (isStarted flag)

### AI Integration

**Gemini AI Service**
- Uses Google GenAI SDK (@google/genai v1.22.0)
- Model: gemini-2.5-flash for question generation
- Structured output with JSON schema validation
- Temperature: 0.8 for creative but controlled responses

**Question Generation**
- Dynamic prompts based on selected language and topic
- Structured schema ensures consistent question format:
  - question: Quiz question in target language
  - options: Array of 4 possible answers
  - correctAnswer: Exact correct answer from options
  - explanation: Portuguese explanation for incorrect answers

**Error Handling**
- API key validation on service initialization
- Try-catch blocks for API calls with user-friendly error messages
- Loading states during question generation

### Data Models

**TypeScript Types** (types.ts)
- Language enum: English, Spanish, French, German, Portuguese (Portuguese names)
- Topic enum: Grammar, Writing (Portuguese names)
- QuizQuestion interface: question, options, correctAnswer, explanation
- LanguageOption interface: id, name, flag

**Constants** (constants.ts)
- LANGUAGES array: Language options with flags
- TOPICS array: Topic options with icons

### Environment Configuration

**API Key Management**
- GEMINI_API_KEY stored in .env.local
- Vite config maps to process.env.API_KEY and process.env.GEMINI_API_KEY
- Environment variables loaded via Vite's loadEnv

**Development Server**
- Port: 5000
- Host: 0.0.0.0 (accessible externally)
- HMR client port: 443 for proper hot module replacement

### Styling & UI

**Design System**
- Slate color palette for dark/light themes
- Responsive grid layouts (mobile-first approach)
- Animations: fade-in effects, scale transitions, spin loader
- Accessibility: Semantic HTML, proper button states

**Theme Support**
- Dark mode using Tailwind's dark: prefix
- System-level theme detection via CSS classes

## External Dependencies

### AI Services
- **Google Gemini API**: Core AI service for question generation
  - Requires GEMINI_API_KEY environment variable
  - Model: gemini-2.5-flash
  - Response format: JSON with schema validation

### Package Dependencies
- **@google/genai** (^1.22.0): Official Google Generative AI SDK
- **react** (^19.2.0): UI library
- **react-dom** (^19.2.0): React DOM rendering
- **vite** (^6.2.0): Build tool and dev server
- **@vitejs/plugin-react** (^5.0.0): Vite React plugin
- **typescript** (~5.8.2): Type checking
- **@types/node** (^22.14.0): Node.js type definitions

### CDN Resources
- **TailwindCSS**: Loaded via CDN in index.html
- **Import Maps**: ES module resolution for React and Gemini SDK via aistudiocdn.com

### Deployment Platform
- Designed for AI Studio deployment
- App URL: https://ai.studio/apps/drive/1R5MIMiJldMOJ1--yyQZVFXYpQeorEF7R

### Browser APIs
- DOM manipulation via React
- No localStorage, sessionStorage, or other browser storage used
- No service workers or PWA features