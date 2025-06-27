# 📱 GitHub App Setup Guide

Complete step-by-step guide to create and configure your Thought Chat GitHub App.

## 🎯 Overview

This guide will help you:
1. Create a new GitHub App
2. Configure permissions and webhooks
3. Get your app credentials
4. Set up the server environment
5. Install and test your app

---

## 📝 Step 1: Create GitHub App

### 1.1 Navigate to GitHub App Settings

1. Go to [GitHub Developer Settings](https://github.com/settings/apps)
2. Click **"New GitHub App"**

### 1.2 Basic Information

Fill in the following fields:

| Field | Value |
|-------|-------|
| **GitHub App name** | `Thought Chat Interface` (or your preferred name) |
| **Description** | `Voice-enabled AI chat interface for developers - speak your thoughts, get AI responses` |
| **Homepage URL** | `https://your-domain.com` (replace with your actual domain) |
| **User authorization callback URL** | `https://your-domain.com/auth/callback` |

### 1.3 Webhook Settings

| Field | Value |
|-------|-------|
| **Webhook URL** | `https://your-domain.com/webhooks/github` |
| **Webhook secret** | Generate a random secret (we'll provide this later) |
| **SSL verification** | ✅ Enable |

---

## 🔐 Step 2: Configure Permissions

### 2.1 Repository Permissions

Set these permissions to **Read & Write** or **Read** as specified:

| Permission | Access Level | Why Needed |
|------------|--------------|-------------|
| **Issues** | Read & Write | Create and comment on issues via voice |
| **Pull requests** | Read & Write | Review PRs and add comments |
| **Contents** | Read | Read repository files for context |
| **Metadata** | Read | Access repository information |
| **Repository projects** | Read | Read project boards (optional) |

### 2.2 Account Permissions

Leave all account permissions as **No access** unless you need specific features.

---

## 📡 Step 3: Subscribe to Events

Check these webhook events:

- ✅ **Issues** - When issues are opened, closed, edited
- ✅ **Pull request** - When PRs are opened, closed, edited
- ✅ **Push** - When code is pushed to repository
- ✅ **Repository** - When repository is created, deleted, etc.
- ✅ **Installation** - When app is installed/uninstalled
- ✅ **Installation repositories** - When app access changes

---

## 🏗️ Step 4: App Installation Settings

### 4.1 Where can this GitHub App be installed?

Choose one:

- 🔘 **Only on this account** - Private app, only you can install
- 🔘 **Any account** - Public app, anyone can install

*Recommendation: Start with "Only on this account" for testing*

### 4.2 User-to-server token expiration

- 🔘 **Never expire user-to-server tokens** (easier for development)
- 🔘 **Expire user-to-server tokens** (more secure)

---

## 🎉 Step 5: Create and Get Credentials

### 5.1 Create the App

1. Click **"Create GitHub App"**
2. You'll be redirected to your app's settings page

### 5.2 Copy App Credentials

From the app settings page, copy:

| Credential | Where to Find | Copy This |
|------------|---------------|----------|
| **App ID** | Top of the page | `123456` |
| **Client ID** | OAuth Apps section | `Iv1.a1b2c3d4e5f6g7h8` |
| **Client Secret** | OAuth Apps section | Click "Generate a new client secret" |

### 5.3 Generate Private Key

1. Scroll to **"Private keys"** section
2. Click **"Generate a private key"**
3. A `.pem` file will download automatically
4. **Save this file securely** - you cannot download it again!

### 5.4 Generate Webhook Secret

```bash
# Generate a secure webhook secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated secret and update your GitHub App settings:

1. Go back to your app settings
2. Edit the app
3. Paste the webhook secret
4. Save changes

---

## ⚙️ Step 6: Configure Your Server

### 6.1 Run Setup Script

```bash
# Clone the repository (if you haven't already)
git clone https://github.com/protechtimenow/thought-chat-github-app.git
cd thought-chat-github-app
npm install

# Run interactive setup
npm run setup-app
```

The script will ask for:
- GitHub App ID
- Client ID
- Client Secret
- Path to your private key file
- App URL
- Optional AI API keys

### 6.2 Manual Configuration

If you prefer manual setup, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```bash
# GitHub App Configuration
GITHUB_APP_ID=123456
GITHUB_CLIENT_ID=Iv1.a1b2c3d4e5f6g7h8
GITHUB_CLIENT_SECRET=your_client_secret_here
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
your_private_key_content_here
-----END RSA PRIVATE KEY-----"

# Server Configuration
PORT=3000
APP_URL=https://your-domain.com

# Optional: AI Services
OPENAI_API_KEY=sk-your-key-here
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 6.3 Private Key Setup

The private key needs special formatting in the `.env` file:

```bash
# Convert your private key file to the correct format
cat your-private-key.pem | sed 's/$/\\n/' | tr -d '\n'
```

Or use this Node.js script:

```javascript
const fs = require('fs');
const key = fs.readFileSync('your-private-key.pem', 'utf8');
console.log(key.replace(/\n/g, '\\n'));
```

---

## 🚀 Step 7: Start Your Server

### 7.1 Development Mode

```bash
npm run dev
```

Your server will start at `http://localhost:3000`

### 7.2 Test Health Check

```bash
curl http://localhost:3000/health
# Should return: {"status":"healthy","timestamp":"..."}
```

### 7.3 Test GitHub Webhook

```bash
# Use ngrok for local testing
npx ngrok http 3000

# Update your GitHub App webhook URL to the ngrok URL:
# https://abc123.ngrok.io/webhooks/github
```

---

## 🔧 Step 8: Install Your App

### 8.1 Get Installation URL

Visit: `https://github.com/apps/your-app-name/installations/new`

Or use your server: `http://localhost:3000/install`

### 8.2 Choose Repositories

1. Select repositories to install on
2. Click **"Install & Authorize"**
3. You'll be redirected with installation details

### 8.3 Test Installation

1. Go to one of your installed repositories
2. Create an issue mentioning `@thought-chat help`
3. Your app should respond with available commands

---

## ✅ Step 9: Test Voice Interface

### 9.1 Access the Interface

Visit your app URL with installation ID:
```
https://your-domain.com/?installation_id=123456&repo_owner=yourusername&repo_name=yourrepo
```

### 9.2 Test Voice Commands

1. Click "🎤 Think & Speak"
2. Grant microphone permissions
3. Try saying:
   - "Create an issue about adding tests"
   - "Help me understand this repository"
   - "Generate documentation"

### 9.3 Verify GitHub Integration

Check that your app:
- ✅ Can create issues
- ✅ Can add comments
- ✅ Responds to mentions
- ✅ Shows in repository settings

---

## 🐛 Troubleshooting

### Common Issues

**Webhook delivery failures:**
```bash
# Check GitHub App webhook deliveries
# Go to your app settings → Advanced → Recent Deliveries
```

**Private key errors:**
```bash
# Validate your private key format
node -e "console.log(process.env.GITHUB_PRIVATE_KEY)" | head -1
# Should start with: -----BEGIN RSA PRIVATE KEY-----
```

**Permission errors:**
```bash
# Check your app has the right permissions
# Repository Settings → Integrations → Your App → Configure
```

### Debug Mode

```bash
# Enable verbose logging
DEBUG=* npm run dev

# Check webhook signatures
echo "GITHUB_WEBHOOK_SECRET=${GITHUB_WEBHOOK_SECRET}" >> .env
```

### Test Webhooks Locally

```bash
# Install ngrok globally
npm install -g ngrok

# Expose your local server
ngrok http 3000

# Update your GitHub App webhook URL to:
# https://abc123.ngrok.io/webhooks/github
```

---

## 🎯 Next Steps

✅ **Basic Setup Complete!** Your GitHub App is now ready.

### Immediate Next Steps:
1. **Add AI Integration** - Configure OpenAI or Anthropic for smarter responses
2. **Deploy to Production** - Use Railway, Heroku, or your own server
3. **Customize Commands** - Add your own voice commands and workflows
4. **Monitor Usage** - Set up logging and analytics

### Advanced Features:
1. **Multi-repository Support** - Handle multiple repos in one conversation
2. **Team Collaboration** - Multiple users in voice sessions
3. **CI/CD Integration** - Trigger builds and deployments by voice
4. **Custom AI Models** - Train on your codebase for better responses

---

**🎉 Congratulations!** Your voice-enabled GitHub App is live and ready to revolutionize how you interact with your repositories!

Speak your thoughts, and let AI help you build better software! 🧠💬🚀