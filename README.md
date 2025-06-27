# 🧠 Thought Chat GitHub App

A GitHub App that brings **voice-enabled AI chat** directly to your repositories. Speak your thoughts and get AI responses, create issues by voice, and manage your repo through natural conversation.

## ✨ Features

### 🎤 Voice Interface
- **Speech-to-Text**: Speak naturally, get instant transcription
- **Text-to-Speech**: Hear AI responses spoken back
- **Real-time Processing**: Smooth, conversational experience
- **Multiple Voices**: Choose from available system voices

### 🤖 GitHub Integration
- **Issue Creation**: "Create an issue about improving documentation"
- **Code Reviews**: "Review pull request #42"
- **Repository Management**: "What's the status of this project?"
- **Comment Generation**: Add thoughtful comments by voice

### 🧠 AI-Powered Assistant
- **Context Aware**: Understands your repository structure
- **Multiple AI Providers**: OpenAI, Anthropic, or local models
- **Smart Responses**: Tailored to software development workflows
- **Memory**: Remembers conversation context

## 🚀 Quick Start

### 1. Install as GitHub App

[**🔗 Install Thought Chat App**](https://github.com/apps/thought-chat-interface/installations/new) on your repositories.

### 2. Use the Voice Interface

1. Visit your installed app interface
2. Click "🎤 Think & Speak" 
3. Say things like:
   - "Create an issue about adding tests"
   - "Review the latest pull request"
   - "Generate documentation for this project"
   - "What needs to be done in this repo?"

### 3. GitHub Integration

The app automatically:
- Creates issues from voice commands
- Adds comments to PRs and issues
- Provides code analysis and suggestions
- Generates documentation

## 🛠️ Self-Hosted Setup

### Prerequisites
- Node.js 16+
- GitHub account
- Optional: AI service API keys

### Step 1: Clone Repository
```bash
git clone https://github.com/protechtimenow/thought-chat-github-app.git
cd thought-chat-github-app
npm install
```

### Step 2: Create GitHub App

1. Go to [GitHub Developer Settings](https://github.com/settings/apps/new)
2. Fill in app details:
   - **App name**: `Your Thought Chat App`
   - **Homepage URL**: `https://your-domain.com`
   - **Webhook URL**: `https://your-domain.com/webhooks/github`

3. Set permissions:
   - Issues: Read & Write
   - Pull requests: Read & Write  
   - Contents: Read
   - Metadata: Read

4. Subscribe to events: Issues, Pull requests, Push, Repository

### Step 3: Configure Environment

```bash
# Run setup wizard
npm run setup-app

# Or manually copy and edit
cp .env.example .env
# Edit .env with your GitHub App credentials
```

### Step 4: Start the Server

```bash
# Development
npm run dev

# Production
npm start
```

### Step 5: Install on Repositories

1. Visit `http://localhost:3000/install`
2. Choose repositories to install on
3. Start using voice commands!

## 🎯 Voice Commands

| Command | Action |
|---------|--------|
| "Create issue about [topic]" | Creates new GitHub issue |
| "Comment on issue #[number]" | Adds comment to issue |
| "Review PR #[number]" | Starts AI code review |
| "Generate documentation" | Creates docs for project |
| "What's the status?" | Project overview |
| "Help" | Shows available commands |

## 🔧 Configuration

### Environment Variables

```bash
# GitHub App (Required)
GITHUB_APP_ID=123456
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----..."
GITHUB_WEBHOOK_SECRET=your_webhook_secret

# AI Services (Optional but recommended)
OPENAI_API_KEY=sk-your-key-here
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Server
PORT=3000
APP_URL=https://your-domain.com
```

### AI Provider Setup

The app works without AI services but is much more powerful with them:

1. **OpenAI**: Get key at [platform.openai.com](https://platform.openai.com/)
2. **Anthropic**: Get key at [console.anthropic.com](https://console.anthropic.com/)
3. **Local LLM**: Use Ollama or similar local models

## 🚀 Deployment

### Docker (Recommended)

```bash
# Build and run
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Railway

```bash
# Install CLI
npm install -g @railway/cli

# Deploy
railway login
railway link
railway up
```

### Heroku

```bash
# Install CLI and deploy
heroku create your-thought-chat-app
git push heroku main

# Set environment variables
heroku config:set GITHUB_APP_ID=123456
heroku config:set GITHUB_PRIVATE_KEY="$(cat private-key.pem)"
# ... other environment variables
```

## 🎨 Customization

### Adding Custom Commands

```javascript
// In src/server.js
processVoiceCommand(command, context) {
    if (command.includes('deploy')) {
        return this.handleDeploy(context);
    }
    // ... existing commands
}
```

### Custom AI Responses

```javascript
// Add your own AI provider
this.aiProviders.set('custom', {
    name: 'My Custom AI',
    generate: async (message, context) => {
        // Your AI logic here
        return "Custom response";
    }
});
```

### UI Theming

Edit `public/style.css` to match your brand:

```css
:root {
    --primary-color: #your-brand-color;
    --background: #your-background;
    --text-color: #your-text-color;
}
```

## 📊 Analytics & Monitoring

### Built-in Metrics
- Voice command usage
- AI response times
- GitHub API usage
- Error rates

### Integration Options
- Sentry for error tracking
- DataDog for performance monitoring
- Custom analytics endpoints

## 🔒 Security

- ✅ Webhook signature verification
- ✅ JWT token authentication
- ✅ Rate limiting
- ✅ Input sanitization
- ✅ HTTPS enforcement
- ✅ Private key encryption

## 🧪 Advanced Features

### Future Roadmap
- **EEG Integration**: Brain-computer interface support
- **Gesture Control**: Hand movement recognition
- **Multi-language**: Support for multiple languages
- **Team Collaboration**: Multi-user voice sessions
- **IDE Integration**: VS Code extension

### Experimental
- Subvocal speech recognition
- Eye tracking controls
- Emotion detection
- Real-time collaboration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Setup

```bash
# Clone and install
git clone https://github.com/protechtimenow/thought-chat-github-app.git
cd thought-chat-github-app
npm install

# Run tests
npm test

# Start development server
npm run dev
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/protechtimenow/thought-chat-github-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/protechtimenow/thought-chat-github-app/discussions)
- **Documentation**: [Wiki](https://github.com/protechtimenow/thought-chat-github-app/wiki)

---

**🧠 Think it, speak it, build it! The future of repository management is conversational.**