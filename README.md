<div align="center">
  <img src="public/log-removebg-preview.png" alt="Hasitha.AI Logo" width="120" height="120">
  
  # 🤖 Hasitha.AI
  ### Your Intelligent AI Assistant & Damage Detection System
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Google Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285f4?style=for-the-badge&logo=google)](https://ai.google.dev/)
  
  *A cutting-edge AI-powered web application featuring intelligent chat capabilities and advanced image-based damage detection*
</div>

---

## ✨ Features

### � **AI Chat Assistant**
- **Gemini 1.5 Flash Integration**: Powered by Google's most advanced AI model
- **Real-time Conversations**: Instant responses with streaming capabilities
- **Intelligent Context**: Maintains conversation history for better responses
- **Markdown Support**: Rich text formatting in AI responses

### 🔍 **Damage Detection System**
- **Image Analysis**: Upload photos for AI-powered damage assessment
- **Multi-damage Detection**: Identifies cracks, water damage, mold, structural issues
- **Severity Assessment**: Rates damage as Low, Medium, or High priority
- **Prevention Guidance**: Provides detailed repair and prevention instructions
- **Professional Reports**: Structured analysis suitable for documentation

### 🎨 **User Experience**
- **Dual Interface**: Seamless switching between Chat and Damage Detection modes
- **Dark/Light Theme**: Automatic theme detection with system preferences
- **Responsive Design**: Perfect experience across desktop, tablet, and mobile
- **Loading States**: Beautiful animations and feedback during processing
- **Image Preview**: Drag-and-drop image upload with instant preview

### ⚡ **Performance & Technology**
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety and enhanced developer experience
- **Tailwind CSS 4**: Modern utility-first styling
- **Server-Side API**: Secure backend processing
- **Image Processing**: Efficient base64 encoding for AI analysis

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Google AI Studio account

### 1. **Clone & Install**
```bash
git clone https://github.com/hasitha20025/AI-chat-web-app.git
cd AI-chat-web-app
npm install
```

### 2. **Get Your Gemini API Key**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your generated API key

### 3. **Environment Setup**
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 4. **Launch the Application**
```bash
# Development server
npm run dev

# Production build
npm run build
npm start
```

🌐 **Access your app at:** [http://localhost:3000](http://localhost:3000)

---

## 💡 How to Use

### 💬 **Chat Mode**
1. Select the "Chat" tab
2. Type your question or message
3. Press Enter or click "Send"
4. Receive intelligent AI responses with markdown formatting

### 🏠 **Damage Detection Mode**
1. Switch to the "Damage Detection" tab
2. Click "Choose File" or drag-and-drop an image
3. Upload photos of walls, surfaces, or structures
4. Receive detailed analysis including:
   - **Damage Type**: Specific identification (cracks, water damage, etc.)
   - **Severity Level**: Risk assessment (Low/Medium/High)
   - **Location Details**: Precise damage description
   - **Repair Instructions**: Step-by-step fix guidance
   - **Prevention Tips**: How to avoid future damage

---

## 🏗️ Project Architecture

```
📦 AI-chat-web-app/
├── 📂 public/
│   ├── 🖼️ favicon files & icons
│   └── 🎨 logo assets
├── 📂 src/
│   └── 📂 app/
│       ├── 📂 api/
│       │   ├── 📂 chat/
│       │   │   └── ⚡ route.ts         # Gemini chat API
│       │   └── 📂 analyze-damage/
│       │       └── ⚡ route.ts         # Image analysis API
│       ├── 🎨 globals.css             # Global styles
│       ├── 📄 layout.tsx              # Root layout
│       └── 🏠 page.tsx                # Main application
├── ⚙️ Configuration files
│   ├── 📝 next.config.ts
│   ├── 🎨 tailwind.config.ts
│   ├── 📋 tsconfig.json
│   └── 🔧 eslint.config.mjs
└── 📖 README.md
```

---

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | React 19 + Next.js 15 | Modern React framework with App Router |
| **Language** | TypeScript 5 | Type-safe development |
| **Styling** | Tailwind CSS 4 | Utility-first CSS framework |
| **AI Model** | Google Gemini 1.5 Flash | Advanced language understanding |
| **Image Processing** | Base64 encoding | Secure image transmission |
| **Markdown** | React Markdown | Rich text rendering |
| **Development** | ESLint + Next.js lint | Code quality and standards |

---

## 🌐 Deployment

### **Vercel (Recommended)**
1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Add environment variable: `GEMINI_API_KEY`
4. Deploy automatically!

### **Alternative Platforms**
- **Netlify**: Full Next.js support
- **Railway**: Container-based deployment  
- **DigitalOcean**: App Platform deployment
- **AWS**: Amplify or EC2 hosting

---

## 🔧 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini AI API key | ✅ Yes | `AIzaSyC...` |

---

## 🎯 Use Cases

### **For Homeowners**
- Identify structural damage before it worsens
- Get professional-grade damage assessments
- Receive repair guidance for DIY projects
- Document property conditions for insurance

### **For Professionals**
- Quick damage assessment tool
- Client consultation aid
- Property inspection documentation
- Educational damage identification

### **For General Chat**
- AI-powered assistant for any questions
- Technical support and guidance
- Creative brainstorming partner
- Learning and research companion

---

## 🔮 Future Enhancements

- [ ] **Multi-language Support**: Global accessibility
- [ ] **Voice Interface**: Speech-to-text integration
- [ ] **PDF Reports**: Downloadable damage assessments
- [ ] **Historical Tracking**: Damage progression monitoring
- [ ] **Cost Estimation**: Repair cost calculations
- [ ] **Professional Network**: Connect with local contractors
- [ ] **Mobile App**: Native iOS/Android applications

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/hasitha20025/AI-chat-web-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/hasitha20025/AI-chat-web-app/discussions)
- **Email**: [hasitha20025@gmail.com](mailto:hasitha20025@gmail.com)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p><strong>Built with ❤️ by Hasitha</strong></p>
  <p><em>Empowering intelligent conversations and smart damage detection</em></p>
  
  ⭐ **Star this repo if you found it helpful!** ⭐
</div>