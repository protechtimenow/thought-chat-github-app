class GitHubIntegration {
    constructor() {
        this.installationId = this.getInstallationId();
        this.repository = this.getRepositoryInfo();
        this.setupEventListeners();
        this.updateUI();
    }

    getInstallationId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('installation_id') || localStorage.getItem('github_installation_id');
    }

    getRepositoryInfo() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            owner: urlParams.get('repo_owner'),
            name: urlParams.get('repo_name')
        };
    }

    setupEventListeners() {
        document.getElementById('installBtn').addEventListener('click', () => {
            this.redirectToInstall();
        });

        document.getElementById('createIssueBtn').addEventListener('click', () => {
            this.showIssueModal();
        });

        document.getElementById('commentBtn').addEventListener('click', () => {
            this.createComment();
        });

        document.getElementById('reviewBtn').addEventListener('click', () => {
            this.requestCodeReview();
        });

        document.getElementById('docsBtn').addEventListener('click', () => {
            this.generateDocs();
        });

        // Modal event listeners
        const modal = document.getElementById('issueModal');
        const closeBtn = modal.querySelector('.close');
        const cancelBtn = modal.querySelector('.cancel');
        const issueForm = document.getElementById('issueForm');

        closeBtn.addEventListener('click', () => {
            this.hideIssueModal();
        });

        cancelBtn.addEventListener('click', () => {
            this.hideIssueModal();
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                this.hideIssueModal();
            }
        });

        issueForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitIssue();
        });
    }

    updateUI() {
        const repoInfo = document.getElementById('repoInfo');
        const installBtn = document.getElementById('installBtn');

        if (this.installationId) {
            repoInfo.textContent = this.repository.name ? 
                `Connected to ${this.repository.owner}/${this.repository.name}` : 
                'Connected to GitHub App';
            installBtn.textContent = '⚙️ Configured';
            installBtn.style.background = '#238636';
        } else {
            repoInfo.textContent = 'Not connected to GitHub';
            installBtn.textContent = '🔗 Install App';
            installBtn.style.background = '#da3633';
        }
    }

    redirectToInstall() {
        if (this.installationId) {
            // Already installed, show setup
            window.open(`/setup/${this.installationId}`, '_blank');
        } else {
            // Redirect to GitHub App installation
            window.open('https://github.com/apps/thought-chat-interface/installations/new', '_blank');
        }
    }

    showIssueModal() {
        const modal = document.getElementById('issueModal');
        modal.style.display = 'block';
    }

    hideIssueModal() {
        const modal = document.getElementById('issueModal');
        modal.style.display = 'none';
        document.getElementById('issueForm').reset();
    }

    async submitIssue() {
        const title = document.getElementById('issueTitle').value;
        const body = document.getElementById('issueBody').value;

        if (!this.installationId) {
            alert('Please install the GitHub App first!');
            return;
        }

        try {
            const response = await fetch('/api/github/issue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    repository: this.repository,
                    title,
                    body,
                    installation_id: this.installationId
                })
            });

            const result = await response.json();
            
            if (response.ok) {
                alert(`Issue created successfully! #${result.issue.number}`);
                this.hideIssueModal();
                
                // Add to chat as confirmation
                if (window.thoughtChatApp) {
                    window.thoughtChatApp.addMessage('assistant', 
                        `✅ Created GitHub issue: "${title}" - #${result.issue.number}`);
                }
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error creating issue:', error);
            alert('Failed to create issue: ' + error.message);
        }
    }

    async createComment() {
        if (!this.installationId) {
            alert('Please install the GitHub App first!');
            return;
        }

        const issueNumber = prompt('Enter issue/PR number to comment on:');
        const comment = prompt('Enter your comment:');

        if (!issueNumber || !comment) return;

        try {
            const response = await fetch('/api/github/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    repository: this.repository,
                    issue_number: parseInt(issueNumber),
                    comment,
                    installation_id: this.installationId
                })
            });

            const result = await response.json();
            
            if (response.ok) {
                alert('Comment added successfully!');
                
                if (window.thoughtChatApp) {
                    window.thoughtChatApp.addMessage('assistant', 
                        `✅ Added comment to issue #${issueNumber}`);
                }
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error creating comment:', error);
            alert('Failed to create comment: ' + error.message);
        }
    }

    async requestCodeReview() {
        if (!this.installationId) {
            alert('Please install the GitHub App first!');
            return;
        }

        const prNumber = prompt('Enter Pull Request number for review:');
        
        if (!prNumber) return;

        // This would trigger the AI to analyze the PR
        if (window.thoughtChatApp) {
            window.thoughtChatApp.addMessage('user', `Review PR #${prNumber}`);
            window.thoughtChatApp.addMessage('assistant', 
                `🔍 Analyzing Pull Request #${prNumber}... I'll provide a detailed code review shortly.`);
        }
    }

    async generateDocs() {
        if (window.thoughtChatApp) {
            window.thoughtChatApp.addMessage('user', 'Generate documentation');
            window.thoughtChatApp.addMessage('assistant', 
                `📚 I can help generate documentation! Which part would you like me to document? You can say:
                \n• "Document the main functions"
                \n• "Create a README file"
                \n• "Generate API docs"
                \n• "Write user guide"`);
        }
    }

    // Voice command processing
    processVoiceCommand(text) {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('create issue') || lowerText.includes('new issue')) {
            this.showIssueModal();
            return true;
        }
        
        if (lowerText.includes('add comment') || lowerText.includes('comment on')) {
            this.createComment();
            return true;
        }
        
        if (lowerText.includes('review') || lowerText.includes('code review')) {
            this.requestCodeReview();
            return true;
        }
        
        if (lowerText.includes('documentation') || lowerText.includes('generate docs')) {
            this.generateDocs();
            return true;
        }
        
        return false;
    }
}

// Initialize GitHub integration
const gitHubIntegration = new GitHubIntegration();