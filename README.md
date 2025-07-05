# Hasitha.AI - Your Personal AI Assistant

A beautiful, intelligent AI assistant powered by Google's Gemini AI, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🤖 **Gemini AI Integration**: Chat with Google's powerful Gemini AI model
- 💬 **Real-time Chat Interface**: Beautiful, responsive chat UI with message history
- 🌙 **Dark/Light Mode**: Automatic theme switching based on system preferences
- 📱 **Mobile Responsive**: Works perfectly on all devices
- ⚡ **Fast & Modern**: Built with Next.js 15 and TypeScript
- 🎨 **Beautiful UI**: Styled with Tailwind CSS and purple/pink gradient theme
- 🧠 **Intelligent**: Your personal AI assistant for any question or task

## Setup Instructions

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key

### 2. Configure Environment Variables

1. Open the `.env.local` file in the root directory
2. Replace `your_gemini_api_key_here` with your actual API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Install Dependencies & Run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Usage

1. Open Hasitha.AI in your browser
2. Type your message in the input field at the bottom
3. Press Enter or click "Send" to send your message
4. Wait for your AI assistant to respond
5. Continue the conversation!

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # API endpoint for Gemini AI
│   ├── globals.css           # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main chat interface
└── ...
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Google Generative AI** - Gemini AI integration
- **React Hooks** - State management

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## Deployment

This app can be easily deployed to Vercel, Netlify, or any other platform that supports Next.js.

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `GEMINI_API_KEY` environment variable in Vercel settings
4. Deploy!

## About

Hasitha.AI is your personal AI assistant, designed to provide intelligent, helpful responses to any question or task. Powered by Google's advanced Gemini AI technology, it offers a beautiful and intuitive chat experience.

## License

MIT License - feel free to use this project for your own purposes.
