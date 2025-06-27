// GitHub App Server for Thought Chat Interface
const { Probot, ProbotOctokit } = require('probot');
const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

class ThoughtChatGitHubApp {
    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.wss = new WebSocket.Server({ server: this.server });
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupWebSocket();
        this.setupProbot();
    }

    setupMiddleware() {
        this.app.use(helmet());
        this.app.use(cors({
            origin: process.env.NODE_ENV === 'production' ? 
                ['https://*.github.com', 'https://*.githubapp.com'] : 
                ['http://localhost:3000', 'http://127.0.0.1:3000']
        }));
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.static(path.join(__dirname, '../public')));
    }

    setupRoutes() {
        // Health check for GitHub
        this.app.get('/health', (req, res) => {
            res.json({ status: 'healthy', timestamp: new Date().toISOString() });
        });

        // Main chat interface
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/index.html'));
        });

        // API endpoints for chat functionality
        this.app.post('/api/chat', this.handleChatMessage.bind(this));
        this.app.post('/api/github/comment', this.createGitHubComment.bind(this));
        this.app.post('/api/github/issue', this.createGitHubIssue.bind(this));
        
        // GitHub App installation flow
        this.app.get('/install', (req, res) => {
            const installUrl = `https://github.com/apps/thought-chat-interface/installations/new`;
            res.redirect(installUrl);
        });
        
        // Post-installation setup
        this.app.get('/setup/:installationId', this.handleSetup.bind(this));
    }

    setupWebSocket() {
        this.wss.on('connection', (ws, req) => {
            console.log('New WebSocket connection for GitHub App');
            
            ws.on('message', async (data) => {
                try {
                    const message = JSON.parse(data);
                    await this.handleWebSocketMessage(ws, message);
                } catch (error) {
                    console.error('WebSocket message error:', error);
                    ws.send(JSON.stringify({ error: 'Invalid message format' }));
                }
            });
        });
    }

    setupProbot() {
        // Initialize Probot for GitHub App functionality
        this.probot = new Probot({
            appId: process.env.GITHUB_APP_ID,
            privateKey: process.env.GITHUB_PRIVATE_KEY,
            secret: process.env.GITHUB_WEBHOOK_SECRET
        });

        // Handle app installation
        this.probot.on('installation.created', async (context) => {
            console.log('App installed:', context.payload.installation.id);
            await this.onAppInstalled(context);
        });

        // Handle repository mentions
        this.probot.on('issues.opened', async (context) => {
            const issue = context.payload.issue;
            if (issue.body.includes('@thought-chat')) {
                await this.handleIsssueMention(context);
            }
        });

        // Handle PR comments
        this.probot.on('pull_request_review_comment.created', async (context) => {
            const comment = context.payload.comment;
            if (comment.body.includes('@thought-chat')) {
                await this.handlePRComment(context);
            }
        });
    }

    async handleChatMessage(req, res) {
        try {
            const { message, repository, installation_id } = req.body;
            
            // Generate AI response
            const response = await this.generateAIResponse(message, {
                repository,
                installation_id
            });

            res.json({ response });
        } catch (error) {
            console.error('Chat message error:', error);
            res.status(500).json({ error: 'Failed to process message' });
        }
    }

    async createGitHubComment(req, res) {
        try {
            const { repository, issue_number, comment, installation_id } = req.body;
            
            const octokit = await this.getInstallationOctokit(installation_id);
            
            await octokit.issues.createComment({
                owner: repository.owner,
                repo: repository.name,
                issue_number,
                body: `🧠 **Thought Chat Response:**\n\n${comment}`
            });

            res.json({ success: true });
        } catch (error) {
            console.error('GitHub comment error:', error);
            res.status(500).json({ error: 'Failed to create comment' });
        }
    }

    async createGitHubIssue(req, res) {
        try {
            const { repository, title, body, installation_id } = req.body;
            
            const octokit = await this.getInstallationOctokit(installation_id);
            
            const issue = await octokit.issues.create({
                owner: repository.owner,
                repo: repository.name,
                title: `🧠 ${title}`,
                body: `*Created via Thought Chat Interface*\n\n${body}`,
                labels: ['thought-chat', 'voice-generated']
            });

            res.json({ issue: issue.data });
        } catch (error) {
            console.error('GitHub issue creation error:', error);
            res.status(500).json({ error: 'Failed to create issue' });
        }
    }

    async handleSetup(req, res) {
        const { installationId } = req.params;
        
        try {
            // Get installation details
            const octokit = await this.getInstallationOctokit(installationId);
            const installation = await octokit.apps.getInstallation({
                installation_id: installationId
            });

            res.json({
                success: true,
                installation: installation.data,
                setup_url: `/?installation_id=${installationId}`
            });
        } catch (error) {
            console.error('Setup error:', error);
            res.status(500).json({ error: 'Setup failed' });
        }
    }

    async generateAIResponse(message, context = {}) {
        // This would integrate with your AI service
        // For now, return a contextual response
        
        const responses = {
            repository: {
                pattern: /repository|repo|project/i,
                response: `I can help you with repository management! You're working with ${context.repository?.name || 'your repository'}. What would you like to do?`
            },
            issue: {
                pattern: /issue|bug|problem/i,
                response: "I can help you create issues or analyze existing ones. Would you like me to create an issue for you?"
            },
            code: {
                pattern: /code|function|class|review/i,
                response: "I can help with code analysis and reviews. Share the code or mention a file and I'll analyze it."
            },
            default: {
                pattern: /.*/,
                response: `You said: "${message}". I'm your GitHub repository assistant. I can help with issues, code reviews, and repository management!`
            }
        };

        for (const [key, config] of Object.entries(responses)) {
            if (config.pattern.test(message)) {
                return config.response;
            }
        }

        return responses.default.response;
    }

    async getInstallationOctokit(installationId) {
        return new ProbotOctokit({
            auth: {
                type: 'installation',
                installationId: parseInt(installationId),
                appId: process.env.GITHUB_APP_ID,
                privateKey: process.env.GITHUB_PRIVATE_KEY
            }
        });
    }

    start(port = process.env.PORT || 3000) {
        this.server.listen(port, () => {
            console.log(`🧠 Thought Chat GitHub App running on port ${port}`);
            console.log(`📡 WebSocket ready for voice chat`);
            console.log(`🔗 Install URL: ${process.env.APP_URL || `http://localhost:${port}`}/install`);
        });
    }
}

// Load environment variables
require('dotenv').config();

// Start the GitHub App
const app = new ThoughtChatGitHubApp();
app.start();

module.exports = ThoughtChatGitHubApp;