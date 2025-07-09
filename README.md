# Olivia AI Chatbot

<p align="center">
  <strong>A conversational AI chatbot built for the Olivia AI coding challenge</strong>
</p>

<p align="center">
  An intelligent chatbot interface featuring dynamic AI model selection, persona customization, and seamless user experience - built with Next.js, OpenRouter, and modern AI technologies.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#getting-started"><strong>Getting Started</strong></a> ·
  <a href="#usage"><strong>Usage</strong></a> ·
  <a href="#challenge-requirements"><strong>Challenge Requirements</strong></a>
</p>

## Features

### 🤖 **Multi-Model AI Support**
- **OpenRouter Integration**: Access to multiple AI models including GPT-4, Gemini, and DeepSeek
- **Dynamic Model Switching**: Users can switch between different AI models mid-conversation
- **User-Provided API Keys**: Secure, user-controlled API key management

### 🎭 **Persona System**
- **Multiple Personalities**: Choose between different AI personas (Serious, Fun, etc.)
- **Dynamic System Prompts**: Each persona provides a unique conversational experience
- **Real-time Switching**: Change personas without losing conversation context

### 💬 **Advanced Chat Experience**
- **Streaming Responses**: Real-time message streaming for natural conversation flow
- **Persistent Chat History**: Conversations are saved and accessible across sessions
- **Anonymous Usage**: No authentication required - start chatting immediately
- **Responsive Design**: Optimized for desktop and mobile devices

### 🛠 **Developer Experience**
- **Modern Tech Stack**: Built with Next.js 15, React 19, and TypeScript
- **Component Architecture**: Modular, reusable components with shadcn/ui
- **Real-time Updates**: Hot reloading and instant feedback during development
- **Clean Code**: Well-structured, maintainable codebase

## Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features and hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern component library
- **Radix UI** - Accessible component primitives

### **Backend & AI**
- **OpenRouter** - Multi-model AI API gateway
- **Vercel AI SDK** - Streaming AI responses
- **Edge Runtime** - Fast, scalable API routes

### **Database & Storage**
- **Supabase** - PostgreSQL database and real-time features
- **Local Storage** - Client-side preferences and API key storage

### **Development Tools**
- **pnpm** - Fast, efficient package management
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting

## Getting Started

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **pnpm** - Install with `npm install -g pnpm`
- **OpenRouter API Key** - [Get yours here](https://openrouter.ai/keys)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd olivia-ai-chatbot
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### First Time Setup

1. **Enter Your API Key**: When you first open the app, you'll be prompted to enter your OpenRouter API key
2. **Choose a Model**: Select from available AI models (Gemini Flash, GPT-4 Mini, DeepSeek Chimera)
3. **Pick a Persona**: Choose between different AI personalities for your conversation
4. **Start Chatting**: Begin your conversation with Olivia!

### Key Features

- **Model Selection**: Use the dropdown at the bottom to switch between AI models
- **Persona Toggle**: Change the AI's personality style in the settings
- **Chat History**: All conversations are automatically saved and accessible
- **API Key Management**: Your API key is stored securely in your browser

## Challenge Requirements

This project was built as part of the **Olivia AI coding challenge** and demonstrates:

### ✅ **Core Functionality**
- [x] Conversational AI interface with streaming responses
- [x] Multi-model AI support through OpenRouter integration
- [x] User-provided API key management
- [x] Persistent chat history and session management

### ✅ **Technical Excellence**
- [x] Modern React/Next.js architecture with TypeScript
- [x] Responsive, accessible UI with shadcn/ui components
- [x] Clean, maintainable code structure
- [x] Proper error handling and user feedback

### ✅ **AI-Native Features**
- [x] **Agentic**: Intelligent routing between different AI models
- [x] **Conversational**: Natural language interface with context preservation
- [x] **Generative**: Dynamic content creation through AI responses

### ✅ **User Experience**
- [x] Intuitive interface requiring no technical knowledge
- [x] Immediate usability without complex setup
- [x] Smooth, responsive interactions
- [x] Professional design and user flow

## Project Structure

```
olivia-ai-chatbot/
├── app/                    # Next.js App Router
│   ├── api/chat/          # Chat API endpoint
│   ├── chat/[id]/         # Individual chat pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── chat.tsx          # Main chat interface
│   └── ...               # Other components
├── lib/                  # Utilities and types
├── supabase/            # Database migrations
└── public/              # Static assets
```

## Contributing

This project showcases modern AI application development practices:

- **Component-driven architecture** with reusable UI elements
- **Type-safe development** with comprehensive TypeScript usage
- **AI-first design** optimized for conversational interfaces
- **Performance optimization** with streaming and edge runtime
- **User-centered design** prioritizing accessibility and experience

---

**Built for the Olivia AI coding challenge** - Demonstrating expertise in AI application development, modern web technologies, and user experience design.
