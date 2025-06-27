#!/usr/bin/env node

/**
 * Setup script for GitHub App
 * This script helps you create and configure your GitHub App
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

function generateWebhookSecret() {
    return crypto.randomBytes(32).toString('hex');
}

function generateJWTSecret() {
    return crypto.randomBytes(64).toString('hex');
}

async function setupGitHubApp() {
    console.log('\n🧠 Thought Chat GitHub App Setup\n');
    console.log('This script will help you configure your GitHub App.\n');

    // Check if .env already exists
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const overwrite = await question('⚠️  .env file already exists. Overwrite it? (y/N): ');
        if (overwrite.toLowerCase() !== 'y') {
            console.log('Setup cancelled.');
            rl.close();
            return;
        }
    }

    console.log('\n📝 Step 1: GitHub App Information');
    console.log('First, create your GitHub App at: https://github.com/settings/apps/new\n');
    
    console.log('Use these settings:');
    console.log('  App name: Thought Chat Interface (or your preferred name)');
    console.log('  Description: Voice-enabled AI chat interface for developers');
    console.log('  Homepage URL: https://your-domain.com (replace with your domain)');
    console.log('  Webhook URL: https://your-domain.com/webhooks/github');
    console.log('  Webhook secret: (we\'ll generate this)');
    console.log('');
    
    console.log('Permissions needed:');
    console.log('  - Issues: Read & Write');
    console.log('  - Pull requests: Read & Write');
    console.log('  - Contents: Read');
    console.log('  - Metadata: Read');
    console.log('');
    
    console.log('Subscribe to events:');
    console.log('  - Issues, Pull request, Push, Repository');
    console.log('');

    const appId = await question('Enter your GitHub App ID: ');
    const clientId = await question('Enter your GitHub App Client ID: ');
    const clientSecret = await question('Enter your GitHub App Client Secret: ');
    
    console.log('\n📋 Step 2: Private Key');
    console.log('Download your private key from the GitHub App settings page.');
    const privateKeyPath = await question('Enter the path to your private key file (.pem): ');
    
    let privateKey;
    try {
        privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    } catch (error) {
        console.error('❌ Unable to read private key file:', error.message);
        rl.close();
        return;
    }

    console.log('\n🔧 Step 3: Additional Configuration');
    const appUrl = await question('Enter your app URL (e.g., https://your-domain.com): ');
    const openaiKey = await question('Enter your OpenAI API key (optional, press enter to skip): ');
    const anthropicKey = await question('Enter your Anthropic API key (optional, press enter to skip): ');

    // Generate secrets
    const webhookSecret = generateWebhookSecret();
    const jwtSecret = generateJWTSecret();
    const sessionSecret = generateJWTSecret();

    // Create .env file
    const envContent = `# GitHub App Configuration
GITHUB_APP_ID=${appId}
GITHUB_CLIENT_ID=${clientId}
GITHUB_CLIENT_SECRET=${clientSecret}
GITHUB_WEBHOOK_SECRET=${webhookSecret}
GITHUB_PRIVATE_KEY="${privateKey.replace(/\n/g, '\\n')}"

# Server Configuration
PORT=3000
NODE_ENV=development
APP_URL=${appUrl}

# Security
JWT_SECRET=${jwtSecret}
SESSION_SECRET=${sessionSecret}

# AI Services${openaiKey ? `\nOPENAI_API_KEY=${openaiKey}` : '\n# OPENAI_API_KEY=sk-your-key-here'}${anthropicKey ? `\nANTHROPIC_API_KEY=${anthropicKey}` : '\n# ANTHROPIC_API_KEY=sk-ant-your-key-here'}

# Voice Services
# WHISPER_API_URL=https://api.openai.com/v1/audio/transcriptions
# ELEVENLABS_API_KEY=your_elevenlabs_key

# Database (Optional)
# DATABASE_URL=postgres://user:pass@localhost:5432/thoughtchat
# REDIS_URL=redis://localhost:6379

# Monitoring
# SENTRY_DSN=your_sentry_dsn_here
LOG_LEVEL=info
`;

    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ Setup Complete!');
    console.log('');
    console.log('📁 Created .env file with your configuration');
    console.log(`🔐 Generated webhook secret: ${webhookSecret}`);
    console.log('');
    console.log('🚀 Next steps:');
    console.log('1. Update your GitHub App webhook secret with:', webhookSecret);
    console.log('2. Install dependencies: npm install');
    console.log('3. Start the development server: npm run dev');
    console.log('4. Install your app on a repository to test');
    console.log('');
    console.log('🌐 Your app will be available at:', appUrl || 'http://localhost:3000');
    
    rl.close();
}

setupGitHubApp().catch(console.error);